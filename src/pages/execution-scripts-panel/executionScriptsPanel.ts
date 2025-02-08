import {createPanelSelector} from '../../components/PanelSelector'
import {loadUserScripts, executeUserScript} from '../../services/userScripts'
import {ExecuteResult, UserScript} from '../../types/userScripts'
import {initializeLocationChecker} from '../../utils/locationChecker'
import {createGroupFilter} from '../../components/GroupFilter'
import {createGroupedList} from '../../components/GroupedList'
import {groupStyles} from '../../components/styles'

createPanelSelector(document.body)

const style = document.createElement('style')
style.textContent = groupStyles
document.head.appendChild(style)

// Keep track of selected groups
let currentSelectedGroups: string[] = []

const groupFilter = createGroupFilter('filterContainer', {
  onChange: selectedGroups => {
    currentSelectedGroups = selectedGroups
    refreshScriptsList(locationInfo, selectedGroups)
  },
  pageKey: 'executionScripts'
})

const groupedList = createGroupedList<UserScript & {name: string}>('userScriptsList', {
  renderItem: script => {
    const button = document.createElement('div')
    button.className = 'script-item'

    const nameSpan = document.createElement('span')
    nameSpan.className = 'script-item-name'
    nameSpan.textContent = script.name

    const patternSpan = document.createElement('span')
    patternSpan.className = 'script-item-pattern'
    patternSpan.textContent = script.pattern || '*://*/*'

    button.appendChild(nameSpan)
    button.appendChild(patternSpan)

    button.onclick = async () => {
      try {
        const results = await executeUserScript(script, locationInfo.tabId!)
        const result = results[0].result as ExecuteResult

        result.logs.forEach(([type, ...args]) => {
          ;(console as any)[type]('Script output:', ...args)
        })

        if (!result.success) {
          throw new Error(result.error)
        }

        console.log(`Script "${script.name}" executed successfully`)
      } catch (err) {
        console.error('Failed to execute script:', err)
        alert(`Failed to execute script: ${(err as Error).message}`)
      }
    }

    return button
  }
})

let locationInfo: {
  isChromePage: boolean
  currentUrl: string
  tabId?: number
} = {
  isChromePage: false,
  currentUrl: ''
}

async function refreshScriptsList(
  info: typeof locationInfo,
  selectedGroups: string[] = []
) {
  locationInfo = info
  const {scripts, groups} = await loadUserScripts()

  if (!groupedList) return

  if (info.isChromePage || !info.tabId) {
    groupedList.render([], selectedGroups)
    return
  }

  if (selectedGroups.length === 0) {
    groupedList.render([], selectedGroups)
    return
  }

  const scriptsWithGroups = Object.entries(scripts)
    .filter(([_, script]: [string, UserScript]) => {
      if (!script.enabled) return false

      const patterns = script.pattern.split('|').map((p: string) => p.trim())
      return patterns.some((pattern: string) => {
        const regex = pattern
          .replace(/\./g, '\\.')
          .replace(/\*/g, '.*')
          .replace(/\?/g, '.')
        return new RegExp(regex).test(info.currentUrl)
      })
    })
    .map(([name, script]: [string, UserScript]) => {
      const group = script.groupId ? groups[script.groupId] : null
      return {
        ...script,
        name,
        groupName: group?.name || 'No Group'
      }
    })

  groupedList.render(scriptsWithGroups, selectedGroups)
}

// Update initializeLocationChecker to use currentSelectedGroups
initializeLocationChecker(info => refreshScriptsList(info, currentSelectedGroups))
