import {UserScripts, UserScript, Groups, Group} from '../../types/userScripts'
import {createToast} from '../../components/Toast'
import {createModal} from '../../components/Modal'
import {createScriptForm} from '../../components/ScriptForm'
import {createScriptList} from '../../components/ScriptList'
import {createGroupFilter} from '../../components/GroupFilter'
import {createGroupedList} from '../../components/GroupedList'
import {groupStyles} from '../../components/styles'

type Storage = {
  scripts: UserScripts
  groups: Groups
}

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

  .group-select-container {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .group-select-container select {
    flex: 1;
    min-width: 200px;
  }

  .groups-list {
    max-height: 400px;
    overflow-y: auto;
  }

  .group-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid var(--border);
    margin-bottom: 10px;
    border-radius: 4px;
  }

  .group-info {
    flex-grow: 1;
    margin-right: 10px;
  }

  .group-name {
    font-weight: 500;
  }

  .group-desc {
    font-size: 0.9em;
    color: #666;
    margin-top: 5px;
  }

  .group-actions {
    display: flex;
    gap: 5px;
  }

  ${groupStyles}
`
document.head.appendChild(style)

// Move loadGroups to global scope
let groupSelect: HTMLSelectElement

// Keep track of selected groups
let currentSelectedGroups: string[] = []

async function loadGroups() {
  if (!groupSelect) {
    groupSelect = document.getElementById('scriptGroup') as HTMLSelectElement
  }
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

async function editGroup(groupId: string) {
  const storage = await getStorage()
  const group = storage.groups?.[groupId]

  if (!group) return

  // Close the manage groups modal first
  modal.close()

  const result = await modal.show('Edit Group', {
    content: `
      <div style="margin-bottom: 15px;">
        <label for="editGroupName" style="display: block; margin-bottom: 5px; font-weight: bold; color: #666; font-size: 14px;">Name</label>
        <input type="text" id="editGroupName" value="${
          group.name
        }" style="width: 100%; margin-bottom: 10px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
        
        <label for="editGroupDescription" style="display: block; margin-bottom: 5px; font-weight: bold; color: #666; font-size: 14px;">Description</label>
        <input type="text" id="editGroupDescription" value="${
          group.description || ''
        }" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
      </div>
    `,
    confirmText: 'Save Changes',
    cancelText: 'Cancel'
  })

  if (result) {
    const nameInput = document.getElementById('editGroupName') as HTMLInputElement
    const descInput = document.getElementById('editGroupDescription') as HTMLInputElement

    if (nameInput?.value) {
      await updateGroup(groupId, nameInput.value, descInput?.value || '')
    }
  }
}

async function updateGroup(groupId: string, name: string, description: string) {
  const storage = await getStorage()

  const existingGroup = Object.values(storage.groups || {}).find(
    (group: any) =>
      group.id !== groupId && group.name.toLowerCase() === name.toLowerCase()
  )

  if (existingGroup) {
    toast.show('Group with this name already exists', 'error')
    return
  }

  if (storage.groups?.[groupId]) {
    storage.groups[groupId] = {
      ...storage.groups[groupId],
      name,
      description
    }

    await saveStorage(storage)
    await loadGroups()
    groupFilter?.refresh()
    showManageGroupsModal() // Refresh the modal content
    toast.show('Group updated successfully')
  }
}

async function deleteGroup(groupId: string) {
  const storage = await getStorage()
  const group = storage.groups?.[groupId]

  if (!group) return

  // Close the manage groups modal first
  modal.close()

  const confirmed = await modal.show(`Delete group "${group.name}"?`, {
    content: 'This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmClass: 'btn-danger'
  })

  if (confirmed && storage.groups?.[groupId]) {
    delete storage.groups[groupId]
    await saveStorage(storage)
    await loadGroups()
    groupFilter?.refresh()
    showManageGroupsModal() // Refresh the modal content
    toast.show('Group deleted successfully')
  } else {
    // If user cancels deletion, show manage groups modal again
    showManageGroupsModal()
  }
}

async function showManageGroupsModal() {
  const storage = await getStorage()
  const groups = storage.groups || {}

  let groupsHtml = '<div class="groups-list" id="groupsList">'
  Object.values(groups)
    .sort((a: any, b: any) => a.order - b.order)
    .forEach((group: any) => {
      groupsHtml += `
        <div class="group-item" data-group-id="${group.id}">
          <div class="group-info">
            <div class="group-name">${group.name}</div>
            ${
              group.description
                ? `<div class="group-desc">${group.description}</div>`
                : ''
            }
          </div>
          <div class="group-actions">
            <button class="edit-group-btn" data-group-id="${group.id}">Edit</button>
            <button class="delete-group-btn" data-group-id="${group.id}">Delete</button>
          </div>
        </div>
      `
    })
  groupsHtml += '</div>'

  // Close any existing modal first
  modal.close()

  // Show the modal with content
  modal.show('Manage Groups', {
    content: groupsHtml,
    confirmText: 'Close',
    cancelText: ''
  })

  // Add event listeners immediately after setting content
  console.log('Adding event listeners...')
  const editButtons = document.querySelectorAll('.edit-group-btn')
  const deleteButtons = document.querySelectorAll('.delete-group-btn')

  console.log('Found buttons:', {
    editButtons: editButtons.length,
    deleteButtons: deleteButtons.length
  })

  editButtons.forEach(btn => {
    btn.addEventListener('click', async e => {
      console.log('Edit button clicked')
      e.preventDefault()
      e.stopPropagation()
      const button = e.currentTarget as HTMLButtonElement
      const groupId = button.dataset.groupId
      if (groupId) {
        await editGroup(groupId)
      }
    })
  })

  deleteButtons.forEach(btn => {
    btn.addEventListener('click', async e => {
      console.log('Delete button clicked')
      e.preventDefault()
      e.stopPropagation()
      const button = e.currentTarget as HTMLButtonElement
      const groupId = button.dataset.groupId
      if (groupId) {
        await deleteGroup(groupId)
      }
    })
  })
}

function initializeGroupSelect() {
  groupSelect = document.getElementById('scriptGroup') as HTMLSelectElement
  const addGroupBtn = document.getElementById('addGroupBtn')
  const manageGroupsBtn = document.getElementById('manageGroupsBtn')

  manageGroupsBtn?.addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()
    showManageGroupsModal()
  })

  async function addNewGroup(name: string, description: string = '') {
    const storage = await getStorage()

    const existingGroup = Object.values(storage.groups || {}).find(
      (group: any) => group.name.toLowerCase() === name.toLowerCase()
    )

    if (existingGroup) {
      toast.show('Group with this name already exists', 'error')
      return
    }

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
    groupFilter?.refresh()
    groupSelect.value = groupId
  }

  addGroupBtn?.addEventListener('click', async e => {
    e.preventDefault()
    e.stopPropagation()

    const result = await modal.show('Add Group', {
      content: `
        <div style="margin-bottom: 15px;">
          <label for="groupName" style="display: block; margin-bottom: 5px; font-weight: bold; color: #666; font-size: 14px;">Name</label>
          <input type="text" id="groupName" style="width: 100%; margin-bottom: 10px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
          
          <label for="groupDescription" style="display: block; margin-bottom: 5px; font-weight: bold; color: #666; font-size: 14px;">Description</label>
          <input type="text" id="groupDescription" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
        </div>
      `,
      confirmText: 'Add Group',
      cancelText: 'Cancel'
    })

    if (result) {
      const nameInput = document.getElementById('groupName') as HTMLInputElement
      const descInput = document.getElementById('groupDescription') as HTMLInputElement
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
    const result = await chrome.storage.local.get(['userScripts', 'groups'])
    return {
      scripts: result.userScripts || {},
      groups: result.groups || {}
    }
  } catch (error) {
    console.error('Error reading storage:', error)
    return {scripts: {}, groups: {}}
  }
}

async function saveStorage(data: Storage): Promise<void> {
  try {
    await chrome.storage.local.set({
      userScripts: data.scripts,
      groups: data.groups
    })
  } catch (error) {
    console.error('Error saving storage:', error)
    throw error
  }
}

// Add pattern validation functions at the top
const URL_MAX_LENGTH = 2048
const ALLOWED_SCHEMES = ['http:', 'https:', '*:']
const FORBIDDEN_CHARS = /[<>|{}"]/
const FORBIDDEN_UNICODE_RANGES = /[\uff00-\uffef]/ // Full-width Unicode characters

function isValidDomain(domain: string): boolean {
  // Basic domain validation
  if (!domain || domain.length < 1) return false
  if (domain.startsWith('.') || domain.endsWith('.')) return false
  if (domain.includes('..')) return false
  if (FORBIDDEN_CHARS.test(domain)) return false
  if (FORBIDDEN_UNICODE_RANGES.test(domain)) return false

  // Allow IP addresses
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/
  if (ipPattern.test(domain)) return true

  // Must have at least one dot for TLD, unless it's a wildcard
  if (!domain.includes('.') && !domain.includes('*')) return false

  return true
}

function normalizePattern(pattern: string): {pattern: string; error?: string} {
  pattern = pattern.trim()

  if (!pattern || pattern === '*') {
    return {pattern: '*://*/*'}
  }

  try {
    const patterns = pattern.split('|').map(p => {
      p = p.trim()

      if (/^[\/]+$/.test(p)) {
        return {error: 'Invalid pattern. Pattern cannot consist of only slashes.'}
      }
      if (p.length > URL_MAX_LENGTH) {
        return {
          error: `Pattern too long. Maximum length is ${URL_MAX_LENGTH} characters.`
        }
      }

      if (FORBIDDEN_CHARS.test(p)) {
        return {error: 'Pattern contains forbidden characters.'}
      }

      if (/@/.test(p) && /:/.test(p.split('@')[0])) {
        return {error: 'Pattern cannot contain authentication credentials.'}
      }

      p = p.replace(/\s+/g, '')

      p = p.replace(/([^:])\/+/g, '$1/')

      if (p.startsWith('//')) {
        if (p === '//') {
          return {error: 'Invalid pattern. Missing domain after //'}
        }
        return {pattern: ['https:', 'http:'].map(scheme => `${scheme}${p}`).join('|')}
      }

      let scheme = '*:'
      if (p.includes('://')) {
        const [schemepart] = p.split('://')
        scheme = schemepart + ':'
        if (!ALLOWED_SCHEMES.includes(scheme)) {
          return {error: 'Invalid protocol. Use http://, https://, or *://'}
        }
        p = p.substring(scheme.length + 2)
      } else if (p.includes(':')) {
        return {error: 'Invalid protocol. Use http://, https://, or *://'}
      }

      if (p.startsWith('/')) {
        return {error: 'Invalid pattern. Missing domain.'}
      }

      let [domain, ...pathParts] = p.split('/')
      let path = pathParts.length > 0 ? `/${pathParts.join('/')}` : '/*'

      if (domain.startsWith('www.')) {
        domain = domain.substring(4)
      }

      if (!isValidDomain(domain)) {
        return {error: 'Invalid domain format.'}
      }

      if (path.includes('??')) {
        return {error: 'Invalid query string format.'}
      }

      if (path.includes('@')) {
        return {error: '@ character is not allowed in path.'}
      }

      return {pattern: `${scheme}//${domain}${path}`}
    })

    const error = patterns.find(p => p.error)
    if (error) {
      return {pattern: '', error: error.error}
    }

    return {
      pattern: [...new Set(patterns.map(p => p.pattern))].join('|')
    }
  } catch (error) {
    return {
      pattern: '',
      error: error instanceof Error ? error.message : 'Invalid pattern format.'
    }
  }
}

