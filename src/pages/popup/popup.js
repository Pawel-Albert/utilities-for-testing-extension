async function loadUserScripts() {
  const {userScripts = {}} = await chrome.storage.sync.get('userScripts')
  const list = document.getElementById('userScriptsList')
  list.innerHTML = ''

  Object.entries(userScripts)
    .filter(([_, script]) => script.enabled)
    .forEach(([name, script]) => {
      const button = document.createElement('button')
      button.textContent = name
      button.onclick = async () => {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
        const pattern = script.pattern === '*' ? '*://*/*' : script.pattern || '*://*/*'

        if (!tab.url.match(pattern.replace(/\*/g, '.*'))) {
          if (!confirm(`This script is configured for ${pattern}. Run anyway?`)) {
            return
          }
        }

        try {
          await chrome.scripting
            .executeScript({
              target: {tabId: tab.id},
              func: code => {
                const originalConsole = {...console}
                const logs = []
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
                  return {success: true, logs}
                } catch (err) {
                  console.error('Script execution error:', err)
                  return {success: false, error: err.message, logs}
                }
              },
              args: [script.code],
              world: 'MAIN'
            })
            .then(results => {
              const {success, logs, error} = results[0].result
              logs.forEach(([type, ...args]) => {
                console[type]('Script output:', ...args)
              })

              if (!success) {
                throw new Error(error)
              }
            })
          console.log(`Script "${name}" executed successfully`)
        } catch (err) {
          console.error('Failed to execute script:', err)
          alert(`Failed to execute script: ${err.message}`)
        }
      }
      list.appendChild(button)
    })
}

document.getElementById('openOptions').onclick = () => {
  chrome.runtime.openOptionsPage()
}

document.getElementById('openSelectors').onclick = () => {
  chrome.tabs.create({url: chrome.runtime.getURL('src/pages/selectors/selectors.html')})
}

document.getElementById('openScripts').onclick = () => {
  chrome.tabs.create({url: chrome.runtime.getURL('src/pages/scripts/scripts.html')})
}

async function refreshScriptsList() {
  const {userScripts = {}} = await chrome.storage.sync.get('userScripts')
  const list = document.getElementById('userScriptsList')
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
