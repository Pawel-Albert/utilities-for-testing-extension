interface GroupFilterConfig {
  onChange: (selectedGroups: string[]) => void
}

export function createGroupFilter(containerId: string, config: GroupFilterConfig) {
  const container = document.getElementById(containerId)
  if (!container) return null

  const filterContainer = document.createElement('div')
  filterContainer.className = 'group-filter'

  const select = document.createElement('select')
  select.multiple = true
  select.className = 'group-filter-select'

  const allOption = document.createElement('option')
  allOption.value = ''
  allOption.textContent = 'Show All'
  select.appendChild(allOption)

  async function refreshGroups() {
    const result = await chrome.storage.local.get(['groups'])
    const groups = result.groups || {}

    select.innerHTML = '<option value="">Show All</option>'
    Object.values(groups)
      .sort((a: any, b: any) => a.order - b.order)
      .forEach((group: any) => {
        const option = document.createElement('option')
        option.value = group.id
        option.textContent = group.name
        select.appendChild(option)
      })
  }

  select.addEventListener('change', () => {
    const selectedOptions = Array.from(select.selectedOptions)
    const selectedGroups = selectedOptions.map(option => option.value)
    config.onChange(selectedGroups)
  })

  filterContainer.appendChild(select)
  container.appendChild(filterContainer)

  return {
    refresh: refreshGroups
  }
}
