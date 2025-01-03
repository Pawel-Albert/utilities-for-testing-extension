import {UserScript, UserScripts, ExecuteResult} from '../../types/userScripts'

async function loadUserScripts() {
  const {userScripts = {}} = (await chrome.storage.sync.get('userScripts')) as {
    userScripts: UserScripts
  }
  const list = document.getElementById('userScriptsList')
  if (!list) return
  list.innerHTML = ''

  const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
  const currentUrl = tab?.url || ''

  Object.entries(userScripts).forEach(([name, script]) => {
    if (!script.enabled) return

    const patterns = script.pattern.split('|').map(p => p.trim())
    const matchesPattern = patterns.some(pattern => {
      const regex = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/\?/g, '.')
      return new RegExp(regex).test(currentUrl)
    })

    if (matchesPattern) {
      const button = document.createElement('button')
      button.textContent = name
      button.onclick = async () => {
        if (!tab.id) return

        try {
          await chrome.scripting
            .executeScript({
              target: {tabId: tab.id},
              func: (code: string) => {
                const originalConsole = {...console}
                const logs: [string, ...any[]][] = []
                console.log = (...args) => {
                  logs.push(['log', ...args])
                  originalConsole.log(...args)
                }
                console.error = (...args) => {
                  logs.push(['error', ...args])
                  originalConsole.error(...args)
                }
                console.warn = (...args) => {
                  logs.push(['warn', ...args])
                  originalConsole.warn(...args)
                }

                try {
                  eval(code)
                  return {success: true, logs} as ExecuteResult
                } catch (err) {
                  console.error('Script execution error:', err)
                  return {
                    success: false,
                    error: (err as Error).message,
                    logs
                  } as ExecuteResult
                }
              },
              args: [script.code],
              world: 'MAIN'
            })
            .then(results => {
              const result = results[0].result as ExecuteResult
              result.logs.forEach(([type, ...args]) => {
                ;(console as any)[type]('Script output:', ...args)
              })

              if (!result.success) {
                throw new Error(result.error)
              }
            })
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

const openOptionsButton = document.getElementById('openOptions')
if (openOptionsButton) {
  openOptionsButton.onclick = () => {
    chrome.runtime.openOptionsPage()
  }
}

const openSelectorsButton = document.getElementById('openSelectors')
if (openSelectorsButton) {
  openSelectorsButton.onclick = () => {
    chrome.tabs.create({url: chrome.runtime.getURL('src/pages/selectors/selectors.html')})
  }
}

const openScriptsButton = document.getElementById('openScripts')
if (openScriptsButton) {
  openScriptsButton.onclick = () => {
    chrome.tabs.create({url: chrome.runtime.getURL('src/pages/scripts/scripts.html')})
  }
}

async function refreshScriptsList() {
  const {userScripts = {}} = (await chrome.storage.sync.get('userScripts')) as {
    userScripts: UserScripts
  }
  const list = document.getElementById('userScriptsList')
  if (!list) return
  list.innerHTML = ''

  Object.entries(userScripts)
    .filter(([_, script]) => script.enabled)
    .forEach(([name, script]) => {
      const div = document.createElement('div')
      div.className = 'script-item'
      div.textContent = name
      list.appendChild(div)
    })
}

loadUserScripts()
