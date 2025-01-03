type FormElements = {
  nameInput: HTMLInputElement | null
  patternInput: HTMLInputElement | null
  descriptionInput: HTMLTextAreaElement | null
  editorInput: HTMLTextAreaElement | null
  editMode: HTMLElement | null
  saveButton: HTMLElement | null
  updateButton: HTMLElement | null
  cancelButton: HTMLElement | null
}

export function createScriptForm() {
  const elements: FormElements = {
    nameInput: document.getElementById('scriptName') as HTMLInputElement,
    patternInput: document.getElementById('scriptPattern') as HTMLInputElement,
    descriptionInput: document.getElementById('scriptDescription') as HTMLTextAreaElement,
    editorInput: document.getElementById('scriptEditor') as HTMLTextAreaElement,
    editMode: document.getElementById('editMode'),
    saveButton: document.getElementById('saveButton'),
    updateButton: document.getElementById('updateButton'),
    cancelButton: document.getElementById('cancelButton')
  }

  function getValues() {
    return {
      name: elements.nameInput?.value.trim() || '',
      pattern: elements.patternInput?.value.trim() || '*://*/*',
      description: elements.descriptionInput?.value.trim() || '',
      code: elements.editorInput?.value.trim() || '',
      editingId: elements.editorInput?.dataset.editingId
    }
  }

  function clear() {
    if (elements.nameInput) elements.nameInput.value = ''
    if (elements.patternInput) elements.patternInput.value = ''
    if (elements.descriptionInput) elements.descriptionInput.value = ''
    if (elements.editorInput) {
      elements.editorInput.value = ''
      elements.editorInput.dataset.editingId = ''
    }
    if (elements.editMode) elements.editMode.textContent = ''

    toggleEditMode(false)
  }

  function setEditMode(
    name: string,
    scriptId: string,
    data: {
      pattern?: string
      description?: string
      code?: string
    }
  ) {
    if (elements.nameInput) elements.nameInput.value = name
    if (elements.patternInput) {
      elements.patternInput.value = data.pattern || ''
      elements.patternInput.placeholder =
        'e.g. *://*.example.com/* | *://*.test.com/* | localhost:*'
    }
    if (elements.descriptionInput)
      elements.descriptionInput.value = data.description || ''
    if (elements.editorInput) {
      elements.editorInput.value = data.code || ''
      elements.editorInput.dataset.editingId = scriptId
    }
    if (elements.editMode) elements.editMode.textContent = `Editing script: ${name}`

    toggleEditMode(true)
  }

  function toggleEditMode(isEdit: boolean) {
    if (elements.saveButton)
      elements.saveButton.style.display = isEdit ? 'none' : 'inline-block'
    if (elements.updateButton)
      elements.updateButton.style.display = isEdit ? 'inline-block' : 'none'
    if (elements.cancelButton)
      elements.cancelButton.style.display = isEdit ? 'inline-block' : 'none'
  }

  return {
    getValues,
    clear,
    setEditMode,
    toggleEditMode
  }
}
