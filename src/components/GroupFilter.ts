interface GroupFilterConfig {
  onChange: (selectedGroups: string[]) => void
  pageKey: 'executionScripts' | 'scripts' | 'userScripts' // Which panel is using the filter
}

export function createGroupFilter(containerId: string, config: GroupFilterConfig) {
  const container = document.getElementById(containerId)
  if (!container) return null

  const filterContainer = document.createElement('div')
  filterContainer.className = 'group-filter'

  const header = document.createElement('div')
  header.className = 'filter-header'

  const title = document.createElement('span')
  title.className = 'filter-title'
  title.textContent = 'Group Filters'

  const toggle = document.createElement('span')
  toggle.className = 'filter-toggle collapsed'
  toggle.textContent = '▼'

  header.appendChild(title)
  header.appendChild(toggle)

  const content = document.createElement('div')
  content.className = 'filter-content'

  const select = document.createElement('select')
  select.multiple = true
  select.className = 'group-filter-select'

  const actions = document.createElement('div')
  actions.className = 'filter-actions'

  const selectAllBtn = document.createElement('button')
  selectAllBtn.className = 'filter-button'
  selectAllBtn.textContent = 'Select All'
  selectAllBtn.onclick = async () => {
    Array.from(select.options).forEach(opt => (opt.selected = true))
    const selectedGroups = Array.from(select.selectedOptions).map(opt => opt.value)
    await saveFilterState(selectedGroups)
    config.onChange(selectedGroups)
    console.log('Select All clicked, groups:', selectedGroups)
  }

  const clearAllBtn = document.createElement('button')
  clearAllBtn.className = 'filter-button'
  clearAllBtn.textContent = 'Clear All'
  clearAllBtn.onclick = async () => {
    Array.from(select.options).forEach(opt => (opt.selected = false))
    await saveFilterState([])
    config.onChange([])
    console.log('Clear All clicked, cleared filters')
  }

  actions.appendChild(selectAllBtn)
  actions.appendChild(clearAllBtn)

  content.appendChild(select)
  content.appendChild(actions)

  header.onclick = () => {
    const wasCollapsed = toggle.classList.contains('collapsed')
    toggle.classList.toggle('collapsed')
    content.classList.toggle('expanded')
    toggle.textContent = wasCollapsed ? '▼' : '▼'
    console.log('Filter panel is now:', wasCollapsed ? 'expanded' : 'collapsed')
  }

  async function loadFilterState() {
    try {
      const result = await chrome.storage.local.get(['filterStates'])
      const states = result.filterStates || {}
      const currentState = states[config.pageKey] || []

      if (!states[config.pageKey]) {
        const allGroups = Array.from(select.options).map(opt => opt.value)
        await saveFilterState(allGroups)
        return allGroups
      }

      Array.from(select.options).forEach(option => {
        option.selected = currentState.includes(option.value)
      })

      console.log('Loaded filter state for', config.pageKey, ':', currentState)
      return currentState
    } catch (error) {
      console.error('Failed to load filter state:', error)
      return []
    }
  }

  async function saveFilterState(selectedGroups: string[]) {
    try {
      const result = await chrome.storage.local.get(['filterStates'])
      const states = result.filterStates || {}

      await chrome.storage.local.set({
        filterStates: {
          ...states,
          [config.pageKey]: selectedGroups
        }
      })

      console.log('Saved filter state for', config.pageKey, ':', selectedGroups)
    } catch (error) {
      console.error('Failed to save filter state:', error)
    }
  }

  select.addEventListener('change', async () => {
    const selectedGroups = Array.from(select.selectedOptions).map(opt => opt.value)
    await saveFilterState(selectedGroups)
    config.onChange(selectedGroups)
    console.log('Selection changed:', selectedGroups)
  })

  filterContainer.appendChild(header)
  filterContainer.appendChild(content)
  container.appendChild(filterContainer)

  async function init() {
    await refreshGroups()
    const savedGroups = await loadFilterState()
    config.onChange(savedGroups)
  }

  async function refreshGroups() {
    const currentSelection = Array.from(select.selectedOptions).map(opt => opt.value)

    const result = await chrome.storage.local.get(['groups'])
    const groups = result.groups || {}

    select.innerHTML = ''

    // Always add No Group option first
    const noGroupOption = document.createElement('option')
    noGroupOption.value = 'no-group'
    noGroupOption.textContent = 'No Group'
    select.appendChild(noGroupOption)

    Object.values(groups)
      .sort((a: any, b: any) => a.order - b.order)
      .forEach((group: any) => {
        const option = document.createElement('option')
        option.value = group.id
        option.textContent = group.name
        select.appendChild(option)
      })

    if (currentSelection.length > 0) {
      Array.from(select.options).forEach(option => {
        option.selected = currentSelection.includes(option.value)
      })
    } else {
      Array.from(select.options).forEach(option => (option.selected = true))
    }

    console.log(
      'Groups refreshed, selection:',
      currentSelection.length ? 'restored' : 'all selected'
    )
  }

  init()

  return {
    refresh: refreshGroups
  }
}
