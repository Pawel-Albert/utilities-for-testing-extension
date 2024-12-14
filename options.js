import {defaultSettings} from './content_scripts/config/defaults.js'

function loadSettings() {
  chrome.storage.sync.get(null, savedSettings => {
    Object.keys(defaultSettings).forEach(key => {
      const element = document.getElementById(key)
      if (element) {
        element.value = savedSettings[key] || defaultSettings[key]
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

  chrome.storage.sync.set(newSettings, () => {
    showStatus('Settings saved!')
  })
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
