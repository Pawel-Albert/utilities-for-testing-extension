import {UserScripts, UserScript, Groups, Group} from '../../types/userScripts'
import {createToast} from '../../components/Toast'
import {createModal} from '../../components/Modal'
import {createScriptForm} from '../../components/ScriptForm'
import {createScriptList} from '../../components/ScriptList'
import {createIndexedDBService} from '../../services/indexedDB'

type Storage = {
  scripts: UserScripts
  groups: Groups
}

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

const style = document.createElement('style')
style.textContent = `
  .script-item {
    border: 1px solid var(--border);
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .script-item.disabled {
    opacity: 0.5;
  }

  .script-info {
    flex-grow: 1;
    margin: 0 10px;
  }

  .script-pattern {
    font-size: 0.8em;
    color: #666;
    margin-top: 5px;
  }

  .script-desc {
    font-size: 0.9em;
    color: #444;
    margin-top: 5px;
  }

  .script-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .script-buttons {
    display: flex;
    gap: 5px;
  }

  .script-toggle {
    margin: 0;
  }
`
document.head.appendChild(style)

function initializeGroupSelect() {
  const groupSelect = document.getElementById('scriptGroup') as HTMLSelectElement
  const addGroupBtn = document.getElementById('addGroupBtn')

  async function loadGroups() {
    const storage = await getStorage()
    const groups = storage.groups || {}

    groupSelect.innerHTML = '<option value="">Select group...</option>'
    Object.values(groups)
      .sort((a: unknown, b: unknown) => (a as Group).order - (b as Group).order)
      .forEach((group: unknown) => {
        const option = document.createElement('option')
        option.value = (group as Group).id
        option.textContent = (group as Group).name
        groupSelect.appendChild(option)
      })
  }

  async function addNewGroup(name: string, description: string = '') {
    const storage = await getStorage()
    const groupId = `group-${Date.now()}`
    const newGroup: Group = {
      id: groupId,
      name,
      description,
      order: Object.keys(storage.groups || {}).length
    }

    await saveStorage({
      ...storage,
      groups: {
        ...(storage.groups || {}),
        [groupId]: newGroup
      }
    })

    await loadGroups()
    groupSelect.value = groupId
  }

  addGroupBtn?.addEventListener('click', async () => {
    const result = await modal.show('Add New Group', {
      content: `
        <div style="margin-bottom: 15px;">
          <input type="text" id="newGroupName" placeholder="Group name" style="width: 100%; margin-bottom: 10px; padding: 8px;" />
          <input type="text" id="newGroupDescription" placeholder="Description (optional)" style="width: 100%; padding: 8px;" />
        </div>
      `,
      confirmText: 'Add Group',
      cancelText: 'Cancel'
    })

    if (result) {
      const nameInput = document.getElementById('newGroupName') as HTMLInputElement
      const descInput = document.getElementById('newGroupDescription') as HTMLInputElement
      if (nameInput?.value) {
        await addNewGroup(nameInput.value, descInput?.value)
      }
    }
  })

  loadGroups()

  return {
    getSelectedGroup: () => groupSelect.value,
    setSelectedGroup: (groupId: string) => {
      groupSelect.value = groupId
    },
    refreshGroups: loadGroups
  }
}

const groupManager = initializeGroupSelect()

async function getStorage(): Promise<Storage> {
  try {
    const {userScripts, groups} = await chrome.storage.sync.get(['userScripts', 'groups'])
    const storage = {
      scripts: userScripts || {},
      groups: groups || {}
    }

    await Promise.all([
      db.saveData('settings', 'currentScripts', storage.scripts),
      db.saveData('settings', 'groups', storage.groups)
    ])

    return storage
  } catch (err) {
    console.error('Error loading storage:', err)
    return {
      scripts: {},
      groups: {}
    }
  }
}

async function saveStorage(storage: Storage) {
  try {
    await Promise.all([
      chrome.storage.sync.set({
        userScripts: storage.scripts,
        groups: storage.groups
      }),
      db.saveData('settings', 'currentScripts', storage.scripts),
      db.saveData('settings', 'groups', storage.groups)
    ])
  } catch (err) {
    console.error('Error saving storage:', err)
    toast.show('Error saving data', 'error')
  }
}

