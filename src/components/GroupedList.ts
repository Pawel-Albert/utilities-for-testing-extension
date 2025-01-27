interface GroupedListConfig<T> {
  onItemClick?: (item: T) => void
  renderItem: (item: T) => HTMLElement
}

interface GroupedItem {
  groupId?: string
  groupName?: string
  [key: string]: any
}

export function createGroupedList<T extends GroupedItem>(
  containerId: string,
  config: GroupedListConfig<T>
) {
  const container = document.getElementById(containerId)
  if (!container) return null

  const collapsedGroups = new Map<string, boolean>()

  function renderGroupHeader(groupId: string, groupName: string) {
    const header = document.createElement('div')
    header.className = 'group-header'

    const toggleBtn = document.createElement('button')
    const isCollapsed = collapsedGroups.get(groupId) || false
    toggleBtn.className = `group-toggle ${isCollapsed ? 'collapsed' : ''}`
    toggleBtn.innerHTML = isCollapsed ? '▸' : '▾'

    const title = document.createElement('span')
    title.textContent = groupName || 'No Group'

    header.appendChild(toggleBtn)
    header.appendChild(title)

    return {header, isCollapsed}
  }

  function render(items: T[], selectedGroups: string[] = []) {
    if (!container) return

    container.innerHTML = ''

    const groupedItems = items.reduce<Record<string, T[]>>((acc, item) => {
      const groupId = item.groupId || ''
      if (!acc[groupId]) acc[groupId] = []
      acc[groupId].push(item)
      return acc
    }, {})

    const filteredGroups =
      selectedGroups.length > 0
        ? Object.entries(groupedItems).filter(
            ([groupId]) =>
              selectedGroups.includes(groupId) ||
              (groupId === '' && selectedGroups.includes('no-group'))
          )
        : Object.entries(groupedItems)

    filteredGroups.forEach(([groupId, groupItems]) => {
      const groupContainer = document.createElement('div')
      groupContainer.className = 'group-container'

      const {header, isCollapsed} = renderGroupHeader(
        groupId,
        groupId ? groupItems[0].groupName || '' : 'No Group'
      )
      const content = document.createElement('div')
      content.className = 'group-content'
      content.style.display = isCollapsed ? 'none' : 'block'

      groupItems.forEach(item => {
        const itemElement = config.renderItem(item)
        content.appendChild(itemElement)
      })

      // Single click handler for both header and button
      const toggleGroup = (e: Event) => {
        e.preventDefault()
        const btn = header.querySelector('.group-toggle') as HTMLElement
        const isCollapsed = btn.classList.toggle('collapsed')
        btn.innerHTML = isCollapsed ? '▸' : '▾'
        content.style.display = isCollapsed ? 'none' : 'block'
        collapsedGroups.set(groupId, isCollapsed)
      }

      header.addEventListener('click', toggleGroup)

      groupContainer.appendChild(header)
      groupContainer.appendChild(content)
      container.appendChild(groupContainer)
    })
  }

  return {
    render
  }
}
