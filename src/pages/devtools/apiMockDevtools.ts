import {addCapturedApiMockRule, prettyJsonBody} from '../../services/apiMockStorage'
import type {CapturedNetworkRequest} from '../../types/apiMock'
import {attachNetworkCapture} from './networkCapture'

const requests: CapturedNetworkRequest[] = []
let selectedId = ''
const inspectedTabId = chrome.devtools.inspectedWindow.tabId

const listEl = document.getElementById('requestList') as HTMLElement
const detailsEl = document.getElementById('details') as HTMLElement
const statusBar = document.getElementById('statusBar') as HTMLElement
const clearButton = document.getElementById('clearButton') as HTMLButtonElement
const addRuleButton = document.getElementById('addRuleButton') as HTMLButtonElement

const belongsToInspectedTab = (item: CapturedNetworkRequest) =>
  item.tabId == null || item.tabId === inspectedTabId

const isNoiseMethod = (method: string) => {
  const upper = method.toUpperCase()
  return upper === 'OPTIONS' || upper === 'HEAD' || upper === 'TRACE' || upper === 'CONNECT'
}

const bodyLooksUseful = (body: string) => {
  const trimmed = body.trim()
  if (!trimmed) return false
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return true
  try {
    JSON.parse(trimmed)
    return true
  } catch {
    return trimmed.length > 8
  }
}

const upsert = (item: CapturedNetworkRequest) => {
  if (!belongsToInspectedTab(item)) return
  if (isNoiseMethod(item.method)) return

  item.body = prettyJsonBody(item.body || '')

  const duplicate = requests.find(
    row => row.method === item.method && row.url === item.url && row.id !== item.id
  )
  if (duplicate) {
    if (!duplicate.requestHeaders && item.requestHeaders) {
      duplicate.requestHeaders = item.requestHeaders
    }
    if (item.requestHeaders.length > duplicate.requestHeaders.length) {
      duplicate.requestHeaders = item.requestHeaders
    }
    if (item.responseHeaders.length > duplicate.responseHeaders.length) {
      duplicate.responseHeaders = item.responseHeaders
    }
    if (item.status) duplicate.status = item.status
    if (bodyLooksUseful(item.body) && item.body.length >= duplicate.body.length) {
      duplicate.body = item.body
    }
    if (item.resourceType && item.resourceType !== 'unknown') {
      duplicate.resourceType = item.resourceType
    }
    renderList()
    statusBar.textContent = `${requests.length} request(s) captured`
    if (selectedId === duplicate.id) renderDetails(duplicate)
    return
  }

  const index = requests.findIndex(row => row.id === item.id)
  if (index >= 0) {
    const current = requests[index]
    if (bodyLooksUseful(current.body) && !bodyLooksUseful(item.body)) {
      item.body = current.body
    }
    requests.splice(index, 1)
  }
  requests.unshift(item)
  if (requests.length > 80) requests.pop()
  renderList()
  statusBar.textContent = `${requests.length} request(s) captured`
  if (selectedId === item.id) renderDetails(item)
}

const ingestItems = (items: CapturedNetworkRequest[] | undefined) => {
  if (!items?.length) return
  items
    .slice()
    .reverse()
    .forEach(item => upsert(item))
}

const renderList = () => {
  listEl.textContent = ''
  if (requests.length === 0) {
    const empty = document.createElement('div')
    empty.className = 'empty'
    empty.textContent = 'No requests yet. Reload the page with this tab open.'
    listEl.appendChild(empty)
    return
  }

  requests.forEach(item => {
    const row = document.createElement('div')
    row.className = `row${item.id === selectedId ? ' active' : ''}`

    const method = document.createElement('span')
    method.className = 'method'
    method.textContent = item.method
    const status = document.createElement('span')
    status.className = 'status'
    status.textContent = String(item.status || '')
    const url = document.createElement('span')
    url.className = 'url'
    url.textContent = item.url
    row.append(method, status, url)

    row.addEventListener('click', () => {
      selectedId = item.id
      renderList()
      renderDetails(item)
    })
    listEl.appendChild(row)
  })
}

