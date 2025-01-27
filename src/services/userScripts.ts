import {UserScript, UserScripts, ExecuteResult, Groups} from '../types/userScripts'

interface UserScriptsData {
  scripts: UserScripts
  groups: Groups
}

export async function executeUserScript(script: UserScript, tabId: number | undefined) {
  if (!tabId) {
    throw new Error('No active tab found')
  }

  return chrome.scripting.executeScript({
    target: {tabId},
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
}

export async function loadUserScripts(): Promise<UserScriptsData> {
  const result = await chrome.storage.local.get(['userScripts', 'groups'])
  return {
    scripts: result.userScripts || {},
    groups: result.groups || {}
  }
}

export async function refreshScriptsList(container: HTMLElement) {
  const userScripts = await loadUserScripts()
  container.innerHTML = ''

  Object.entries(userScripts.scripts)
    .filter(([_, script]) => script.enabled)
    .forEach(([name, script]) => {
      const div = document.createElement('div')
      div.className = 'script-item'
      div.textContent = name
      container.appendChild(div)
    })
}
