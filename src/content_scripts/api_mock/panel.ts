import {getApiMockState, saveApiMockState, normalizeApiMockState} from '../../services/apiMockStorage'
import {API_MOCK_HOST_ID, API_MOCK_INTERCEPTOR_SOURCE, API_MOCK_STORAGE_KEY, createEmptyApiMockRule, type ApiMockHit, type ApiMockMethod, type ApiMockRule, type ApiMockState} from '../../types/apiMock'
import {apiMockPanelStyles} from './panelStyles'

const METHODS: ApiMockMethod[] = ['*', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE']
const STATUS_OPTIONS = [
  {value: 200, label: '200 OK'},
  {value: 201, label: '201 Created'},
  {value: 202, label: '202 Accepted'},
  {value: 204, label: '204 No Content'},
  {value: 400, label: '400 Bad Request'},
  {value: 401, label: '401 Unauthorized'},
  {value: 403, label: '403 Forbidden'},
  {value: 404, label: '404 Not Found'},
  {value: 409, label: '409 Conflict'},
  {value: 422, label: '422 Unprocessable Entity'},
  {value: 500, label: '500 Internal Server Error'},
  {value: 502, label: '502 Bad Gateway'},
  {value: 503, label: '503 Service Unavailable'}
] as const

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

function formatHit(hit: ApiMockHit): string {
  const time = new Date(hit.at).toLocaleTimeString()
  const labelSuffix = hit.label ? ` · ${hit.label}` : ''
  return `${time}  ${hit.method}  ${hit.url}  → ${hit.status}${labelSuffix}`
}

function displayRuleTitle(rule: ApiMockRule): string {
  if (rule.label.trim()) return rule.label
  const pattern = rule.urlPattern.trim()
  const lastSegment = pattern.split('/').filter(Boolean).pop()
  return lastSegment || pattern || 'Untitled rule'
}

const PENCIL_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>'

const TRASH_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>'

const createRuleIconButton = (
  action: string,
  title: string,
  icon: string,
  danger = false
): HTMLButtonElement => {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = danger ? 'rule-icon danger' : 'rule-icon'
  button.dataset.ruleAction = action
  button.title = title
  button.innerHTML = icon
  return button
}

function startApiMockPanel() {
  const existing = document.getElementById(API_MOCK_HOST_ID)
  if (existing) {
    existing.style.display = 'block'
    existing.dispatchEvent(new CustomEvent('tu-api-mock-focus'))
    return
  }

  let state: ApiMockState
  let selectedRuleId: string | null = null
  let formMode: 'edit' | 'new' = 'new'
  let toastTimer = 0
  let hitsPulseTimer = 0

  const host = document.createElement('div')
  host.id = API_MOCK_HOST_ID
  const shadow = host.attachShadow({mode: 'open'})

  shadow.innerHTML = `
    <style>${apiMockPanelStyles}</style>
    <div class="panel" id="panel">
      <div class="header" id="header">
        <h2>API Mock</h2>
        <div class="header-actions">
          <label class="switch" title="Enable mocks">
            <input type="checkbox" id="enabledToggle" />
            <span class="slider"></span>
          </label>
          <button class="icon-button" id="minimizeButton" title="Minimize">−</button>
          <button class="icon-button" id="closeButton" title="Close">×</button>
        </div>
      </div>
      <div class="body">
        <div class="preview-notice">
          Preview: mocks <code>fetch</code> and <code>XHR</code> on this page. Navigation,
          images and other browser requests are not intercepted.
        </div>
        <p class="help-text">
          Drag the blue header to move the panel. Closing it does not disable active mocks.
        </p>
        <div class="section">
          <div class="row">
            <h3>Rules</h3>
            <button class="add-button" id="newRuleButton" type="button" title="Add rule">
              +
            </button>
          </div>
          <div class="rules" id="rulesList"></div>
        </div>
        <div class="section">
          <h3 id="formTitle">New rule</h3>
          <div class="form-group">
            <label for="labelInput">Label</label>
            <input id="labelInput" type="text" placeholder="Get sales list" />
          </div>
          <div class="form-group">
            <label for="urlInput">URL pattern</label>
            <input id="urlInput" type="text" placeholder="/api/user/info or *://*/api/user/*" />
          </div>
          <div class="grid-3">
            <div class="form-group">
              <label for="methodInput">Method</label>
              <select id="methodInput"></select>
            </div>
            <div class="form-group">
              <label for="statusInput">Status</label>
              <select id="statusInput"></select>
            </div>
            <div class="form-group">
              <label for="delayInput">Delay (ms)</label>
              <input id="delayInput" type="number" min="0" step="50" value="0" />
            </div>
          </div>
          <div class="form-group">
            <label for="bodyInput">Response payload</label>
            <textarea id="bodyInput" placeholder='{ "isAuth": true }'></textarea>
          </div>
          <div class="buttons">
            <button class="action success" id="saveButton">Add rule</button>
            <button class="action secondary" id="duplicateButton">Duplicate</button>
            <button class="action secondary" id="formatButton">Format JSON</button>
            <button class="action danger" id="deleteButton">Delete</button>
          </div>
        </div>
        <div class="section">
          <div class="row">
            <h3>Hits <span class="hit-total" id="hitTotal">0</span></h3>
            <button class="action secondary" id="clearHitsButton">Clear</button>
          </div>
          <p class="help-text">
            This tab only. Also logs to this page's DevTools Console as
            <strong>[API Mock]</strong> — not the extension service worker.
          </p>
          <div class="hits-list" id="hitsList">
            <div class="hit empty-hit">No mocked request yet on this page.</div>
          </div>
        </div>
      </div>
      <div class="toast" id="toast"></div>
    </div>
  `

  document.documentElement.appendChild(host)

  const panel = shadow.getElementById('panel') as HTMLElement
  const header = shadow.getElementById('header') as HTMLElement
  const enabledToggle = shadow.getElementById('enabledToggle') as HTMLInputElement
  const minimizeButton = shadow.getElementById('minimizeButton') as HTMLButtonElement
  const closeButton = shadow.getElementById('closeButton') as HTMLButtonElement
  const newRuleButton = shadow.getElementById('newRuleButton') as HTMLButtonElement
  const rulesList = shadow.getElementById('rulesList') as HTMLElement
  const formTitle = shadow.getElementById('formTitle') as HTMLElement
  const labelInput = shadow.getElementById('labelInput') as HTMLInputElement
  const urlInput = shadow.getElementById('urlInput') as HTMLInputElement
  const methodInput = shadow.getElementById('methodInput') as HTMLSelectElement
  const statusInput = shadow.getElementById('statusInput') as HTMLSelectElement
  const delayInput = shadow.getElementById('delayInput') as HTMLInputElement
  const bodyInput = shadow.getElementById('bodyInput') as HTMLTextAreaElement
  const saveButton = shadow.getElementById('saveButton') as HTMLButtonElement
  const duplicateButton = shadow.getElementById('duplicateButton') as HTMLButtonElement
  const formatButton = shadow.getElementById('formatButton') as HTMLButtonElement
  const deleteButton = shadow.getElementById('deleteButton') as HTMLButtonElement
  const hitsList = shadow.getElementById('hitsList') as HTMLElement
  const hitTotal = shadow.getElementById('hitTotal') as HTMLElement
  const clearHitsButton = shadow.getElementById('clearHitsButton') as HTMLButtonElement
  const toast = shadow.getElementById('toast') as HTMLElement

  METHODS.forEach(method => {
    const option = document.createElement('option')
    option.value = method
    option.textContent = method === '*' ? 'Any' : method
    methodInput.appendChild(option)
  })

  STATUS_OPTIONS.forEach(status => {
    const option = document.createElement('option')
    option.value = String(status.value)
    option.textContent = status.label
    statusInput.appendChild(option)
  })

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    toast.textContent = message
    toast.className = `toast ${type} show`
    window.clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => {
      toast.className = 'toast'
    }, 2200)
  }

  const applyHostPosition = () => {
    const width = panel.offsetWidth || 520
    const height = panel.classList.contains('minimized') ? 48 : panel.offsetHeight || 320
    const x = clamp(state.panel.x, 8, Math.max(8, window.innerWidth - width - 8))
    const y = clamp(state.panel.y, 8, Math.max(8, window.innerHeight - height - 8))
    state.panel.x = x
    state.panel.y = y
    host.style.cssText = `
      all: initial;
      position: fixed !important;
      z-index: 2147483646 !important;
      left: ${x}px !important;
      top: ${y}px !important;
      width: 520px;
      max-width: calc(100vw - 16px);
      display: block;
    `
  }

  type HitStats = {
    total: number
    byRuleId: Record<string, number>
    log: ApiMockHit[]
  }

  let hitStats: HitStats = {total: 0, byRuleId: {}, log: []}

  const getHitStats = (): HitStats => hitStats

  const recordHit = (hit: ApiMockHit) => {
    if (hitStats.log.some(item => item.at === hit.at && item.url === hit.url)) return
    hitStats.total += 1
    hitStats.byRuleId[hit.ruleId] = (hitStats.byRuleId[hit.ruleId] || 0) + 1
    hitStats.log.unshift(hit)
    hitStats.log = hitStats.log.slice(0, 8)
    renderHits(true)
    renderRules()
  }

  const renderHits = (pulse = false) => {
    const stats = getHitStats()
    hitTotal.textContent = String(stats.total)
    hitsList.innerHTML = ''
    if (stats.log.length === 0) {
      const empty = document.createElement('div')
      empty.className = 'hit empty-hit'
      empty.textContent = 'No mocked request yet on this page.'
      hitsList.appendChild(empty)
      return
    }

    stats.log.forEach(hit => {
      const item = document.createElement('div')
      item.className = 'hit'
      item.textContent = formatHit(hit)
      hitsList.appendChild(item)
    })

    if (pulse) {
      hitsList.classList.remove('pulse')
      void hitsList.offsetWidth
      hitsList.classList.add('pulse')
      window.clearTimeout(hitsPulseTimer)
      hitsPulseTimer = window.setTimeout(() => {
        hitsList.classList.remove('pulse')
      }, 450)
    }
  }
  const selectedRule = () => state.rules.find(rule => rule.id === selectedRuleId) || null
  const isExistingRule = (id: string | null) =>
    Boolean(id && state.rules.some(rule => rule.id === id))

  const fillForm = (rule: ApiMockRule, mode: 'edit' | 'new') => {
    formMode = mode
    selectedRuleId = rule.id
    labelInput.value = rule.label
    urlInput.value = rule.urlPattern
    methodInput.value = rule.method
    statusInput.value = String(rule.status)
    delayInput.value = String(rule.delayMs)
    bodyInput.value = rule.responseBody
    formTitle.textContent = mode === 'edit' ? 'Edit rule' : 'New rule'
    saveButton.textContent = mode === 'edit' ? 'Save changes' : 'Add rule'
    deleteButton.style.display = mode === 'edit' ? '' : 'none'
    duplicateButton.style.display = mode === 'edit' ? '' : 'none'
  }

  const openNewRuleForm = () => {
    const rule = createEmptyApiMockRule()
    rule.urlPattern = `${location.origin}/*`
    fillForm(rule, 'new')
  }

  const renderRules = () => {
    rulesList.innerHTML = ''
    if (state.rules.length === 0) {
      rulesList.innerHTML = '<div class="empty">No rules yet. Use + to add one.</div>'
      return
    }

    const stats = getHitStats()
    state.rules.forEach(rule => {
      const item = document.createElement('div')
      item.className = `rule${rule.id === selectedRuleId ? ' active' : ''}${
        rule.enabled ? '' : ' disabled'
      }`

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.dataset.toggleId = rule.id
      checkbox.checked = rule.enabled

      const info = document.createElement('div')
      const title = document.createElement('p')
      title.className = 'rule-title'
      title.textContent = displayRuleTitle(rule)
      const meta = document.createElement('div')
      meta.className = 'rule-meta'
      meta.textContent = rule.urlPattern || 'No URL pattern'
      info.append(title, meta)

      const hits = stats.byRuleId[rule.id] || 0
      const hitsBadge = document.createElement('span')
      hitsBadge.className = `badge hits-badge${hits ? '' : ' zero'}`
      hitsBadge.title = 'Hits this page session'
      hitsBadge.textContent = String(hits)

      const badge = document.createElement('span')
      badge.className = 'badge'
      badge.textContent = `${rule.method} ${rule.status}`

      const actions = document.createElement('div')
      actions.className = 'rule-actions'
      actions.append(
        createRuleIconButton('edit', 'Edit rule', PENCIL_ICON),
        createRuleIconButton('delete', 'Delete rule', TRASH_ICON, true)
      )

      item.append(checkbox, info, hitsBadge, badge, actions)
      item.addEventListener('click', event => {
        const target = event.target as HTMLElement
        if (target.closest('input, button')) return
        fillForm(rule, 'edit')
        renderRules()
      })
      rulesList.appendChild(item)
    })
  }

  const persist = async (message?: string) => {
    await saveApiMockState(state)
    if (message) showToast(message, 'success')
  }

  const deleteRuleById = async (ruleId: string) => {
    if (!isExistingRule(ruleId)) return
    state.rules = state.rules.filter(rule => rule.id !== ruleId)
    if (selectedRuleId === ruleId || !isExistingRule(selectedRuleId)) {
      openNewRuleForm()
    }
    renderRules()
    await persist('Rule deleted')
  }

  const readForm = (): ApiMockRule => ({
    id: selectedRuleId || createEmptyApiMockRule().id,
    enabled: selectedRule()?.enabled !== false,
    label: labelInput.value.trim(),
    urlPattern: urlInput.value.trim(),
    method: (methodInput.value as ApiMockMethod) || '*',
    status: Number(statusInput.value) || 200,
    delayMs: Math.max(0, Number(delayInput.value) || 0),
    responseBody: bodyInput.value
  })

  const bindEvents = () => {
    enabledToggle.addEventListener('change', async () => {
      state.enabled = enabledToggle.checked
      await persist(state.enabled ? 'Mocks enabled' : 'Mocks disabled')
      chrome.runtime.sendMessage({type: 'API_MOCK_ENSURE_INTERCEPTOR'}, () => {
        void chrome.runtime.lastError
      })
    })

    minimizeButton.addEventListener('click', async () => {
      state.panel.minimized = !state.panel.minimized
      panel.classList.toggle('minimized', state.panel.minimized)
      minimizeButton.textContent = state.panel.minimized ? '+' : '−'
      applyHostPosition()
      await persist()
    })

    closeButton.addEventListener('click', () => {
      host.remove()
    })

    newRuleButton.addEventListener('click', () => {
      openNewRuleForm()
      renderRules()
    })

    saveButton.addEventListener('click', async () => {
      const rule = readForm()
      if (!rule.urlPattern) {
        showToast('URL pattern is required', 'error')
        return
      }

      const wasEdit = formMode === 'edit'
      const index = state.rules.findIndex(item => item.id === rule.id)
      if (index >= 0) state.rules[index] = rule
      else state.rules.unshift(rule)

      openNewRuleForm()
      renderRules()
      await persist(wasEdit ? 'Changes saved' : 'Rule added')
      chrome.runtime.sendMessage({type: 'API_MOCK_ENSURE_INTERCEPTOR'}, () => {
        void chrome.runtime.lastError
      })
    })

    formatButton.addEventListener('click', () => {
      try {
        bodyInput.value = JSON.stringify(JSON.parse(bodyInput.value), null, 2)
        showToast('JSON formatted')
      } catch {
        showToast('Response is not valid JSON', 'error')
      }
    })

    duplicateButton.addEventListener('click', async () => {
      if (!isExistingRule(selectedRuleId)) return
      const source = readForm()
      const copy = {
        ...source,
        id: createEmptyApiMockRule().id,
        label: source.label ? `${source.label} copy` : ''
      }
      state.rules.unshift(copy)
      fillForm(copy, 'edit')
      renderRules()
      await persist('Rule duplicated')
    })

    clearHitsButton.addEventListener('click', () => {
      hitStats = {total: 0, byRuleId: {}, log: []}
      const pageWindow = window as Window & {__TU_API_MOCK_ISOLATED_STATS__?: HitStats}
      pageWindow.__TU_API_MOCK_ISOLATED_STATS__ = hitStats
      renderHits()
      renderRules()
    })

    deleteButton.addEventListener('click', async () => {
      if (!isExistingRule(selectedRuleId)) return
      await deleteRuleById(selectedRuleId as string)
    })

    rulesList.addEventListener('click', async event => {
      const button = (event.target as HTMLElement).closest('button[data-rule-action]')
      if (!button) return
      event.stopPropagation()
      const item = button.closest('.rule')
      const checkbox = item?.querySelector('input[data-toggle-id]') as HTMLInputElement | null
      const ruleId = checkbox?.dataset.toggleId
      if (!ruleId) return
      const action = button.getAttribute('data-rule-action')
      const rule = state.rules.find(entry => entry.id === ruleId)
      if (action === 'edit' && rule) {
        fillForm(rule, 'edit')
        renderRules()
        return
      }
      if (action === 'delete') {
        await deleteRuleById(ruleId)
      }
    })

    rulesList.addEventListener('change', async event => {
      const input = event.target as HTMLInputElement
      const ruleId = input.dataset.toggleId
      if (!ruleId) return
      const rule = state.rules.find(item => item.id === ruleId)
      if (!rule) return
      rule.enabled = input.checked
      renderRules()
      await persist()
    })

    let drag: {offsetX: number; offsetY: number} | null = null
    header.addEventListener('mousedown', event => {
      if ((event.target as HTMLElement).closest('button, input, label, .header-actions')) {
        return
      }
      const rect = host.getBoundingClientRect()
      drag = {offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top}
      event.preventDefault()
    })

    window.addEventListener('mousemove', event => {
      if (!drag) return
      state.panel.x = event.clientX - drag.offsetX
      state.panel.y = event.clientY - drag.offsetY
      applyHostPosition()
    })

    window.addEventListener('mouseup', async () => {
      if (!drag) return
      drag = null
      await persist()
    })

    window.addEventListener('message', event => {
      const data = event.data as {source?: string; type?: string; hit?: ApiMockHit}
      if (!data || data.source !== API_MOCK_INTERCEPTOR_SOURCE || data.type !== 'HIT') return
      if (data.hit) recordHit(data.hit)
    })

    document.addEventListener('tu-api-mock-hit', event => {
      const detail = (event as CustomEvent<{hit?: ApiMockHit}>).detail
      if (detail?.hit) recordHit(detail.hit)
    })

    host.addEventListener('tu-api-mock-focus', () => {
      state.panel.minimized = false
      panel.classList.remove('minimized')
      minimizeButton.textContent = '−'
      applyHostPosition()
    })

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local' || !changes[API_MOCK_STORAGE_KEY]) return
      const next = normalizeApiMockState(changes[API_MOCK_STORAGE_KEY].newValue)
      state.rules = next.rules
      state.enabled = next.enabled
      enabledToggle.checked = state.enabled
      renderRules()
    })
  }

  const boot = async () => {
    state = await getApiMockState()
    enabledToggle.checked = state.enabled
    panel.classList.toggle('minimized', state.panel.minimized)
    minimizeButton.textContent = state.panel.minimized ? '+' : '−'
    const isolated = (window as Window & {__TU_API_MOCK_ISOLATED_STATS__?: HitStats})
      .__TU_API_MOCK_ISOLATED_STATS__
    if (isolated) {
      hitStats = {
        total: isolated.total || 0,
        byRuleId: {...(isolated.byRuleId || {})},
        log: [...(isolated.log || [])]
      }
    }
    openNewRuleForm()
    renderRules()
    renderHits()
    applyHostPosition()
    bindEvents()
  }

  void boot()
}

startApiMockPanel()
