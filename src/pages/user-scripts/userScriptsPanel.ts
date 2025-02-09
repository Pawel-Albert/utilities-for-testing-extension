import {createPanelSelector} from '../../components/PanelSelector'
import {loadUserScripts} from '../../services/userScripts'
import {getUserScriptButtonCode} from '../../components/UserScriptButton'
import {initializeLocationChecker} from '../../utils/locationChecker'
import {createGroupFilter} from '../../components/GroupFilter'
import {createGroupedList} from '../../components/GroupedList'
import {groupStyles} from '../../components/styles'
import {createConsole} from '../../components/Console'
import {consoleStyles} from '../../components/styles/consoleStyles'
import {UserScript} from '../../types/userScripts'

createPanelSelector(document.body)

const style = document.createElement('style')
style.textContent = `${groupStyles}${consoleStyles}`
document.head.appendChild(style)

createConsole({
  containerId: 'consoleContainer',
  contentId: 'consoleContent',
  clearButtonId: 'clearConsole'
})

function sanitizeId(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_]/g, '_')
}

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
    refreshPanel(locationInfo, selectedGroups)
  },
  pageKey: 'userScripts'
})

const groupedList = createGroupedList<UserScript & {name: string}>('userScriptsList', {
  renderItem: script => {
    const scriptContainer = document.createElement('div')
    scriptContainer.className = 'script-container'
    scriptContainer.setAttribute('data-script-name', script.name)

    const leftColumn = document.createElement('div')
    leftColumn.className = 'script-left-column'

    const toggle = document.createElement('input')
    toggle.type = 'checkbox'
    toggle.checked = registeredScripts.some(s => {
      const expectedId = `script-${sanitizeId(script.name)}`
      return s.id.startsWith(expectedId) && s.id.slice(expectedId.length).match(/^-\d+$/)
    })
    toggle.className = 'script-toggle'

    const scriptName = document.createElement('span')
    scriptName.textContent = script.name
    scriptName.className = 'script-name'

    leftColumn.appendChild(toggle)
    leftColumn.appendChild(scriptName)

    const rightColumn = document.createElement('div')
    rightColumn.className = 'script-right-column'

    const patternLabel = document.createElement('div')
    patternLabel.textContent = 'Match Pattern:'
    patternLabel.className = 'script-pattern-label'

    const patternValue = document.createElement('div')
    patternValue.textContent = script.pattern || '*://*/*'
    patternValue.className = 'script-pattern-value'

    rightColumn.appendChild(patternLabel)
    rightColumn.appendChild(patternValue)

    scriptContainer.appendChild(leftColumn)
    scriptContainer.appendChild(rightColumn)

    toggle.onchange = async () => {
      // Prevent immediate state reset
      const newState = toggle.checked

      if (newState) {
        const scriptId = `script-${sanitizeId(script.name)}-${Date.now()}`
        try {
          await chrome.userScripts.register([
            {
              id: scriptId,
              matches: [patternValue.textContent || '*://*/*'],
              js: [
                {
                  code: getUserScriptButtonCode({
                    name: script.name,
                    code: script.code,
                    index: 0
                  })
                }
              ],
              world: 'MAIN',
              runAt: 'document_start',
              allFrames: false
            }
          ])
          console.log(`Script "${script.name}" registered with ID: ${scriptId}`)
          // Update registeredScripts immediately
          registeredScripts = await chrome.userScripts.getScripts()
        } catch (err) {
          const error = err as Error
          console.error('Failed to register script:', {
            name: script.name,
            error: error.message,
            stack: error.stack
          })
          toggle.checked = false
        }
      } else {
        const scriptsToRemove = registeredScripts.filter(s => {
          const expectedId = `script-${sanitizeId(script.name)}`
          return (
            s.id.startsWith(expectedId) && s.id.slice(expectedId.length).match(/^-\d+$/)
          )
        })

        for (const script of scriptsToRemove) {
          try {
            await chrome.userScripts.unregister({ids: [script.id]})
            console.log('Unregistered script:', script.id)
          } catch (err) {
            const error = err as Error
            console.error('Failed to unregister script:', {
              id: script.id,
              error: error.message,
              stack: error.stack
            })
            toggle.checked = true
          }
        }
        // Update registeredScripts immediately
        registeredScripts = await chrome.userScripts.getScripts()
      }
    }

    return scriptContainer
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

let registeredScripts: chrome.userScripts.RegisteredUserScript[] = []

async function refreshPanel(info: typeof locationInfo, selectedGroups: string[] = []) {
  locationInfo = info
  const {scripts, groups} = await loadUserScripts()
  registeredScripts = await chrome.userScripts.getScripts()

  if (!groupedList) return

  if (!info.tabId || selectedGroups.length === 0) {
    // Only clear if we really need to show nothing
    if (document.querySelector('.script-container')) {
      groupedList.render([], selectedGroups)
    }
    return
  }

  const scriptsWithGroups = Object.entries(scripts)
    .filter(([_, script]: [string, UserScript]) => script.enabled)
    .map(([name, script]: [string, UserScript]) => {
      const group = script.groupId ? groups[script.groupId] : null
      return {
        ...script,
        name,
        groupName: group?.name || 'No Group'
      }
    })

  // Only re-render if the content has actually changed
  const currentScripts = Array.from(document.querySelectorAll('.script-name'))
    .map(el => el.textContent)
    .sort()
  const newScripts = scriptsWithGroups.map(s => s.name).sort()

  if (JSON.stringify(currentScripts) !== JSON.stringify(newScripts)) {
    groupedList.render(scriptsWithGroups, selectedGroups)
  } else {
    // Just update toggles state if needed
    scriptsWithGroups.forEach(script => {
      const toggle = document.querySelector(
        `[data-script-name="${script.name}"] .script-toggle`
      ) as HTMLInputElement
      if (toggle) {
        const isRegistered = registeredScripts.some(s => {
          const expectedId = `script-${sanitizeId(script.name)}`
          return (
            s.id.startsWith(expectedId) && s.id.slice(expectedId.length).match(/^-\d+$/)
          )
        })
        if (toggle.checked !== isRegistered) {
          toggle.checked = isRegistered
        }
      }
    })
  }
}

async function initializeScripts() {
  await chrome.userScripts.configureWorld({
    messaging: true
  })
}

// Throttle panel refresh to reduce flickering
let lastRefreshTime = 0
const REFRESH_INTERVAL = 2000 // 2 seconds

initializeScripts()
initializeLocationChecker(info => {
  const now = Date.now()
  if (now - lastRefreshTime >= REFRESH_INTERVAL) {
    lastRefreshTime = now
    refreshPanel(info, currentSelectedGroups)
  }
})
