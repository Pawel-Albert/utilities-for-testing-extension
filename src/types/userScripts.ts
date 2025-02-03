export interface UserScript {
  id: string
  code: string
  pattern: string
  description: string
  enabled: boolean
  created?: string
  updated?: string
  groupId?: string
}

export interface Group {
  id: string
  name: string
  description?: string
  order: number
}

export interface UserScripts {
  [key: string]: UserScript
}

export interface Groups {
  [key: string]: Group
}

export interface UserScriptsStorage {
  scripts: UserScripts
  groups: Groups
}

export interface ExecuteResult {
  success: boolean
  error?: string
  logs: [string, ...any[]][]
}

export type ConsoleLogType = 'log' | 'error' | 'warn'
