import {createPanelSelector} from '../../components/PanelSelector'
import {loadUserScripts} from '../../services/userScripts'
import {getUserScriptButtonCode} from '../../components/UserScriptButton'

createPanelSelector(document.body)

function sanitizeId(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_]/g, '_')
}

async function refreshPanel() {
  const userScripts = await loadUserScripts()
  const list = document.getElementById('userScriptsList')
  if (!list) return

  const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
  if (!tab?.id) return

  const registeredScripts = await chrome.userScripts.getScripts()
  console.log('Currently registered scripts:', registeredScripts)

  list.innerHTML = ''

  Object.entries(userScripts).forEach(([name, script], index) => {
    if (!script.enabled) return

    const scriptContainer = document.createElement('div')
    scriptContainer.className = 'script-container'

    const leftColumn = document.createElement('div')
    leftColumn.className = 'script-left-column'

    const toggle = document.createElement('input')
    toggle.type = 'checkbox'
    toggle.checked = registeredScripts.some(s => {
      const expectedId = `script-${sanitizeId(name)}`
      return s.id.startsWith(expectedId) && s.id.slice(expectedId.length).match(/^-\d+$/)
    })
    toggle.className = 'script-toggle'

    const scriptName = document.createElement('span')
    scriptName.textContent = name
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
    list.appendChild(scriptContainer)

    toggle.onchange = async () => {
      if (toggle.checked) {
        const scriptId = `script-${sanitizeId(name)}-${Date.now()}`
        try {
          await chrome.userScripts.register([
            {
              id: scriptId,
              matches: [patternValue.textContent || '*://*/*'],
              js: [
                {
                  code: getUserScriptButtonCode({
                    name,
                    code: script.code,
                    index
                  })
                }
              ],
              world: 'MAIN',
              runAt: 'document_start',
              allFrames: false
            }
          ])
          console.log(`Script "${name}" registered with ID: ${scriptId}`)
          await refreshPanel()
        } catch (err) {
          console.error('Failed to register script:', err)
          toggle.checked = false
        }
      } else {
        const scriptsToRemove = registeredScripts.filter(s => {
          const expectedId = `script-${sanitizeId(name)}`
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
        await refreshPanel()
      }
    }
  })
}

async function initializeScripts() {
  await chrome.userScripts.configureWorld({
    messaging: true
  })

  await refreshPanel()
  setInterval(refreshPanel, 3000)
}

initializeScripts()
