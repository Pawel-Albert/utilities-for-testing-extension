type InterceptorRule = {
  id: string
  enabled: boolean
  label: string
  urlPattern: string
  method: string
  action: 'mock-response' | 'rewrite-payload' | 'redirect-request'
  status: number
  delayMs: number
  responseBody: string
  requestPayload: string
  redirectUrl: string
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
  action: InterceptorRule['action']
  targetUrl?: string
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

  const canRequestHaveBody = (method: string): boolean =>
    !['GET', 'HEAD'].includes(method.toUpperCase())

  const looksLikeJson = (value: string): boolean => {
    const trimmed = value.trim()
    return trimmed.startsWith('{') || trimmed.startsWith('[')
  }

  const resolveRedirectUrl = (baseUrl: string, redirectUrl: string): string => {
    const trimmed = redirectUrl.trim()
    if (!trimmed) return baseUrl
    try {
      return new URL(trimmed, resolveAbsoluteUrl(baseUrl)).href
    } catch {
      return trimmed
    }
  }

  const actionLabelFor = (rule: InterceptorRule, hit?: {targetUrl?: string}): string => {
    if (rule.action === 'rewrite-payload') return 'payload rewritten'
    if (rule.action === 'redirect-request') {
      return hit?.targetUrl ? `redirected to ${hit.targetUrl}` : 'redirected'
    }
    return String(rule.status || 200)
  }

  const emitHit = (
    rule: InterceptorRule,
    url: string,
    method: string,
    extras?: {targetUrl?: string}
  ) => {
    const hit: InterceptorHit = {
      ruleId: rule.id,
      label: rule.label,
      method,
      url,
      status: rule.action === 'mock-response' ? rule.status || 200 : 0,
      action: rule.action || 'mock-response',
      targetUrl: extras?.targetUrl,
      at: Date.now()
    }
    stats.total += 1
    stats.byRuleId[rule.id] = (stats.byRuleId[rule.id] || 0) + 1
    stats.log.unshift(hit)
    stats.log = stats.log.slice(0, 8)

    console.info(
      `%c[API Mock]%c ${method} ${url} → ${actionLabelFor(rule, extras)}${
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
    requestHeaders?: string
    requestBody?: string
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
          requestHeaders: item.requestHeaders || '',
          requestBody: (item.requestBody || '').slice(0, MAX_CAPTURE_BODY),
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

  const headersToString = (headers: Headers): string => {
    const lines: string[] = []
    headers.forEach((value, name) => {
      lines.push(`${name}: ${value}`)
    })
    return lines.join('\n')
  }

  const serializeXhrBody = (body?: Document | XMLHttpRequestBodyInit | null): string => {
    if (body == null) return ''
    if (typeof body === 'string') return body
    if (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) {
      return body.toString()
    }
    if (typeof FormData !== 'undefined' && body instanceof FormData) {
      return Array.from(body.entries())
        .map(([key, value]) => `${key}=${typeof value === 'string' ? value : value.name}`)
        .join('&')
    }
    if (typeof Document !== 'undefined' && body instanceof Document) {
      try {
        return new XMLSerializer().serializeToString(body)
      } catch {
        return ''
      }
    }
    return ''
  }

  const readRequestBody = async (request: Request): Promise<string> => {
    try {
      return await request.clone().text()
    } catch {
      return ''
    }
  }

  const captureFetchResponse = (
    url: string,
    method: string,
    response: Response,
    requestDetails?: {requestHeaders?: string; requestBody?: string}
  ) => {
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
          requestHeaders: requestDetails?.requestHeaders || '',
          requestBody: requestDetails?.requestBody || '',
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

  const buildFetchRequest = async (
    input: RequestInfo | URL,
    init: RequestInit | undefined,
    rule: InterceptorRule
  ): Promise<Request> => {
    const baseRequest = new Request(input, init)
    const method = baseRequest.method.toUpperCase()
    const headers = new Headers(baseRequest.headers)
    let nextUrl = baseRequest.url
    let nextBody: BodyInit | undefined

    if (canRequestHaveBody(method)) {
      const rawBody = await baseRequest.clone().arrayBuffer()
      nextBody = rawBody.byteLength > 0 ? rawBody : undefined
    }

    if (rule.action === 'redirect-request') {
      nextUrl = resolveRedirectUrl(nextUrl, rule.redirectUrl)
    }

    if (rule.action === 'rewrite-payload') {
      nextBody = rule.requestPayload
      headers.delete('content-length')
      if (!headers.has('content-type') && looksLikeJson(rule.requestPayload)) {
        headers.set('content-type', 'application/json')
      }
    }

    return new Request(nextUrl, {
      method,
      headers,
      body: canRequestHaveBody(method) ? nextBody : undefined,
      cache: baseRequest.cache,
      credentials: baseRequest.credentials,
      integrity: baseRequest.integrity,
      keepalive: baseRequest.keepalive,
      mode: baseRequest.mode,
      redirect: baseRequest.redirect,
      referrer: baseRequest.referrer,
      referrerPolicy: baseRequest.referrerPolicy,
      signal: baseRequest.signal
    })
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
        if (rule.delayMs > 0) await sleep(rule.delayMs)
        if (rule.action === 'mock-response') {
          const mockRequest = new Request(input, init)
          const requestBody = await readRequestBody(mockRequest)
          emitHit(rule, resolveAbsoluteUrl(url), method)
          const body = rule.responseBody ?? ''
          emitCapture({
            method,
            url,
            status: rule.status || 200,
            requestHeaders: headersToString(mockRequest.headers),
            requestBody,
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

        const transformedRequest = await buildFetchRequest(input, init, rule)
        const requestBody = await readRequestBody(transformedRequest)
        emitHit(rule, resolveAbsoluteUrl(url), method, {targetUrl: transformedRequest.url})
        const response = await originalFetch(transformedRequest)
        captureFetchResponse(transformedRequest.url, method, response, {
          requestHeaders: headersToString(transformedRequest.headers),
          requestBody
        })
        return response
      }
    }

    const response = await originalFetch(input, init)
    const originalRequest = new Request(input, init)
    captureFetchResponse(url, method, response, {
      requestHeaders: headersToString(originalRequest.headers),
      requestBody: await readRequestBody(originalRequest)
    })
    return response
  }

  const originalOpen = XMLHttpRequest.prototype.open
  const originalSend = XMLHttpRequest.prototype.send
  const originalAbort = XMLHttpRequest.prototype.abort
  const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader

  type MockedXhr = XMLHttpRequest & {
    __tuMock?: {
      method: string
      url: string
      activeUrl: string
      rule?: InterceptorRule
      requestHeaders: Record<string, string>
      requestBody: string
    }
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
    const requestMethod = String(method).toUpperCase()
    const requestUrl = String(url)
    const rule = runtime.enabled ? findRule(requestUrl, requestMethod) : undefined
    const activeUrl =
      rule?.action === 'redirect-request'
        ? resolveRedirectUrl(requestUrl, rule.redirectUrl)
        : requestUrl
    this.__tuMock = {
      method: requestMethod,
      url: requestUrl,
      activeUrl,
      rule,
      requestHeaders: {},
      requestBody: ''
    }
    this.__tuMocked = false
    return originalOpen.call(this, method, activeUrl, async ?? true, username, password)
  }

  XMLHttpRequest.prototype.setRequestHeader = function (
    this: MockedXhr,
    name: string,
    value: string
  ) {
    if (this.__tuMock) {
      this.__tuMock.requestHeaders[name.toLowerCase()] = value
    }
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

  const attachXhrCapture = (xhr: MockedXhr) => {
    xhr.addEventListener(
      'load',
      () => {
        if (xhr.__tuMocked || !xhr.__tuMock) return
        let respBody = ''
        try {
          if (xhr.responseType === '' || xhr.responseType === 'text') {
            respBody = xhr.responseText || ''
          } else if (xhr.responseType === 'json') {
            respBody =
              typeof xhr.responseText === 'string'
                ? xhr.responseText
                : JSON.stringify(xhr.response ?? null)
          }
        } catch {
          respBody = ''
        }
        emitCapture({
          method: xhr.__tuMock.method,
          url: xhr.responseURL || xhr.__tuMock.activeUrl || xhr.__tuMock.url,
          status: xhr.status,
          requestHeaders: Object.entries(xhr.__tuMock.requestHeaders)
            .map(([name, value]) => `${name}: ${value}`)
            .join('\n'),
          requestBody: xhr.__tuMock.requestBody,
          body: respBody,
          responseHeaders: xhr.getAllResponseHeaders() || '',
          resourceType: 'xhr'
        })
      },
      {once: true}
    )
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

    attachXhrCapture(this)
    this.__tuMock.requestBody = serializeXhrBody(body)

    if (runtime.enabled) {
      const rule = this.__tuMock.rule
      if (rule) {
        const liveRequest = () => {
          const payload =
            rule.action === 'rewrite-payload' && canRequestHaveBody(this.__tuMock?.method || 'GET')
              ? rule.requestPayload
              : body ?? undefined
          this.__tuMock!.requestBody =
            rule.action === 'rewrite-payload' ? rule.requestPayload : serializeXhrBody(body)
          if (
            rule.action === 'rewrite-payload' &&
            !this.__tuMock?.requestHeaders['content-type'] &&
            looksLikeJson(rule.requestPayload)
          ) {
            originalSetRequestHeader.call(this, 'content-type', 'application/json')
          }
          emitHit(rule, resolveAbsoluteUrl(url), this.__tuMock?.method || 'GET', {
            targetUrl: resolveAbsoluteUrl(this.__tuMock?.activeUrl || url)
          })
          return originalSend.call(this, payload)
        }

        if (rule.action === 'mock-response') {
          emitHit(rule, resolveAbsoluteUrl(url), this.__tuMock.method)
          emitCapture({
            method: this.__tuMock.method,
            url,
            status: rule.status || 200,
            requestHeaders: Object.entries(this.__tuMock.requestHeaders)
              .map(([name, value]) => `${name}: ${value}`)
              .join('\n'),
            requestBody: this.__tuMock.requestBody,
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

        if (rule.delayMs > 0) {
          this.__tuTimer = window.setTimeout(() => {
            this.__tuTimer = undefined
            liveRequest()
          }, rule.delayMs)
          return
        }

        return liveRequest()
      }
    }

    return originalSend.call(this, body)
  }
})()
