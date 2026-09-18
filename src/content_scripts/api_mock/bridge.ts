(() => {
  const STORAGE_KEY = 'apiMockState'

  const toRuntimeState = (value: unknown) => {
    const record = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
    return {
      enabled: Boolean(record.enabled),
      rules: Array.isArray(record.rules) ? record.rules : []
    }
  }

  const publishState = (value: unknown) => {
    window.postMessage(
      {
        source: 'TU_API_MOCK_BRIDGE',
        type: 'STATE',
        state: toRuntimeState(value)
      },
      '*'
    )
  }

  const isolatedStats = {
    total: 0,
    byRuleId: {} as Record<string, number>,
    log: [] as Array<{
      ruleId: string
      label: string
      method: string
      url: string
      status: number
      at: number
    }>
  }

  const rememberIsolatedStats = () => {
    ;(window as Window & {__TU_API_MOCK_ISOLATED_STATS__?: typeof isolatedStats}).__TU_API_MOCK_ISOLATED_STATS__ =
      isolatedStats
  }

  rememberIsolatedStats()

  window.addEventListener('message', event => {
    const data = event.data as {
      source?: string
      type?: string
      hit?: (typeof isolatedStats.log)[number]
    }
    if (!data || data.source !== 'TU_API_MOCK_INTERCEPTOR' || data.type !== 'HIT') return
    if (!data.hit) return

    isolatedStats.total += 1
    isolatedStats.byRuleId[data.hit.ruleId] = (isolatedStats.byRuleId[data.hit.ruleId] || 0) + 1
    isolatedStats.log.unshift(data.hit)
    isolatedStats.log = isolatedStats.log.slice(0, 8)
    rememberIsolatedStats()

    document.dispatchEvent(
      new CustomEvent('tu-api-mock-hit', {
        bubbles: true,
        detail: {hit: data.hit, stats: isolatedStats}
      })
    )
  })

  window.addEventListener('message', event => {
    const data = event.data as {source?: string; type?: string; item?: unknown}
    if (!data || data.source !== 'TU_API_MOCK_INTERCEPTOR' || data.type !== 'CAPTURE') {
      return
    }
    if (!data.item) return
    try {
      chrome.runtime.sendMessage({type: 'API_MOCK_DEVTOOLS_REQUEST', item: data.item}, () => {
        void chrome.runtime.lastError
      })
    } catch {
      // Extension context can be missing after reload.
    }
  })

  const ensureInterceptor = () => {
    try {
      chrome.runtime.sendMessage({type: 'API_MOCK_ENSURE_INTERCEPTOR'})
    } catch {
      // Extension context can be missing after reload.
    }
  }

  chrome.storage.local.get(STORAGE_KEY, result => {
    const state = result[STORAGE_KEY]
    if (state?.enabled) {
      ensureInterceptor()
      publishState(state)
    }
  })

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes[STORAGE_KEY]) return
    const nextState = changes[STORAGE_KEY].newValue
    publishState(nextState)
    if (nextState?.enabled) ensureInterceptor()
  })
})()
