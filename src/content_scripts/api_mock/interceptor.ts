type InterceptorRule = {
  id: string
  enabled: boolean
  label: string
  urlPattern: string
  method: string
  status: number
  delayMs: number
  responseBody: string
}

type InterceptorState = {
  enabled: boolean
  rules: InterceptorRule[]
}

type InterceptorHit = {
  ruleId: string
  label: string
  method: string
  url: string
  status: number
  at: number
}

type InterceptorStats = {
  total: number
  byRuleId: Record<string, number>
  log: InterceptorHit[]
}

type InterceptorWindow = Window & {
  __TU_API_MOCK_STATE__?: InterceptorState
  __TU_API_MOCK_RUNTIME__?: InterceptorState
  __TU_API_MOCK_INSTALLED__?: boolean
  __TU_API_MOCK_STATS__?: InterceptorStats
}

(() => {
  const win = window as InterceptorWindow
  const incoming = win.__TU_API_MOCK_STATE__
  const runtime: InterceptorState = win.__TU_API_MOCK_RUNTIME__ || {
    enabled: false,
    rules: []
  }

  if (incoming) {
    runtime.enabled = Boolean(incoming.enabled)
    runtime.rules = Array.isArray(incoming.rules) ? incoming.rules : []
  }

  win.__TU_API_MOCK_RUNTIME__ = runtime
  const stats: InterceptorStats = win.__TU_API_MOCK_STATS__ || {
    total: 0,
    byRuleId: {},
    log: []
  }
  win.__TU_API_MOCK_STATS__ = stats

  const escapeRegExp = (value: string): string =>
    value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const resolveAbsoluteUrl = (url: string): string => {
    try {
      return new URL(url, location.href).href
    } catch {
      return String(url)
    }
  }

  const matchesUrlPattern = (url: string, pattern: string): boolean => {
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

  const findRule = (url: string, method: string): InterceptorRule | undefined => {
    const requestMethod = method.toUpperCase()
    return runtime.rules.find(rule => {
      if (!rule.enabled || !rule.urlPattern.trim()) return false
      if (rule.method !== '*' && String(rule.method).toUpperCase() !== requestMethod) {
        return false
      }
      return matchesUrlPattern(url, rule.urlPattern)
    })
  }

  const statusTextFrom = (status: number): string => {
    const map: Record<number, string> = {
      200: 'OK',
      201: 'Created',
      204: 'No Content',
      301: 'Moved Permanently',
      302: 'Found',
      304: 'Not Modified',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable'
    }
    return map[status] || ''
  }

  const emitHit = (rule: InterceptorRule, url: string, method: string) => {
    const hit: InterceptorHit = {
      ruleId: rule.id,
      label: rule.label,
      method,
      url,
      status: rule.status || 200,
      at: Date.now()
    }
    stats.total += 1
    stats.byRuleId[rule.id] = (stats.byRuleId[rule.id] || 0) + 1
    stats.log.unshift(hit)
    stats.log = stats.log.slice(0, 8)

    console.info(
      `%c[API Mock]%c ${method} ${url} → ${hit.status}${
        rule.label ? ` (${rule.label})` : ''
      }  #${stats.total}`,
      'background:#2196f3;color:#fff;padding:1px 6px;border-radius:3px;font-weight:700',
      'color:#1565c0;font-weight:600'
    )

    window.postMessage(
      {
        source: 'TU_API_MOCK_INTERCEPTOR',
        type: 'HIT',
        hit,
        stats: {
          total: stats.total,
          byRuleId: {...stats.byRuleId},
          log: stats.log.slice()
        }
      },
      '*'
    )
  }

  const MAX_CAPTURE_BODY = 200_000
  const SKIP_CAPTURE_EXT =
    /\.(png|jpe?g|gif|webp|svg|ico|css|woff2?|ttf|eot|map|mp4|webm|mp3)(\?|$)/i

  const shouldSkipCapture = (url: string): boolean => {
    if (
      url.startsWith('chrome-extension://') ||
      url.startsWith('moz-extension://') ||
      url.startsWith('data:') ||
      url.startsWith('blob:')
    ) {
      return true
    }
    return SKIP_CAPTURE_EXT.test(url)
  }

  const emitCapture = (item: {
    method: string
    url: string
    status: number
    body: string
    responseHeaders: string
    resourceType: string
  }) => {
    if (shouldSkipCapture(item.url)) return
    if (item.method === 'OPTIONS' || item.method === 'HEAD') return
    window.postMessage(
      {
        source: 'TU_API_MOCK_INTERCEPTOR',
        type: 'CAPTURE',
        item: {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}-${item.method}-${item.url}`,
          method: item.method,
          url: resolveAbsoluteUrl(item.url),
          status: item.status,
          requestHeaders: '',
          responseHeaders: item.responseHeaders || '',
          body: (item.body || '').slice(0, MAX_CAPTURE_BODY),
          resourceType: item.resourceType
        }
      },
      '*'
    )
  }

  const headersFromResponse = (response: Response): string => {
    const lines: string[] = []
    response.headers.forEach((value, name) => {
      lines.push(`${name}: ${value}`)
    })
    return lines.join('\n')
  }

  const captureFetchResponse = (url: string, method: string, response: Response) => {
    void (async () => {
      try {
        const clone = response.clone()
        const contentType = clone.headers.get('content-type') || ''
        const length = Number(clone.headers.get('content-length') || '0')
        let body = ''
        if (length <= MAX_CAPTURE_BODY) {
          if (!contentType || /json|text|xml|javascript|urlencoded/i.test(contentType)) {
            body = await clone.text()
          }
        }
        emitCapture({
          method,
          url,
          status: response.status,
          body,
          responseHeaders: headersFromResponse(clone),
          resourceType: 'fetch'
        })
      } catch {
        // Ignore capture failures so the page request still succeeds.
      }
    })()
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const readRequestUrl = (input: RequestInfo | URL): string => {
    if (typeof input === 'string') return input
    if (input instanceof URL) return input.href
    if (typeof Request !== 'undefined' && input instanceof Request) return input.url
    return String(input)
  }

  const readRequestMethod = (input: RequestInfo | URL, init?: RequestInit): string => {
    if (init?.method) return String(init.method).toUpperCase()
    if (typeof Request !== 'undefined' && input instanceof Request) {
      return input.method.toUpperCase()
    }
    return 'GET'
  }

  const applyBridgeState = (state: InterceptorState) => {
    runtime.enabled = Boolean(state.enabled)
    runtime.rules = Array.isArray(state.rules) ? state.rules : []
  }

  window.addEventListener('message', event => {
    if (event.source !== window) return
    const data = event.data
    if (!data || data.source !== 'TU_API_MOCK_BRIDGE' || data.type !== 'STATE') return
    if (data.state) applyBridgeState(data.state as InterceptorState)
  })

  if (win.__TU_API_MOCK_INSTALLED__) return
  win.__TU_API_MOCK_INSTALLED__ = true

  const originalFetch = window.fetch.bind(window)
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = readRequestUrl(input)
    if (url.startsWith('chrome-extension://') || url.startsWith('moz-extension://')) {
      return originalFetch(input, init)
    }

    const method = readRequestMethod(input, init)
    if (method === 'OPTIONS' || method === 'HEAD') {
      return originalFetch(input, init)
    }
    if (runtime.enabled) {
      const rule = findRule(url, method)
      if (rule) {
        emitHit(rule, resolveAbsoluteUrl(url), method)
        if (rule.delayMs > 0) await sleep(rule.delayMs)
        const body = rule.responseBody ?? ''
        emitCapture({
          method,
          url,
          status: rule.status || 200,
          body,
          responseHeaders: 'content-type: application/json',
          resourceType: 'mock'
        })
        return new Response(body, {
          status: rule.status || 200,
          statusText: statusTextFrom(rule.status || 200),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
    }

    const response = await originalFetch(input, init)
    captureFetchResponse(url, method, response)
    return response
  }

  const originalOpen = XMLHttpRequest.prototype.open
  const originalSend = XMLHttpRequest.prototype.send
  const originalAbort = XMLHttpRequest.prototype.abort
  const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader

  type MockedXhr = XMLHttpRequest & {
    __tuMock?: {method: string; url: string}
    __tuTimer?: number
    __tuMocked?: boolean
  }

  XMLHttpRequest.prototype.open = function (
    this: MockedXhr,
    method: string,
    url: string | URL,
    async?: boolean,
    username?: string | null,
    password?: string | null
  ) {
    this.__tuMock = {
      method: String(method).toUpperCase(),
      url: String(url)
    }
    this.__tuMocked = false
    return originalOpen.call(this, method, url, async ?? true, username, password)
  }

  XMLHttpRequest.prototype.setRequestHeader = function (
    this: MockedXhr,
    name: string,
    value: string
  ) {
    if (this.__tuMocked) return
    return originalSetRequestHeader.call(this, name, value)
  }

  XMLHttpRequest.prototype.abort = function (this: MockedXhr) {
    if (this.__tuTimer) {
      window.clearTimeout(this.__tuTimer)
      this.__tuTimer = undefined
    }
    return originalAbort.call(this)
  }

  const applyMockedXhr = (xhr: MockedXhr, rule: InterceptorRule) => {
    const body = rule.responseBody ?? ''
    const status = rule.status || 200
    let jsonResponse: unknown = body
    if (xhr.responseType === 'json') {
      try {
        jsonResponse = body ? JSON.parse(body) : null
      } catch {
        jsonResponse = null
      }
    }

    xhr.__tuMocked = true

    const define = (name: string, value: unknown) => {
      try {
        Object.defineProperty(xhr, name, {
          configurable: true,
          enumerable: true,
          get: () => value
        })
      } catch {
        const target = xhr as unknown as Record<string, unknown>
        target[name] = value
      }
    }

    define('readyState', 4)
    define('status', status)
    define('statusText', statusTextFrom(status))
    define('responseURL', resolveAbsoluteUrl(xhr.__tuMock?.url || ''))
    define('responseText', body)
    define('response', xhr.responseType === 'json' ? jsonResponse : body)

    xhr.getAllResponseHeaders = () => 'content-type: application/json\r\n'
    xhr.getResponseHeader = (name: string) =>
      name.toLowerCase() === 'content-type' ? 'application/json' : null

    xhr.dispatchEvent(new Event('readystatechange'))
    xhr.dispatchEvent(new ProgressEvent('load'))
    xhr.dispatchEvent(new ProgressEvent('loadend'))
    if (typeof xhr.onreadystatechange === 'function') {
      xhr.onreadystatechange(new Event('readystatechange'))
    }
    if (typeof xhr.onload === 'function') {
      xhr.onload(new ProgressEvent('load'))
    }
    if (typeof xhr.onloadend === 'function') {
      xhr.onloadend(new ProgressEvent('loadend'))
    }
  }

  XMLHttpRequest.prototype.send = function (
    this: MockedXhr,
    body?: Document | XMLHttpRequestBodyInit | null
  ) {
    if (!this.__tuMock) {
      return originalSend.call(this, body)
    }

    const url = this.__tuMock.url
    if (
      url.startsWith('chrome-extension://') ||
      url.startsWith('moz-extension://') ||
      this.__tuMock.method === 'OPTIONS' ||
      this.__tuMock.method === 'HEAD'
    ) {
      return originalSend.call(this, body)
    }

    if (runtime.enabled) {
      const rule = findRule(url, this.__tuMock.method)
      if (rule) {
        emitHit(rule, resolveAbsoluteUrl(url), this.__tuMock.method)
        emitCapture({
          method: this.__tuMock.method,
          url,
          status: rule.status || 200,
          body: rule.responseBody ?? '',
          responseHeaders: 'content-type: application/json',
          resourceType: 'mock'
        })
        const respond = () => applyMockedXhr(this, rule)
        if (rule.delayMs > 0) {
          this.__tuTimer = window.setTimeout(respond, rule.delayMs)
          return
        }
        respond()
        return
      }
    }

    this.addEventListener('load', () => {
      if (this.__tuMocked || !this.__tuMock) return
      let respBody = ''
      try {
        if (this.responseType === '' || this.responseType === 'text') {
          respBody = this.responseText || ''
        } else if (this.responseType === 'json') {
          respBody =
            typeof this.responseText === 'string'
              ? this.responseText
              : JSON.stringify(this.response ?? null)
        }
      } catch {
        respBody = ''
      }
      emitCapture({
        method: this.__tuMock.method,
        url: this.__tuMock.url,
        status: this.status,
        body: respBody,
        responseHeaders: this.getAllResponseHeaders() || '',
        resourceType: 'xhr'
      })
    })

    return originalSend.call(this, body)
  }
})()
