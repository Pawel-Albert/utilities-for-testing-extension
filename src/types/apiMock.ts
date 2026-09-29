export type ApiMockMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | '*'

export type ApiMockRuleAction = 'mock-response' | 'rewrite-payload' | 'redirect-request'

export type ApiMockRule = {
  id: string
  enabled: boolean
  label: string
  urlPattern: string
  method: ApiMockMethod
  action: ApiMockRuleAction
  status: number
  delayMs: number
  responseBody: string
  requestPayload: string
  redirectUrl: string
}

export type ApiMockPanelPosition = {
  x: number
  y: number
  minimized: boolean
}

export type ApiMockState = {
  enabled: boolean
  rules: ApiMockRule[]
  panel: ApiMockPanelPosition
}

export type ApiMockRuntimeState = {
  enabled: boolean
  rules: ApiMockRule[]
}

export type ApiMockHit = {
  ruleId: string
  label: string
  method: string
  url: string
  status: number
  action: ApiMockRuleAction
  targetUrl?: string
  at: number
}

export type CapturedNetworkRequest = {
  id: string
  method: string
  url: string
  status: number
  requestHeaders: string
  requestBody: string
  responseHeaders: string
  body: string
  resourceType: string
  tabId?: number
}

export const API_MOCK_STORAGE_KEY = 'apiMockState'
export const API_MOCK_HOST_ID = 'tu-api-mock-host'
export const API_MOCK_BRIDGE_SOURCE = 'TU_API_MOCK_BRIDGE'
export const API_MOCK_INTERCEPTOR_SOURCE = 'TU_API_MOCK_INTERCEPTOR'
export const API_MOCK_STATE_WINDOW_KEY = '__TU_API_MOCK_STATE__'
export const API_MOCK_RUNTIME_WINDOW_KEY = '__TU_API_MOCK_RUNTIME__'
export const API_MOCK_INSTALLED_WINDOW_KEY = '__TU_API_MOCK_INSTALLED__'

export const defaultApiMockState: ApiMockState = {
  enabled: false,
  rules: [],
  panel: {x: 24, y: 24, minimized: false}
}

export const createEmptyApiMockRule = (): ApiMockRule => ({
  id:
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `rule-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  enabled: true,
  label: '',
  urlPattern: '',
  method: '*',
  action: 'mock-response',
  status: 200,
  delayMs: 0,
  responseBody: '{\n  \n}',
  requestPayload: '',
  redirectUrl: ''
})
