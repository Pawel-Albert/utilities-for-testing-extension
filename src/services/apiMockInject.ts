import {getApiMockState, toRuntimeState} from './apiMockStorage'

const canInjectIntoUrl = (url?: string): boolean => {
  if (!url) return false
  return /^(https?|file):/.test(url)
}

export async function injectApiMockInterceptor(tabId: number): Promise<void> {
  const state = toRuntimeState(await getApiMockState())

  await chrome.scripting.executeScript({
    target: {tabId},
    world: 'MAIN',
    injectImmediately: true,
    func: runtimeState => {
      const pageWindow = window as Window & {__TU_API_MOCK_STATE__?: unknown}
      pageWindow.__TU_API_MOCK_STATE__ = runtimeState
    },
    args: [state]
  })

  await chrome.scripting.executeScript({
    target: {tabId},
    world: 'MAIN',
    injectImmediately: true,
    files: ['src/content_scripts/api_mock/interceptor.js']
  })
}

export async function injectApiMockPanel(tabId: number): Promise<void> {
  await injectApiMockInterceptor(tabId)
  await chrome.scripting.executeScript({
    target: {tabId},
    files: ['src/content_scripts/api_mock/panel.js']
  })
}

export async function openApiMockOnTab(tab?: chrome.tabs.Tab): Promise<void> {
  if (!tab?.id) {
    throw new Error('No active tab')
  }
  if (!canInjectIntoUrl(tab.url)) {
    throw new Error('API Mock cannot run on this page. Open a regular http(s) tab.')
  }

  await injectApiMockPanel(tab.id)
}

export async function ensureInterceptorForSender(
  sender: chrome.runtime.MessageSender
): Promise<void> {
  const tabId = sender.tab?.id
  if (!tabId || !canInjectIntoUrl(sender.tab?.url)) return

  const state = await getApiMockState()
  if (!state.enabled) return

  await injectApiMockInterceptor(tabId)
}
