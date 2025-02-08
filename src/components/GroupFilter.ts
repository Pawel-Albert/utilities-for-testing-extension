import {groupStyles} from './styles'

interface GroupFilterConfig {
  onChange: (selectedGroups: string[]) => void
  pageKey: 'executionScripts' | 'scripts' | 'userScripts'
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
  title.textContent = 'Filter by Groups'

  const toggle = document.createElement('span')
  toggle.className = 'filter-toggle collapsed'
  toggle.textContent = '▼'

  header.appendChild(title)
  header.appendChild(toggle)

  const content = document.createElement('div')
  content.className = 'filter-content'

  const pillsContainer = document.createElement('div')
  pillsContainer.className = 'group-filter-pills'

  const actions = document.createElement('div')
  actions.className = 'filter-actions'

  const selectAllBtn = document.createElement('button')
  selectAllBtn.className = 'filter-button'
  selectAllBtn.textContent = 'Select All'

  const clearBtn = document.createElement('button')
  clearBtn.className = 'filter-button debug'
  clearBtn.textContent = 'Clear'

  actions.appendChild(selectAllBtn)
  actions.appendChild(clearBtn)

  content.appendChild(pillsContainer)
  content.appendChild(actions)

  let selectedGroups: string[] = []
  let groups: string[] = []
  let groupsData: any = {}

  async function saveFilterState(selected: string[]) {
    try {
      const result = await chrome.storage.local.get(['filterStates'])
      const states = result.filterStates || {}

      await chrome.storage.local.set({
        filterStates: {
          ...states,
          [config.pageKey]: selected
        }
      })
    } catch (error) {
      console.error('Failed to save filter state:', error)
    }
  }

  async function loadFilterState() {
    try {
      const result = await chrome.storage.local.get(['filterStates'])
      const states = result.filterStates || {}
      const currentState = states[config.pageKey] || []

      if (!states[config.pageKey]) {
        await saveFilterState(groups)
        return groups
      }

      selectedGroups = currentState
      updatePills()

      return currentState
    } catch (error) {
      console.error('Failed to load filter state:', error)
      return []
    }
  }

  function updatePills() {
    pillsContainer.innerHTML = ''

    groups.forEach(group => {
      const pill = document.createElement('div')
      pill.className = `group-pill${selectedGroups.includes(group) ? ' selected' : ''}`

      let label
      if (group === '') {
        label = 'No Group'
      } else {
        label = groupsData[group]?.name || group
      }

      pill.textContent = label

      pill.addEventListener('click', async () => {
        if (selectedGroups.includes(group)) {
          selectedGroups = selectedGroups.filter(g => g !== group)
        } else {
          selectedGroups.push(group)
        }
        updatePills()
        await saveFilterState(selectedGroups)
        config.onChange(selectedGroups)
      })

      pillsContainer.appendChild(pill)
    })
  }

  header.addEventListener('click', () => {
    content.classList.toggle('expanded')
    toggle.classList.toggle('collapsed')
  })

  selectAllBtn.addEventListener('click', async () => {
    selectedGroups = [...groups]
    updatePills()
    await saveFilterState(selectedGroups)
    config.onChange(selectedGroups)
  })

  clearBtn.addEventListener('click', async () => {
    selectedGroups = []
    updatePills()
    await saveFilterState([])
    config.onChange([])
  })

  filterContainer.appendChild(header)
  filterContainer.appendChild(content)
  container.appendChild(filterContainer)

  const style = document.createElement('style')
  style.textContent = groupStyles
  document.head.appendChild(style)

  async function refreshGroups() {
    const result = await chrome.storage.local.get(['groups'])
    groupsData = result.groups || {}

    // Always add No Group option first
    groups = ['', ...Object.values(groupsData).map((g: any) => g.id)]
    updatePills()
  }

  async function init() {
    await refreshGroups()
    const savedGroups = await loadFilterState()
    config.onChange(savedGroups)
  }

  init()

  return {
    refresh: refreshGroups
  }
}
