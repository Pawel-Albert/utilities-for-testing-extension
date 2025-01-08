export interface MenuItem {
  id: string
  title?: string
  contexts: chrome.contextMenus.ContextType[]
  type?: 'normal' | 'checkbox' | 'radio' | 'separator'
  parentId?: string
  file?: string
}

export type MenuItems = MenuItem[]
