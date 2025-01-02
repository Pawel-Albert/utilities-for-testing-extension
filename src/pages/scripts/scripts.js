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

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast')
  toast.textContent = message
  toast.className = `toast ${type}`

  void toast.offsetWidth

  toast.classList.add('show')
  setTimeout(() => {
    toast.classList.remove('show')
  }, 2000)
}

async function saveScript() {
  const name = document.getElementById('scriptName').value.trim()
  if (!name || name.length < 3) {
    showToast('Script name must be at least 3 characters long', 'error')
    return
  }
  const pattern = document.getElementById('scriptPattern').value.trim() || '*://*/*'
  const code = document.getElementById('scriptEditor').value.trim()
  const description = document.getElementById('scriptDescription').value.trim()

  const {userScripts = {}} = await chrome.storage.sync.get('userScripts')
  const scriptId = Date.now().toString()
  userScripts[name] = {
    id: scriptId,
    code,
    pattern,
    description,
    enabled: userScripts[name]?.enabled ?? true,
    created: new Date().toISOString()
  }

  await saveToStorages(userScripts)
  refreshScriptsList()

  document.getElementById('scriptName').value = ''
  document.getElementById('scriptEditor').value = ''
  document.getElementById('scriptPattern').value = ''
  document.getElementById('scriptDescription').value = ''
  showToast('Script saved successfully!')
}

async function refreshScriptsList() {
  const {userScripts = {}} = await chrome.storage.sync.get('userScripts')
  const list = document.getElementById('scriptsList')
  list.innerHTML = ''

  Object.entries(userScripts).forEach(([name, script]) => {
    const div = document.createElement('div')
    div.className = `script-item ${script.enabled ? '' : 'disabled'}`
    div.dataset.scriptId = script.id

    const controls = document.createElement('div')
    controls.className = 'script-controls'

    const toggle = document.createElement('input')
    toggle.type = 'checkbox'
    toggle.className = 'script-toggle'
    toggle.checked = script.enabled
    toggle.onchange = () => toggleScript(name, toggle.checked)
    controls.appendChild(toggle)

    const info = document.createElement('div')
    info.className = 'script-info'
    info.innerHTML = `
      <strong>${name}</strong>
      <div class="script-pattern">${script.pattern}</div>
      <div class="script-desc">${script.description}</div>
    `
    controls.appendChild(info)

    // Buttons section
    const buttons = document.createElement('div')
    buttons.className = 'script-buttons'

    const editBtn = document.createElement('button')
    editBtn.textContent = 'Edit'
    editBtn.onclick = () => loadScript(name, script.id)

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete'
    deleteBtn.onclick = () => deleteScript(name)

    buttons.appendChild(editBtn)
    buttons.appendChild(deleteBtn)
    div.appendChild(controls)
    div.appendChild(buttons)

    list.appendChild(div)
  })
}

async function loadScript(name, scriptId) {
  const {userScripts = {}} = await chrome.storage.sync.get('userScripts')
  const script = userScripts[name]
  if (script) {
    document.getElementById('scriptName').value = name
    document.getElementById('scriptPattern').value = script.pattern || ''
    document.getElementById('scriptDescription').value = script.description || ''
    document.getElementById('scriptEditor').value = script.code || ''
    document.getElementById('scriptEditor').dataset.editingId = scriptId

    document.getElementById('editMode').textContent = `Editing script: ${name}`

    document.getElementById('saveButton').style.display = 'none'
    document.getElementById('updateButton').style.display = 'inline-block'
    document.getElementById('cancelButton').style.display = 'inline-block'
  }
}

function cancelEdit() {
  document.getElementById('scriptName').value = ''
  document.getElementById('scriptPattern').value = ''
  document.getElementById('scriptDescription').value = ''
  document.getElementById('scriptEditor').value = ''
  document.getElementById('scriptEditor').dataset.editingId = ''

  document.getElementById('editMode').textContent = ''
  document.getElementById('saveButton').style.display = 'inline-block'
  document.getElementById('updateButton').style.display = 'none'
  document.getElementById('cancelButton').style.display = 'none'
}

async function updateScript() {
  const name = document.getElementById('scriptName').value.trim()
  if (!name || name.length < 3) {
    showToast('Script name must be at least 3 characters long', 'error')
    return
  }

  const editingId = document.getElementById('scriptEditor').dataset.editingId
  if (!editingId) {
    showToast('Cannot identify script to update', 'error')
    return
  }

  const scripts = await getScripts()
  const existingScript = Object.entries(scripts).find(
    ([_, script]) => script.id === editingId
  )
  const wasEnabled = existingScript ? existingScript[1].enabled : true
  if (existingScript) {
    const [oldName] = existingScript
    if (oldName !== name) {
      delete scripts[oldName]
    }
  }

  scripts[name] = {
    id: editingId,
    code: document.getElementById('scriptEditor').value.trim(),
    pattern: document.getElementById('scriptPattern').value.trim() || '*://*/*',
    description: document.getElementById('scriptDescription').value.trim(),
    enabled: wasEnabled,
    updated: new Date().toISOString()
  }

  await saveToStorages(scripts)
  refreshScriptsList()
  cancelEdit()
  showToast('Script updated successfully!')
}

function showConfirmModal(message) {
  return new Promise(resolve => {
    const modal = document.getElementById('confirmModal')
    document.getElementById('modalMessage').textContent = message
    modal.style.display = 'block'

    document.getElementById('modalConfirm').onclick = () => {
      modal.style.display = 'none'
      resolve(true)
    }
    document.getElementById('modalCancel').onclick = () => {
      modal.style.display = 'none'
      resolve(false)
    }
  })
}

async function deleteScript(name) {
  if (await showConfirmModal(`Are you sure you want to delete script "${name}"?`)) {
    const {userScripts = {}} = await chrome.storage.sync.get('userScripts')
    delete userScripts[name]
    await saveToStorages(userScripts)
    refreshScriptsList()
    showToast('Script deleted successfully!')
  }
}

async function toggleScript(name, enabled) {
  const {userScripts = {}} = await chrome.storage.sync.get('userScripts')
  if (userScripts[name]) {
    userScripts[name].enabled = enabled
    userScripts[name].updated = new Date().toISOString()
    await saveToStorages(userScripts)
    refreshScriptsList()
    showToast(`Script ${enabled ? 'enabled' : 'disabled'} successfully!`)
  }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveButton').addEventListener('click', saveScript)
  document.getElementById('updateButton').addEventListener('click', updateScript)
  document.getElementById('cancelButton').addEventListener('click', cancelEdit)
  document.getElementById('debugStorage').addEventListener('click', debugStorage)

  refreshScriptsList()
})
