import {createPanelSelector} from '../../components/PanelSelector'
import {loadUserScripts} from '../../services/userScripts'
import {getUserScriptButtonCode} from '../../components/UserScriptButton'
import {initializeLocationChecker} from '../../utils/locationChecker'
import {createGroupFilter} from '../../components/GroupFilter'
import {createGroupedList} from '../../components/GroupedList'
import {groupStyles} from '../../components/styles'
import {UserScript} from '../../types/userScripts'

createPanelSelector(document.body)

const style = document.createElement('style')
style.textContent = groupStyles
document.head.appendChild(style)

function sanitizeId(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_]/g, '_')
}

// Keep track of selected groups
let currentSelectedGroups: string[] = []

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
      if (toggle.checked) {
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
          await refreshPanel(locationInfo)
        } catch (err) {
          console.error('Failed to register script:', err)
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
            console.error('Failed to unregister script:', script.id, err)
          }
        }
        await refreshPanel(locationInfo)
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

  if (!info.tabId) {
    groupedList.render([], selectedGroups)
    return
  }

  if (selectedGroups.length === 0) {
    groupedList.render([], selectedGroups)
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

  groupedList.render(scriptsWithGroups, selectedGroups)
}

async function initializeScripts() {
  await chrome.userScripts.configureWorld({
    messaging: true
  })
}

initializeScripts()
// Update initializeLocationChecker to use currentSelectedGroups
initializeLocationChecker(info => refreshPanel(info, currentSelectedGroups))