async function saveScript() {
  const {name, pattern, description, code} = form.getValues()
  const groupId = groupManager.getSelectedGroup()

  if (!name || name.length < 3) {
    toast.show('Script name must be at least 3 characters long', 'error')
    return
  }

  const storage = await getStorage()
  const scripts = storage.scripts

  if (scripts[name]) {
    toast.show('Script with this name already exists', 'error')
    return
  }

  const scriptId = Date.now().toString()
  scripts[name] = {
    id: scriptId,
    code,
    pattern: pattern || '*://*/*',
    description,
    enabled: true,
    created: new Date().toISOString(),
    groupId
  }

  await saveStorage({
    ...storage,
    scripts
  })

  await refreshScriptsList()
  form.clear()
  toast.show('Script saved successfully!')
}

async function updateScript() {
  const {name, pattern, description, code, editingId} = form.getValues()
  const groupId = groupManager.getSelectedGroup()

  if (!name || name.length < 3) {
    toast.show('Script name must be at least 3 characters long', 'error')
    return
  }

  if (!editingId) {
    toast.show('Cannot identify script to update', 'error')
    return
  }

  const storage = await getStorage()
  const scripts = storage.scripts

  const existingScript = Object.entries(scripts).find(
    ([_, s]) => (s as UserScript).id === editingId
  )
  if (!existingScript) {
    toast.show('Script not found', 'error')
    return
  }

  const [oldName] = existingScript
  const updatedScript: UserScript = {
    ...scripts[oldName],
    code,
    pattern: pattern || '*://*/*',
    description,
    groupId,
    updated: new Date().toISOString()
  }

  if (oldName !== name) {
    delete scripts[oldName]
  }
  scripts[name] = updatedScript

  await saveStorage({
    ...storage,
    scripts
  })

  await refreshScriptsList()
  form.clear()
  toast.show('Script updated successfully!')
}

async function deleteScript(name: string) {
  const confirmed = await modal.show(
    `Are you sure you want to delete script "${name}"?`,
    {
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmClass: 'btn-danger'
    }
  )

  if (!confirmed) return

  const storage = await getStorage()
  const scripts = storage.scripts

  delete scripts[name]
  await saveStorage({
    ...storage,
    scripts
  })

  await refreshScriptsList()
  toast.show('Script deleted successfully!')
}

async function toggleScript(name: string) {
  const storage = await getStorage()
  const scripts = storage.scripts

  if (scripts[name]) {
    scripts[name] = {
      ...scripts[name],
      enabled: !scripts[name].enabled
    }

    await saveStorage({
      ...storage,
      scripts
    })

    await refreshScriptsList()
  }
}

async function loadScript(name: string) {
  const storage = await getStorage()
  const script = storage.scripts[name]

  if (script) {
    form.setEditMode(name, script.id, {
      pattern: script.pattern,
      description: script.description,
      code: script.code,
      groupId: script.groupId
    })
  }
}

async function refreshScriptsList() {
  const storage = await getStorage()
  scriptList.render(storage.scripts)
}

async function debugStorage() {
  console.group('Storage Debug Info')
  try {
    const chromeStorage = await chrome.storage.sync.get('userScripts')
    console.log('Chrome Storage (userScripts):', chromeStorage.userScripts || {})
    await db.debugStorage()
  } catch (err) {
    console.error('Debug error:', err)
  }
  console.groupEnd()
}

document.addEventListener('DOMContentLoaded', async () => {
  await refreshScriptsList()

  const saveButton = document.getElementById('saveButton')
  const updateButton = document.getElementById('updateButton')
  const cancelButton = document.getElementById('cancelButton')
  const debugStorageButton = document.getElementById('debugStorage')

  if (saveButton) {
    saveButton.addEventListener('click', saveScript)
  }

  if (updateButton) {
    updateButton.addEventListener('click', updateScript)
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      form.clear()
    })
  }

  if (debugStorageButton) {
    debugStorageButton.addEventListener('click', debugStorage)
  }
})