function validatePattern(pattern: string): {isValid: boolean; error?: string} {
  if (!pattern) {
    return {isValid: true} // Empty pattern will be replaced with default
  }

  const result = normalizePattern(pattern)
  if (result.error) {
    return {
      isValid: false,
      error: result.error
    }
  }

  const patterns = result.pattern.split('|')
  for (const p of patterns) {
    const trimmed = p.trim()
    if (!trimmed) continue

    // Basic pattern structure validation
    if (!trimmed.includes('/')) {
      return {
        isValid: false,
        error: 'Pattern must include at least one forward slash after host.'
      }
    }

    // Extract scheme and rest
    const [scheme, rest] = trimmed.split('//')
    if (!rest) {
      return {
        isValid: false,
        error: 'Invalid pattern format. Use scheme://host/path format.'
      }
    }

    // Validate scheme
    if (!ALLOWED_SCHEMES.includes(scheme)) {
      return {
        isValid: false,
        error: 'Invalid protocol. Use http://, https://, or *://'
      }
    }

    // Extract domain and path
    const [domain] = rest.split('/')
    if (!isValidDomain(domain)) {
      return {
        isValid: false,
        error: 'Invalid domain format.'
      }
    }
  }

  return {isValid: true}
}

async function saveScript() {
  const {name, pattern, description, code} = form.getValues()
  const groupId = groupManager.getSelectedGroup()

  if (!name || name.length < 3) {
    toast.show('Script name must be at least 3 characters long', 'error')
    return
  }

  // Validate pattern
  const normalized = normalizePattern(pattern)
  if (normalized.error) {
    toast.show(normalized.error, 'error')
    return
  }

  const {isValid, error} = validatePattern(normalized.pattern)
  if (!isValid) {
    toast.show(error || 'Invalid pattern format', 'error')
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
    pattern: normalized.pattern,
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
  groupFilter?.refresh()
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

  // Validate pattern
  const normalized = normalizePattern(pattern)
  if (normalized.error) {
    toast.show(normalized.error, 'error')
    return
  }

  const {isValid, error} = validatePattern(normalized.pattern)
  if (!isValid) {
    toast.show(error || 'Invalid pattern format', 'error')
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
    pattern: normalized.pattern,
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

const groupFilter = createGroupFilter('filterContainer', {
  onChange: selectedGroups => {
    currentSelectedGroups = selectedGroups
    refreshScriptsList(selectedGroups)
  },
  pageKey: 'scripts'
})

const groupedList = createGroupedList<UserScript & {name: string}>('scriptsList', {
  renderItem: script => {
    const scriptElement = document.createElement('div')
    scriptElement.className = `script-item ${script.enabled ? '' : 'disabled'}`

    const scriptInfo = document.createElement('div')
    scriptInfo.className = 'script-info'

    const scriptName = document.createElement('div')
    scriptName.textContent = script.name

    const scriptPattern = document.createElement('div')
    scriptPattern.className = 'script-pattern'
    scriptPattern.textContent = script.pattern

    if (script.description) {
      const scriptDesc = document.createElement('div')
      scriptDesc.className = 'script-desc'
      scriptDesc.textContent = script.description
      scriptInfo.appendChild(scriptDesc)
    }

    scriptInfo.appendChild(scriptName)
    scriptInfo.appendChild(scriptPattern)

    const controls = document.createElement('div')
    controls.className = 'script-controls'

    const toggle = document.createElement('input')
    toggle.type = 'checkbox'
    toggle.checked = script.enabled
    toggle.className = 'script-toggle'
    toggle.onclick = () => toggleScript(script.name)

    const buttons = document.createElement('div')
    buttons.className = 'script-buttons'

    const editBtn = document.createElement('button')
    editBtn.textContent = 'Edit'
    editBtn.onclick = () => loadScript(script.name)

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete'
    deleteBtn.onclick = () => deleteScript(script.name)

    buttons.appendChild(editBtn)
    buttons.appendChild(deleteBtn)

    controls.appendChild(toggle)
    controls.appendChild(buttons)

    scriptElement.appendChild(scriptInfo)
    scriptElement.appendChild(controls)

    return scriptElement
  }
})

async function refreshScriptsList(selectedGroups?: string[]) {
  const storage = await getStorage()
  if (!groupedList) return

  // If selectedGroups not provided, use current selection
  const groupsToUse = selectedGroups ?? currentSelectedGroups

  // If no groups selected, show nothing
  if (!groupsToUse || groupsToUse.length === 0) {
    groupedList.render([], [])
    return
  }

  const scriptsWithGroups = Object.entries(storage.scripts || {})
    .map(([name, script]) => ({
      ...script,
      name,
      groupName: (script.groupId && storage.groups?.[script.groupId]?.name) || 'No Group'
    }))
    // Filter scripts to only show those in selected groups
    .filter(script => {
      // If script has no group and no-group is selected, show it
      if (!script.groupId && groupsToUse.includes('no-group')) {
        return true
      }
      // If script has a group and that group is selected, show it
      if (script.groupId && groupsToUse.includes(script.groupId)) {
        return true
      }
      return false
    })

  groupedList.render(scriptsWithGroups, groupsToUse)
}

async function debugStorage() {
  console.group('Scripts Storage Debug Info')
  try {
    const storage = await getStorage()
    console.log('Scripts:', storage.scripts)
    console.log('Groups:', storage.groups)

    chrome.storage.local.getBytesInUse(null, bytes => {
      console.log(`Storage size: ${bytes} bytes (${(bytes / 1024 / 1024).toFixed(2)} MB)`)
      console.log(`Storage limit with unlimitedStorage: ~5-6 GB`)
    })
  } catch (error) {
    console.error('Debug error:', error)
  }
  console.groupEnd()
}

document.addEventListener('DOMContentLoaded', async () => {
  await refreshScriptsList()

  const saveButton = document.getElementById('saveButton')
  const updateButton = document.getElementById('updateButton')
  const cancelButton = document.getElementById('cancelButton')
  const debugButton = document.getElementById('debugButton')

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

  if (debugButton) {
    debugButton.addEventListener('click', debugStorage)
  }
})
