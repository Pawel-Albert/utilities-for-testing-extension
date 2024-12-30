const DB_NAME = 'TesterUtilitiesDB'
const STORE_NAME = 'settings'
import {defaultSettings} from '../content_scripts/config/defaults.js'

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = event => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings')
      }
    }
  })
}

export async function saveToIndexedDB(data, key = 'currentScripts') {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(data, key)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function getFromIndexedDB(key = 'currentScripts') {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(key)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result || {})
  })
}

export async function saveToStorages(data, key = 'userScripts') {
  await chrome.storage.sync.set({[key]: data})
  await saveToIndexedDB(data)
}

export async function getFromStorages(key = 'userScripts') {
  try {
    const chromeData = (await chrome.storage.sync.get(key))[key]
    if (chromeData) {
      await saveToIndexedDB(chromeData)
      return chromeData
    }

    const dbData = await getFromIndexedDB()
    if (Object.keys(dbData).length > 0) {
      await saveToStorages(dbData)
      return dbData
    }

    return {}
  } catch (error) {
    console.error('Error loading data:', error)
    return {}
  }
}

export async function saveSettings(settings) {
  await chrome.storage.sync.set(settings)
  await saveToIndexedDB(settings, 'settings')
}

export async function getSettings() {
  try {
    const chromeSettings = await chrome.storage.sync.get(null)
    if (Object.keys(chromeSettings).length > 0) {
      await saveToIndexedDB(chromeSettings, 'settings')
      return {...defaultSettings, ...chromeSettings}
    }

    const dbSettings = await getFromIndexedDB('settings')
    if (Object.keys(dbSettings).length > 0) {
      await saveSettings(dbSettings)
      return {...defaultSettings, ...dbSettings}
    }

    return defaultSettings
  } catch (error) {
    console.error('Error loading settings:', error)
    return defaultSettings
  }
}

export function debugStorage() {
  console.group('Storage Debug Info')
  chrome.storage.sync.get(null).then(result => {
    console.log('Chrome Storage:', result)
  })
  getFromIndexedDB('settings')
    .then(result => {
      console.log('IndexedDB Settings:', result)
    })
    .catch(error => {
      console.log('IndexedDB error:', error)
    })
  getFromIndexedDB('currentScripts')
    .then(result => {
      console.log('IndexedDB Scripts:', result)
    })
    .catch(error => {
      console.log('IndexedDB error:', error)
    })
  console.groupEnd()
}