const renderDetails = (item: CapturedNetworkRequest) => {
  detailsEl.textContent = ''
  addRuleButton.disabled = false

  const scroll = document.createElement('div')
  scroll.className = 'details-scroll'

  const meta = document.createElement('div')
  meta.className = 'meta'
  ;[
    ['Method', item.method],
    ['Status', String(item.status)],
    ['Type', item.resourceType || 'unknown'],
    ['URL', item.url]
  ].forEach(([label, value]) => {
    const line = document.createElement('div')
    const strong = document.createElement('strong')
    strong.textContent = `${label}: `
    line.append(strong, document.createTextNode(value))
    meta.appendChild(line)
  })
  scroll.appendChild(meta)

  const addBlock = (title: string, content: string, open = false) => {
    const wrap = document.createElement('details')
    wrap.className = 'block'
    if (open) wrap.open = true
    const heading = document.createElement('summary')
    heading.textContent = title
    const pre = document.createElement('pre')
    pre.textContent = content || '—'
    wrap.append(heading, pre)
    scroll.appendChild(wrap)
  }

  addBlock('Request headers', item.requestHeaders)
  addBlock('Response headers', item.responseHeaders)
  addBlock('Response payload', item.body, true)

  detailsEl.appendChild(scroll)
}

clearButton.addEventListener('click', () => {
  requests.splice(0, requests.length)
  selectedId = ''
  addRuleButton.disabled = true
  detailsEl.textContent = ''
  const empty = document.createElement('div')
  empty.className = 'empty'
  empty.textContent = 'Select a request from the list.'
  detailsEl.appendChild(empty)
  renderList()
  statusBar.textContent = 'Waiting for requests…'
  chrome.runtime.sendMessage({type: 'API_MOCK_DEVTOOLS_CLEAR_BUFFER'}, () => {
    void chrome.runtime.lastError
  })
})

addRuleButton.addEventListener('click', async () => {
  const item = requests.find(row => row.id === selectedId)
  if (!item) return
  addRuleButton.disabled = true
  try {
    const rule = await addCapturedApiMockRule({
      url: item.url,
      method: item.method,
      status: item.status,
      responseBody: item.body
    })
    statusBar.textContent = `Rule added: ${rule.method} ${rule.urlPattern}`
  } catch (error) {
    statusBar.textContent = error instanceof Error ? error.message : String(error)
  } finally {
    addRuleButton.disabled = false
  }
})

attachNetworkCapture(upsert)

chrome.runtime.onMessage.addListener(message => {
  if (message?.type === 'API_MOCK_DEVTOOLS_REQUEST' && message.item) {
    upsert(message.item as CapturedNetworkRequest)
  }
})

const connectDevtoolsPort = () => {
  const port = chrome.runtime.connect({name: 'api-mock-devtools'})
  port.onMessage.addListener(message => {
    if (message?.type === 'API_MOCK_DEVTOOLS_REQUEST' && message.item) {
      upsert(message.item as CapturedNetworkRequest)
      return
    }
    if (message?.type === 'API_MOCK_DEVTOOLS_BUFFER') {
      ingestItems(message.items as CapturedNetworkRequest[] | undefined)
    }
  })
  port.onDisconnect.addListener(() => {
    setTimeout(connectDevtoolsPort, 400)
  })
}

connectDevtoolsPort()

chrome.runtime.sendMessage({type: 'API_MOCK_DEVTOOLS_GET_BUFFER'}, response => {
  void chrome.runtime.lastError
  ingestItems(response?.items as CapturedNetworkRequest[] | undefined)
  if (!requests.length) {
    statusBar.textContent = 'Waiting for requests. Reload the page if the list stays empty.'
  }
})
