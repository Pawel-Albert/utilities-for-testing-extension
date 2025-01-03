import {defaultSettings} from '../../content_scripts/config/defaults'

const DB_NAME = 'TesterUtilitiesDB'
const STORE_NAME = 'settings'

async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

async function saveToIndexedDB(settings: Record<string, any>): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(settings, 'currentSettings')
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

async function getFromIndexedDB(): Promise<Record<string, any> | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get('currentSettings')
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result || null)
  })
}

async function saveToStorages(settings: Record<string, any>): Promise<void> {
  await chrome.storage.sync.set(settings)
  await saveToIndexedDB(settings)
}

async function getSettings(): Promise<Record<string, any>> {
  try {
    const chromeSettings = await chrome.storage.sync.get(null)
    if (Object.keys(chromeSettings).length > 0) {
      return chromeSettings
    }

    const dbSettings = await getFromIndexedDB()
    if (dbSettings) {
      await saveToStorages(dbSettings)
      return dbSettings
    }

    return defaultSettings
  } catch (error) {
    console.error('Error loading settings:', error)
    return defaultSettings
  }
}

async function saveSettings(e: Event): Promise<void> {
  e.preventDefault()
  const newSettings: Record<string, any> = {}

  Object.keys(defaultSettings).forEach(key => {
    const element = document.getElementById(key) as HTMLInputElement
    if (element) {
      const value = element.value.trim()
      newSettings[key] = value || defaultSettings[key]
    }
  })

  await saveToStorages(newSettings)
  showStatus('Settings saved!')
}

function loadSettings(): void {
  getSettings().then(settings => {
    Object.keys(defaultSettings).forEach(key => {
      const element = document.getElementById(key) as HTMLInputElement
      if (element) {
        element.value = settings[key] || defaultSettings[key]
      }
    })
  })
}

function debugStorage(): void {
  console.group('Storage Debug Info')
  chrome.storage.sync.get(null).then(result => {
    console.log('Chrome Storage:', result)
  })
  getFromIndexedDB()
    .then(result => {
      console.log('IndexedDB Storage:', result)
    })
    .catch(error => {
      console.log('IndexedDB error:', error)
    })
  console.groupEnd()
}

function exportSettings(): void {
  getSettings().then(settings => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = 'tester_utilities_settings.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  })
}

function importSettings(): void {
  const fileInput = document.getElementById('importFile') as HTMLInputElement
  const file = fileInput.files?.[0]

  if (file) {
    const reader = new FileReader()
    reader.onload = async function (e: ProgressEvent<FileReader>) {
      try {
        const settings = JSON.parse((e.target?.result as string) || '{}')
        await saveToStorages(settings)
        loadSettings()
        showStatus('Settings imported successfully!')
      } catch (error) {
        showStatus('Error importing settings!')
        console.error('Import error:', error)
      }
    }
    reader.readAsText(file)
  }
}

function showStatus(message: string): void {
  const status = document.getElementById('status')
  if (status) {
    status.textContent = message
    status.className = 'status success'
    status.style.display = 'block'
    setTimeout(() => {
      status.style.display = 'none'
    }, 2000)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings()
  document.getElementById('settingsForm')?.addEventListener('submit', saveSettings)
  document.getElementById('exportSettings')?.addEventListener('click', exportSettings)
  document.getElementById('importSettings')?.addEventListener('click', () => {
    document.getElementById('importFile')?.click()
  })
  document.getElementById('importFile')?.addEventListener('change', importSettings)
  document.getElementById('debugStorage')?.addEventListener('click', debugStorage)
})
