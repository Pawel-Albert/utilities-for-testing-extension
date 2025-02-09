export interface ConsoleOptions {
  containerId: string
  contentId: string
  clearButtonId: string
}

export function createConsole(options: ConsoleOptions) {
  const container = document.getElementById(options.containerId)!
  const content = document.getElementById(options.contentId)!
  const clearButton = document.getElementById(options.clearButtonId)!

  function setupEventListeners() {
    clearButton.addEventListener('click', () => clear())
  }

  function interceptConsole() {
    const originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error
    }

    console.log = (...args) => {
      log('log', ...args)
      originalConsole.log.apply(console, args)
    }

    console.info = (...args) => {
      log('info', ...args)
      originalConsole.info.apply(console, args)
    }

    console.warn = (...args) => {
      log('warn', ...args)
      originalConsole.warn.apply(console, args)
    }

    console.error = (...args) => {
      log('error', ...args)
      originalConsole.error.apply(console, args)
    }
  }

  function formatValue(value: any): string {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    if (typeof value === 'string') return `"${value}"`
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2)
      } catch (e) {
        return value.toString()
      }
    }
    return String(value)
  }

  function log(type: 'log' | 'info' | 'warn' | 'error', ...args: any[]) {
    const message = document.createElement('div')
    message.className = `console-message ${type}`

    const timestamp = new Date().toLocaleTimeString()
    const formattedArgs = args.map(arg => formatValue(arg)).join(' ')

    message.innerHTML = `[${timestamp}] ${formattedArgs}`

    content.appendChild(message)
    content.scrollTop = content.scrollHeight
  }

  function clear() {
    content.innerHTML = ''
  }

  setupEventListeners()
  interceptConsole()

  return {
    log,
    clear
  }
}
