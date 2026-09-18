import {attachNetworkCapture} from './networkCapture'
import type {CapturedNetworkRequest} from '../../types/apiMock'

const MAX_ROWS = 80
const buffer: CapturedNetworkRequest[] = []

const publish = (item: CapturedNetworkRequest) => {
  const existing = buffer.findIndex(row => row.id === item.id)
  if (existing >= 0) buffer.splice(existing, 1)
  buffer.unshift(item)
  if (buffer.length > MAX_ROWS) buffer.pop()
  chrome.runtime.sendMessage({type: 'API_MOCK_DEVTOOLS_REQUEST', item}, () => {
    void chrome.runtime.lastError
  })
}

chrome.devtools.panels.create(
  'API Mock',
  '',
  'src/pages/devtools/apiMockDevtools.html',
  () => undefined
)

attachNetworkCapture(publish)

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'API_MOCK_DEVTOOLS_GET_BUFFER') {
    sendResponse({items: buffer})
    return true
  }
  if (message?.type === 'API_MOCK_DEVTOOLS_CLEAR_BUFFER') {
    buffer.splice(0, buffer.length)
    sendResponse({ok: true})
    return true
  }
})
