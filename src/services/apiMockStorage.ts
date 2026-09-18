import {
  API_MOCK_STORAGE_KEY,
  createEmptyApiMockRule,
  defaultApiMockState,
  type ApiMockMethod,
  type ApiMockRule,
  type ApiMockState
} from '../types/apiMock'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

export const normalizeApiMockState = (value: unknown): ApiMockState => {
  if (!isRecord(value)) return {...defaultApiMockState, rules: [], panel: {...defaultApiMockState.panel}}

  const panel = isRecord(value.panel) ? value.panel : {}
  const rules = Array.isArray(value.rules) ? value.rules : []

  return {
    enabled: Boolean(value.enabled),
    rules: rules
      .filter(isRecord)
      .map(rule => ({
        id: String(rule.id || ''),
        enabled: rule.enabled !== false,
        label: String(rule.label || ''),
        urlPattern: String(rule.urlPattern || ''),
        method: (rule.method as ApiMockState['rules'][number]['method']) || '*',
        status: Number(rule.status) || 200,
        delayMs: Math.max(0, Number(rule.delayMs) || 0),
        responseBody: String(rule.responseBody ?? '')
      }))
      .filter(rule => rule.id),
    panel: {
      x: Number(panel.x) || defaultApiMockState.panel.x,
      y: Number(panel.y) || defaultApiMockState.panel.y,
      minimized: Boolean(panel.minimized)
    }
  }
}

export async function getApiMockState(): Promise<ApiMockState> {
  const result = await chrome.storage.local.get(API_MOCK_STORAGE_KEY)
  return normalizeApiMockState(result[API_MOCK_STORAGE_KEY])
}

export async function saveApiMockState(state: ApiMockState): Promise<void> {
  await chrome.storage.local.set({[API_MOCK_STORAGE_KEY]: normalizeApiMockState(state)})
}

export function toRuntimeState(state: ApiMockState) {
  return {
    enabled: state.enabled,
    rules: state.rules
  }
}

const HTTP_METHODS: ApiMockMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

export const toApiMockMethod = (method: string): ApiMockMethod => {
  const upper = method.toUpperCase()
  return HTTP_METHODS.includes(upper as ApiMockMethod) ? (upper as ApiMockMethod) : '*'
}

export const prettyJsonBody = (raw: string): string => {
  const text = stripCapturedBodyNoise(String(raw || ''))
  if (!text) return ''
  try {
    return JSON.stringify(JSON.parse(text), null, 2)
  } catch {
    return text
  }
}

const stripCapturedBodyNoise = (raw: string): string => {
  let text = raw.replace(/^\uFEFF/, '').trim()
  if (!text || text === 'undefined' || text === 'null') return text === 'null' ? 'null' : ''

  text = text
    .replace(/^\)\]\}',?\s*/, '')
    .replace(/^for\s*\(\s*;\s*;\s*\);?\s*/, '')
    .replace(/^while\s*\(\s*1\s*\);?\s*/, '')

  const jsonStart = text.search(/[\{\[]/)
  if (jsonStart > 0 && jsonStart < 32) {
    const sliced = text.slice(jsonStart)
    try {
      JSON.parse(sliced)
      text = sliced
    } catch {
      // keep original
    }
  }

  return text
}

export async function addCapturedApiMockRule(capture: {
  url: string
  method: string
  status: number
  responseBody: string
}): Promise<ApiMockRule> {
  const state = await getApiMockState()
  const rule = createEmptyApiMockRule()
  let urlPattern = capture.url.split('#')[0]
  try {
    const parsed = new URL(capture.url)
    urlPattern = `${parsed.origin}${parsed.pathname}`
  } catch {
    // keep raw url without hash
  }

  const lastSegment = urlPattern.split('/').filter(Boolean).pop() || ''
  rule.label = lastSegment
  rule.urlPattern = urlPattern
  rule.method = toApiMockMethod(capture.method)
  rule.status = capture.status || 200
  rule.responseBody = prettyJsonBody(capture.responseBody || '')
  rule.enabled = true
  state.rules.unshift(rule)
  await saveApiMockState(state)
  return rule
}
