export type UserScript = {
  id: string
  enabled: boolean
  pattern: string
  code: string
  description?: string
  created?: string
  updated?: string
}

export type UserScripts = {
  [key: string]: UserScript
}

export type ExecuteResult = {
  success: boolean
  logs: [string, ...any[]][]
  error?: string
}

export type ConsoleLogType = 'log' | 'error' | 'warn'
