import {defaultSettings} from './content_scripts/config/defaults.js'

/**
 * Saves settings to both chrome.storage.sync and localStorage
 * @param {Object} settings - Settings object to save
 */
function saveToStorages(settings) {
  chrome.storage.sync.set(settings)
  localStorage.setItem('testerUtilitiesSettings', JSON.stringify(settings))
}

/**
 * Retrieves settings with fallback chain: localStorage -> chrome.storage.sync -> defaults.
 * This ensures settings persistence across extension updates/reinstalls.
 * If found in chrome.storage but not in localStorage, backs up to localStorage.
 * @returns {Promise<Object>} Settings object
 */
async function getSettings() {
  try {
    const localSettings = localStorage.getItem('testerUtilitiesSettings')
    if (localSettings) {
      return JSON.parse(localSettings)
    }

    const chromeSettings = await chrome.storage.sync.get(null)
    if (Object.keys(chromeSettings).length > 0) {
      localStorage.setItem('testerUtilitiesSettings', JSON.stringify(chromeSettings))
      return chromeSettings
    }

    return defaultSettings
  } catch (error) {
    console.error('Error loading settings:', error)
    return defaultSettings
  }
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

function saveSettings(e) {
  e.preventDefault()
  const newSettings = {}

  Object.keys(defaultSettings).forEach(key => {
    const element = document.getElementById(key)
    if (element) {
      const value = element.value.trim()
      newSettings[key] = value || defaultSettings[key]
    }
  })

  saveToStorages(newSettings)
  showStatus('Settings saved!')
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
})
