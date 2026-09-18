import {prettyJsonBody} from '../../services/apiMockStorage'
import type {CapturedNetworkRequest} from '../../types/apiMock'

type NetworkEntry = chrome.devtools.network.Request & {
  _resourceType?: string
  startedDateTime?: string
}

type HarContent = {
  text?: string
  encoding?: string
}

const SKIP_TYPES = new Set([
  'image',
  'stylesheet',
  'font',
  'media',
  'document',
  'manifest',
  'ping',
  'texttrack',
  'signedexchange',
  'cspviolationreport',
  'script',
  'preflight'
])

const SKIP_METHODS = new Set(['OPTIONS', 'HEAD', 'TRACE', 'CONNECT'])

const formatHeaders = (headers: Array<{name: string; value: string}> | undefined) =>
  (headers || []).map(header => `${header.name}: ${header.value}`).join('\n')

const resourceTypeOf = (entry: NetworkEntry): string =>
  String(entry._resourceType || '').toLowerCase()

const decodeBase64Utf8 = (value: string): string => {
  try {
    const binary = atob(value)
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    return value
  }
}

const bodyFromHar = (entry: NetworkEntry, fallback = ''): string => {
  const content = (
    entry.response as chrome.devtools.network.Request['response'] & {
      content?: HarContent
    }
  ).content
  const raw = content?.text || fallback
  if (!raw) return ''
  if (String(content?.encoding || '').toLowerCase() === 'base64') {
    return prettyJsonBody(decodeBase64Utf8(raw))
  }
  return prettyJsonBody(raw)
}

const shouldKeep = (entry: NetworkEntry): boolean => {
  const url = entry.request?.url || ''
  const method = String(entry.request?.method || '').toUpperCase()
  if (SKIP_METHODS.has(method)) return false
  if (!/^https?:/i.test(url)) return false
  const type = resourceTypeOf(entry)
  if (!type) return true
  return !SKIP_TYPES.has(type)
}

const toCaptured = (entry: NetworkEntry, body = ''): CapturedNetworkRequest => ({
  id: `${entry.startedDateTime || Date.now()}-${entry.request?.method}-${entry.request?.url}`,
  method: entry.request?.method || 'GET',
  url: entry.request?.url || '',
  status: entry.response?.status || 0,
  requestHeaders: formatHeaders(entry.request?.headers),
  responseHeaders: formatHeaders(entry.response?.headers),
  body: prettyJsonBody(body || ''),
  resourceType: resourceTypeOf(entry) || 'unknown',
  tabId: chrome.devtools?.inspectedWindow?.tabId
})

const captureEntry = (
  entry: NetworkEntry,
  onItem: (item: CapturedNetworkRequest) => void
) => {
  if (!shouldKeep(entry)) return
  const item = toCaptured(entry, bodyFromHar(entry))
  onItem(item)

  if (typeof entry.getContent !== 'function') return

  try {
    entry.getContent((content, encoding) => {
      const raw = content || ''
      const decoded =
        String(encoding || '').toLowerCase() === 'base64' ? decodeBase64Utf8(raw) : raw
      const nextBody = prettyJsonBody(decoded)
      if (!nextBody) return
      if (item.body && nextBody.length < item.body.length && item.body.trim().startsWith('{')) {
        return
      }
      item.body = nextBody
      onItem(item)
    })
  } catch {
    // Already published without a body.
  }
}

export const attachNetworkCapture = (
  onItem: (item: CapturedNetworkRequest) => void
): void => {
  if (!chrome.devtools?.network) return

  chrome.devtools.network.onRequestFinished.addListener(request => {
    captureEntry(request as NetworkEntry, onItem)
  })

  chrome.devtools.network.getHAR(harLog => {
    const entries = (harLog.entries || []) as NetworkEntry[]
    entries.forEach(entry => captureEntry(entry, onItem))
  })
}
