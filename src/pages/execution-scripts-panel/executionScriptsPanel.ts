import {createPanelSelector} from '../../components/PanelSelector'
import {loadUserScripts, executeUserScript} from '../../services/userScripts'
import {ExecuteResult} from '../../types/userScripts'

createPanelSelector(document.body)

async function initializeScripts() {
  const userScripts = await loadUserScripts()
  const list = document.getElementById('userScriptsList')
  if (!list) return

  const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
  const currentUrl = tab?.url || ''

  if (currentUrl.startsWith('chrome://') || !tab?.id) {
    const notice = document.createElement('div')
    notice.className = 'error-notice'
    notice.textContent = 'Scripts cannot be executed on chrome:// pages'
    list.appendChild(notice)
    return
  }

  Object.entries(userScripts).forEach(([name, script]) => {
    if (!script.enabled) return

    const patterns = script.pattern.split('|').map(p => p.trim())
    const matchesPattern = patterns.some(pattern => {
      const regex = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/\?/g, '.')
      return new RegExp(regex).test(currentUrl)
    })

    if (matchesPattern && tab?.id) {
      const button = document.createElement('div')
      button.className = 'script-item'
      button.textContent = name
      button.onclick = async () => {
        try {
          const results = await executeUserScript(script, tab.id)
          const result = results[0].result as ExecuteResult

          result.logs.forEach(([type, ...args]) => {
            ;(console as any)[type]('Script output:', ...args)
          })

          if (!result.success) {
            throw new Error(result.error)
          }

          console.log(`Script "${name}" executed successfully`)
        } catch (err) {
          console.error('Failed to execute script:', err)
          alert(`Failed to execute script: ${(err as Error).message}`)
        }
      }
      list.appendChild(button)
    }
  })
}

initializeScripts()
