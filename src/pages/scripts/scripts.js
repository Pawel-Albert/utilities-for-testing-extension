import {saveToStorages, getFromStorages, debugStorage} from '../../utilis/storage.js'

async function saveScript() {
  const name = document.getElementById('scriptName').value
  const code = document.getElementById('scriptEditor').value
  let pattern = document.getElementById('scriptPattern').value
  if (!pattern.trim() || pattern === '*') {
    pattern = '*://*/*'
  }
  const description = document.getElementById('scriptDescription').value

  const scripts = await getFromStorages()
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
