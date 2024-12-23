import {defaultSettings} from './content_scripts/config/defaults.js'

const DB_NAME = 'TesterUtilitiesDB'
const STORE_NAME = 'settings'

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = event => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

async function saveToIndexedDB(settings) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(settings, 'currentSettings')
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

async function getFromIndexedDB() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get('currentSettings')
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result || null)
  })
}

/**
 * @param {Object} settings - Settings object to save
 */
async function saveToStorages(settings) {
  await chrome.storage.sync.set(settings)
  await saveToIndexedDB(settings)
}

/**
 * @returns {Promise<Object>} Settings object
 */
async function getSettings() {
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

async function saveSettings(e) {
  e.preventDefault()
  const newSettings = {}

  Object.keys(defaultSettings).forEach(key => {
    const element = document.getElementById(key)
    if (element) {
      const value = element.value.trim()
      newSettings[key] = value || defaultSettings[key]
    }
  })

  await saveToStorages(newSettings)
  showStatus('Settings saved!')
}

function loadSettings() {
  getSettings().then(settings => {
    Object.keys(defaultSettings).forEach(key => {
      const element = document.getElementById(key)
      if (element) {
        element.value = settings[key] || defaultSettings[key]
      }
    })
  })
}

function debugStorage() {
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

function exportSettings() {
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

function importSettings() {
  const fileInput = document.getElementById('importFile')
  const file = fileInput.files[0]

  if (file) {
    const reader = new FileReader()
    reader.onload = async function (e) {
      try {
        const settings = JSON.parse(e.target.result)
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

function showStatus(message) {
  const status = document.getElementById('status')
  status.textContent = message
  status.className = 'status success'
  status.style.display = 'block'
  setTimeout(() => {
    status.style.display = 'none'
  }, 2000)
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings()
  document.getElementById('settingsForm').addEventListener('submit', saveSettings)
  document.getElementById('exportSettings').addEventListener('click', exportSettings)
  document.getElementById('importSettings').addEventListener('click', () => {
    document.getElementById('importFile').click()
  })
  document.getElementById('importFile').addEventListener('change', importSettings)
  document.getElementById('debugStorage').addEventListener('click', debugStorage)
})
