import {UserScript} from '../types/userScripts'

type ScriptListCallbacks = {
  onToggle: (name: string, enabled: boolean) => void
  onEdit: (name: string, id: string) => void
  onDelete: (name: string) => void
}

export function createScriptList(containerId: string, callbacks: ScriptListCallbacks) {
  const container = document.getElementById(containerId)

  function render(scripts: Record<string, UserScript>) {
    if (!container) return
    container.innerHTML = ''

    Object.entries(scripts).forEach(([name, script]) => {
      const div = document.createElement('div')
      div.className = `script-item ${script.enabled ? '' : 'disabled'}`
      div.dataset.scriptId = script.id

      const controls = document.createElement('div')
      controls.className = 'script-controls'

      const toggle = document.createElement('input')
      toggle.type = 'checkbox'
      toggle.className = 'script-toggle'
      toggle.checked = script.enabled
      toggle.onchange = () => callbacks.onToggle(name, toggle.checked)
      controls.appendChild(toggle)

      const info = document.createElement('div')
      info.className = 'script-info'
      info.innerHTML = `
          <strong>${name}</strong>
          <div class="script-pattern">${script.pattern}</div>
          <div class="script-desc">${script.description || ''}</div>
        `
      controls.appendChild(info)

      const buttons = document.createElement('div')
      buttons.className = 'script-buttons'

      const editBtn = document.createElement('button')
      editBtn.textContent = 'Edit'
      editBtn.onclick = () => callbacks.onEdit(name, script.id)

      const deleteBtn = document.createElement('button')
      deleteBtn.textContent = 'Delete'
      deleteBtn.onclick = () => callbacks.onDelete(name)

      buttons.appendChild(editBtn)
      buttons.appendChild(deleteBtn)
      div.appendChild(controls)
      div.appendChild(buttons)

      container.appendChild(div)
    })
  }

  return {render}
}
