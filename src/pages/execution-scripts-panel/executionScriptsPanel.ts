import {createPanelSelector} from '../../components/PanelSelector'
import {loadUserScripts, executeUserScript} from '../../services/userScripts'
import {ExecuteResult} from '../../types/userScripts'
import {initializeLocationChecker} from '../../utils/locationChecker'

createPanelSelector(document.body)

async function refreshScriptsList(locationInfo: {
  isChromePage: boolean
  currentUrl: string
  tabId?: number
}) {
  const userScripts = await loadUserScripts()
  const list = document.getElementById('userScriptsList')
  if (!list) return

  list.innerHTML = ''

  if (locationInfo.isChromePage || !locationInfo.tabId) return

  Object.entries(userScripts).forEach(([name, script]) => {
    if (!script.enabled) return

    const patterns = script.pattern.split('|').map(p => p.trim())
    const matchesPattern = patterns.some(pattern => {
      const regex = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/\?/g, '.')
      return new RegExp(regex).test(locationInfo.currentUrl)
    })

    if (matchesPattern) {
      const button = document.createElement('div')
      button.className = 'script-item'
      button.textContent = name
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

initializeLocationChecker(refreshScriptsList)
