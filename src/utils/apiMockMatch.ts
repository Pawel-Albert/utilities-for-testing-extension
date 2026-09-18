import type {ApiMockRule} from '../types/apiMock'

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const resolveAbsoluteUrl = (url: string, base = location.href): string => {
  try {
    return new URL(url, base).href
  } catch {
    return url
  }
}

export const matchesUrlPattern = (url: string, pattern: string): boolean => {
  const trimmed = pattern.trim()
  if (!trimmed) return false

  const absoluteUrl = resolveAbsoluteUrl(url)
  if (!trimmed.includes('*')) {
    return absoluteUrl.toLowerCase().includes(trimmed.toLowerCase())
  }

  const regex = new RegExp(`^${escapeRegExp(trimmed).replace(/\\\*/g, '.*')}$`, 'i')
  if (regex.test(absoluteUrl) || regex.test(url)) return true

  const containsRegex = new RegExp(escapeRegExp(trimmed).replace(/\\\*/g, '.*'), 'i')
  return containsRegex.test(absoluteUrl) || containsRegex.test(url)
}

export const findMatchingApiMockRule = (
  rules: ApiMockRule[],
  url: string,
  method: string
): ApiMockRule | undefined => {
  const requestMethod = method.toUpperCase()
  return rules.find(rule => {
    if (!rule.enabled || !rule.urlPattern.trim()) return false
    if (rule.method !== '*' && rule.method !== requestMethod) return false
    return matchesUrlPattern(url, rule.urlPattern)
  })
}
