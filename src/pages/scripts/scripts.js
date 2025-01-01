const DB_NAME = 'TesterUtilitiesDB'
const STORE_NAME = 'settings'

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
      if (!db.objectStoreNames.contains('scripts')) {
        db.createObjectStore('scripts')
      }
    }
  })
}

async function saveToIndexedDB(scripts) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(scripts, 'currentScripts')
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

async function getFromIndexedDB() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get('currentScripts')
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result || {})
  })
}

async function saveToStorages(scripts) {
  await chrome.storage.sync.set({userScripts: scripts})
  await saveToIndexedDB(scripts)
}

async function getScripts() {
  try {
    const chromeScripts = (await chrome.storage.sync.get('userScripts')).userScripts
    if (chromeScripts) {
      await saveToIndexedDB(chromeScripts)
      return chromeScripts
    }

    const dbScripts = await getFromIndexedDB()
    if (Object.keys(dbScripts).length > 0) {
      await saveToStorages(dbScripts)
      return dbScripts
    }

    return {}
  } catch (error) {
    console.error('Error loading scripts:', error)
    return {}
  }
}

function debugStorage() {
  console.group('Storage Debug Info')
  chrome.storage.sync.get('userScripts').then(result => {
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

async function saveScript() {
  const name = document.getElementById('scriptName').value
  const code = document.getElementById('scriptEditor').value
  let pattern = document.getElementById('scriptPattern').value
  if (!pattern.trim() || pattern === '*') {
    pattern = '*://*/*'
  }
  const description = document.getElementById('scriptDescription').value

  const scripts = await getScripts()
  scripts[name] = {
    code,
    pattern,
    description,
    enabled: true,
    created: new Date().toISOString()
  }

  await saveToStorages(scripts)
  refreshScriptsList()

  document.getElementById('scriptName').value = ''
  document.getElementById('scriptEditor').value = ''
  document.getElementById('scriptPattern').value = ''
  document.getElementById('scriptDescription').value = ''
  alert('Script saved successfully!')
}

async function refreshScriptsList() {
  const {userScripts = {}} = await chrome.storage.sync.get('userScripts')
  const list = document.getElementById('scriptsList')
  list.innerHTML = ''

  Object.entries(userScripts).forEach(([name, script]) => {
    const div = document.createElement('div')
    div.className = 'script-item'
    // Info section
    const info = document.createElement('div')
    info.innerHTML = `
      <strong>${name}</strong>
      <div class="script-pattern">${script.pattern}</div>
      <div class="script-desc">${script.description}</div>
    `
    div.appendChild(info)

    // Buttons section
    const buttons = document.createElement('div')

    const editBtn = document.createElement('button')
    editBtn.textContent = 'Edit'
    editBtn.onclick = () => loadScript(name)

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete'
    deleteBtn.onclick = () => deleteScript(name)

    buttons.appendChild(editBtn)
    buttons.appendChild(deleteBtn)
    div.appendChild(buttons)

    list.appendChild(div)
  })
}

async function loadScript(name) {
  const {userScripts = {}} = await chrome.storage.sync.get('userScripts')
  const script = userScripts[name]
  if (script) {
    document.getElementById('scriptName').value = name
    document.getElementById('scriptEditor').value = script.code
    document.getElementById('scriptPattern').value = script.pattern
    document.getElementById('scriptDescription').value = script.description
  }
}

async function deleteScript(name) {
  if (confirm(`Delete script "${name}"?`)) {
    const {userScripts = {}} = await chrome.storage.sync.get('userScripts')
    delete userScripts[name]
    await saveToStorages(userScripts)
    refreshScriptsList()
  }
}

document.getElementById('saveScript').onclick = saveScript
document.getElementById('debugStorage').onclick = debugStorage

refreshScriptsList()
