import {UserScripts} from '../../types/userScripts'
import {createToast} from '../../components/Toast'
import {createModal} from '../../components/Modal'
import {createScriptForm} from '../../components/ScriptForm'
import {createScriptList} from '../../components/ScriptList'
import {createIndexedDBService} from '../../services/indexedDB'

const db = createIndexedDBService({
  dbName: 'TesterUtilitiesDB',
  stores: ['settings', 'scripts']
})

const toast = createToast('toast')
const modal = createModal({
  modalId: 'confirmModal',
  messageId: 'modalMessage',
  confirmId: 'modalConfirm',
  cancelId: 'modalCancel'
})
const form = createScriptForm()
const scriptList = createScriptList('scriptsList', {
  onToggle: toggleScript,
  onEdit: loadScript,
  onDelete: deleteScript
})

async function saveToStorages(scripts: UserScripts): Promise<void> {
  await chrome.storage.sync.set({userScripts: scripts})
  await db.saveData('settings', 'currentScripts', scripts)
}

async function getScripts(): Promise<UserScripts> {
  try {
    const chromeScripts = (await chrome.storage.sync.get('userScripts')).userScripts
    if (chromeScripts) {
      await db.saveData('settings', 'currentScripts', chromeScripts)
      return chromeScripts
    }

    const dbScripts = await db.getData<UserScripts>('settings', 'currentScripts')
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

function validatePattern(pattern: string): boolean {
  const patterns = pattern.split('|').map(p => p.trim())
  return patterns.every(p => {
    if (!p) return false
    if (p === '*://*/*') return true

    const schemeMatch = p.match(/^(\*|https?):\/\//)
    if (!schemeMatch) return false

    const invalidChars = /[^a-zA-Z0-9\-._*:/?=]/.test(p)
    if (invalidChars) return false

    return true
  })
}

async function saveScript(): Promise<void> {
  const {name, pattern, description, code} = form.getValues()

  if (!name || name.length < 3) {
    toast.show('Script name must be at least 3 characters long', 'error')
    return
  }

  const finalPattern = pattern || '*://*/*'
  if (!validatePattern(finalPattern)) {
    toast.show('Invalid pattern format', 'error')
    return
  }

  const scripts = await getScripts()

  if (scripts[name]) {
    toast.show('Script with this name already exists', 'error')
    return
  }

  const scriptId = Date.now().toString()
  scripts[name] = {
    id: scriptId,
    code,
    pattern,
    description,
    enabled: true,
    created: new Date().toISOString()
  }

  await saveToStorages(scripts)
  await refreshScriptsList()
  form.clear()
  toast.show('Script saved successfully!')
}

async function updateScript(): Promise<void> {
  const {name, pattern, description, code, editingId} = form.getValues()

  if (!name || name.length < 3) {
    toast.show('Script name must be at least 3 characters long', 'error')
    return
  }

  if (!editingId) {
    toast.show('Cannot identify script to update', 'error')
    return
  }

  const scripts = await getScripts()

  const existingWithSameName = Object.entries(scripts).find(
    ([scriptName, script]) => scriptName === name && script.id !== editingId
  )

  if (existingWithSameName) {
    toast.show('Script with this name already exists', 'error')
    return
  }

  const existingScript = Object.entries(scripts).find(
    ([_, script]) => script.id === editingId
  )

  if (existingScript) {
    const [oldName] = existingScript
    if (oldName !== name) {
      delete scripts[oldName]
    }
  }

  const finalPattern = pattern || '*://*/*'
  if (!validatePattern(finalPattern)) {
    toast.show('Invalid pattern format', 'error')
    return
  }

  scripts[name] = {
    id: editingId,
    code,
    pattern,
    description,
    enabled: existingScript ? existingScript[1].enabled : true,
    updated: new Date().toISOString()
  }

  await saveToStorages(scripts)
  await refreshScriptsList()
  form.clear()
  toast.show('Script updated successfully!')
}

async function loadScript(name: string, scriptId: string): Promise<void> {
  const scripts = await getScripts()
  const script = scripts[name]
  if (script) {
    form.setEditMode(name, scriptId, {
      pattern: script.pattern,
      description: script.description,
      code: script.code
    })
  }
}

async function deleteScript(name: string): Promise<void> {
  if (await modal.show(`Are you sure you want to delete script "${name}"?`)) {
    const scripts = await getScripts()
    delete scripts[name]
    await saveToStorages(scripts)
    await refreshScriptsList()
    toast.show('Script deleted successfully!')
  }
}

async function toggleScript(name: string, enabled: boolean): Promise<void> {
  const scripts = await getScripts()
  if (scripts[name]) {
    scripts[name].enabled = enabled
    scripts[name].updated = new Date().toISOString()
    await saveToStorages(scripts)
    await refreshScriptsList()
    toast.show(`Script ${enabled ? 'enabled' : 'disabled'} successfully!`)
  }
}

async function refreshScriptsList(): Promise<void> {
  const scripts = await getScripts()
  scriptList.render(scripts)
}

async function debugStorage(): Promise<void> {
  console.group('Storage Debug Info')
  try {
    const chromeStorage = await chrome.storage.sync.get('userScripts')
    console.log('Chrome Storage (userScripts):', chromeStorage.userScripts || {})

    await db.debugStorage() // to pokaże zawartość IndexedDB
  } catch (error) {
    console.error('Debug error:', error)
  }
  console.groupEnd()
}

document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('saveButton')
  const updateButton = document.getElementById('updateButton')
  const cancelButton = document.getElementById('cancelButton')
  const debugStorageButton = document.getElementById('debugStorage')

  if (saveButton) saveButton.addEventListener('click', saveScript)
  if (updateButton) updateButton.addEventListener('click', updateScript)
  if (cancelButton) cancelButton.addEventListener('click', form.clear)
  if (debugStorageButton) {
    debugStorageButton.addEventListener('click', debugStorage)
  }

  refreshScriptsList()
})
