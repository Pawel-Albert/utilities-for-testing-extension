import {createPanelSelector} from '../../components/PanelSelector'
import {loadUserScripts, executeUserScript} from '../../services/userScripts'
import {ExecuteResult, UserScript} from '../../types/userScripts'
import {initializeLocationChecker} from '../../utils/locationChecker'
import {createGroupFilter} from '../../components/GroupFilter'
import {createGroupedList} from '../../components/GroupedList'
import {groupStyles} from '../../components/styles'
import {createConsole} from '../../components/Console'
import {consoleStyles} from '../../components/styles/consoleStyles'

createPanelSelector(document.body)

const style = document.createElement('style')
style.textContent = `${groupStyles}${consoleStyles}`
document.head.appendChild(style)

createConsole({
  containerId: 'consoleContainer',
  contentId: 'consoleContent',
  clearButtonId: 'clearConsole'
})

// Keep track of selected groups
let currentSelectedGroups: string[] = []

/**
 * Creates and initializes a self-bootstrapping group filter component.
 * This component is self-contained and manages its own lifecycle through DOM events,
 * storage listeners, and interval timers.
 *
 * @type {import('../../components/GroupFilter').GroupFilter | null}
 * @description Uses the Self-Initializing Component pattern where the component:
 * - Creates and manages its own UI elements
 * - Sets up its own event listeners
 * - Handles its own state management
 * - Maintains storage synchronization
 * - Performs automatic refresh every 5 seconds
 *
 * The component remains active through side effects even though
 * the returned reference isn't used directly.
 */
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

        // Log script output first
        result.logs.forEach(([type, ...args]) => {
          switch (type) {
            case 'log':
              console.log('Script output:', ...args)
              break
            case 'info':
              console.info('Script output:', ...args)
              break
            case 'warn':
              console.warn('Script output:', ...args)
              break
            case 'error':
              console.error('Script execution error:', ...args)
              break
          }
        })

        // Then handle execution status
        if (!result.success) {
          const error = result.error
          const errorDetails =
            typeof error === 'object' && error !== null
              ? {
                  message: String((error as {message?: unknown}).message || error),
                  stack: String((error as {stack?: unknown}).stack || '')
                }
              : String(error)

          console.error('Script execution failed:', {
            name: script.name,
            error: errorDetails
          })
          throw error
        }

        console.log(`Script "${script.name}" executed successfully`)
      } catch (err) {
        const error = err as Error
        console.error('Failed to execute script:', {
          name: script.name,
          error: error.message,
          stack: error.stack
        })
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
