import {getBuiltInSiteData} from '../../content_scripts/model/siteSelectors'
import {
  getSiteDataAsync,
  getCustomSiteSelectors as getCustomSiteSelectorsFromStorage
} from '../../content_scripts/model/siteSelectorAsync'
import {SelectorType} from '../../types/formFiller'
import {initCollapsibleSections} from '../../content_scripts/model/collapsible'
import {EnhancedSelectorType} from '../../types/enhancedSelectors'

// Interface for custom site selectors stored in Chrome storage
interface CustomSiteSelectors {
  sites: Record<string, Record<string, SelectorType>>
}

const DEFAULT_TIMEOUT = 1000
const STORAGE_KEY = 'customSiteSelectors'

let isEditMode = false
let editingPattern = ''

let currentStep = 1
let selectedElementType = ''
let currentSelector: EnhancedSelectorType | null = null

// Get combined site data (built-in + custom)
// This function fetches both built-in and custom selectors
async function getCombinedSiteData(): Promise<
  Record<string, Record<string, SelectorType>>
> {
  try {
    // For the selectors page, we want to show custom selectors too
    return await getSiteDataAsync()
  } catch (error) {
    console.error('Error getting combined site data:', error)
    // Fallback to built-in data if async loading fails
    return getBuiltInSiteData()
  }
}

function initSelectorBuilder() {
  const typeOptions = document.querySelectorAll('.type-option')
  typeOptions.forEach(option => {
    option.addEventListener('click', () => {
      typeOptions.forEach(opt => opt.classList.remove('selected'))
      option.classList.add('selected')
      selectedElementType = option.getAttribute('data-type') || ''

      preselectValues(selectedElementType)
    })
  })

  const selectorMethod = document.getElementById('selectorMethod') as HTMLSelectElement
  selectorMethod?.addEventListener('change', () => {
    updateSelectorMethodOptions(selectorMethod.value)
  })

  const actionType = document.getElementById('actionType') as HTMLSelectElement
  actionType?.addEventListener('change', () => {
    updateActionOptions(actionType.value)
  })

  const dataType = document.getElementById('dataType') as HTMLSelectElement
  dataType?.addEventListener('change', () => {
    const isStatic = dataType.value === 'static'
    const staticDataFields = document.getElementById('staticDataFields')
    const functionDataFields = document.getElementById('functionDataFields')

    if (staticDataFields) staticDataFields.classList.toggle('visible', isStatic)
    if (functionDataFields) functionDataFields.classList.toggle('visible', !isStatic)
  })

  const prevButton = document.getElementById('prevButton')
  const nextButton = document.getElementById('nextButton')

  prevButton?.addEventListener('click', goToPrevStep)
  nextButton?.addEventListener('click', goToNextStep)

  const copyButton = document.getElementById('copyButton')
  const addToJsonButton = document.getElementById('addToJsonButton')

  copyButton?.addEventListener('click', copyToClipboard)
  addToJsonButton?.addEventListener('click', addToJsonEditor)

  if (selectorMethod) {
    updateSelectorMethodOptions(selectorMethod.value)
  }
}

function preselectValues(elementType: string) {
  const selectorMethod = document.getElementById('selectorMethod') as HTMLSelectElement
  const actionType = document.getElementById('actionType') as HTMLSelectElement

  if (!selectorMethod || !actionType) return
  switch (elementType) {
    case 'input':
      selectorMethod.value = 'label'
      actionType.value = 'input'
      break
    case 'button':
      selectorMethod.value = 'role'
      const roleName = document.getElementById('roleName') as HTMLSelectElement
      if (roleName) roleName.value = 'button'
      actionType.value = 'simpleClick'
      break
    case 'checkbox':
      selectorMethod.value = 'role'
      const roleNameCb = document.getElementById('roleName') as HTMLSelectElement
      if (roleNameCb) roleNameCb.value = 'checkbox'
      actionType.value = 'checkCheckbox'
      break
    case 'dropdown':
      selectorMethod.value = 'role'
      const roleNameDd = document.getElementById('roleName') as HTMLSelectElement
      if (roleNameDd) roleNameDd.value = 'combobox'
      actionType.value = 'simpleClick'
      break
  }

  updateSelectorMethodOptions(selectorMethod.value)
  updateActionOptions(actionType.value)
}

function updateSelectorMethodOptions(method: string) {
  const roleOptions = document.getElementById('roleOptions')
  const exactMatchContainer = document.querySelector(
    '.exact-match-container'
  ) as HTMLElement

  if (roleOptions) {
    roleOptions.style.display = 'none'
  }

  if (exactMatchContainer) {
    exactMatchContainer.style.display = 'none'
  }

  switch (method) {
    case 'role':
      if (roleOptions) {
        roleOptions.style.display = 'block'
      }
      break
    case 'label':
    case 'text':
      if (exactMatchContainer) {
        exactMatchContainer.style.display = 'flex'
      }
      break
  }
}

function updateActionOptions(action: string) {
  const dataOptions = document.getElementById('dataOptions')

  if (dataOptions) {
    if (action === 'input') {
      dataOptions.classList.add('visible')
    } else {
      dataOptions.classList.remove('visible')
    }
  }
}

function goToPrevStep() {
  if (currentStep > 1) {
    const currentStepEl = document.getElementById(`step${currentStep}`)
    const prevStepEl = document.getElementById(`step${currentStep - 1}`)

    if (currentStepEl && prevStepEl) {
      currentStepEl.classList.remove('active')
      prevStepEl.classList.add('active')
      currentStep--

      updateButtonStates()
    }
  }
}

function goToNextStep() {
  if (currentStep < 3) {
    if (validateCurrentStep()) {
      const currentStepEl = document.getElementById(`step${currentStep}`)
      const nextStepEl = document.getElementById(`step${currentStep + 1}`)

      if (currentStepEl && nextStepEl) {
        currentStepEl.classList.remove('active')
        nextStepEl.classList.add('active')
        currentStep++

        const allFieldsReady = validateAllFields()
        if (allFieldsReady) {
          generateSelector()
        }

        updateButtonStates()
      }
    }
  } else {
    if (validateCurrentStep()) {
      generateSelector()
    }
  }
}

function validateAllFields(): boolean {
  if (!selectedElementType) {
    return false
  }

  const fieldName = (
    document.getElementById('fieldName') as HTMLInputElement
  )?.value.trim()
  const selectorValue = (
    document.getElementById('selectorValue') as HTMLInputElement
  )?.value.trim()

  if (!fieldName || !selectorValue) {
    return false
  }

  const actionType = (document.getElementById('actionType') as HTMLSelectElement)?.value

  if (!actionType) {
    return false
  }
  if (actionType === 'input') {
    const dataType = (document.getElementById('dataType') as HTMLSelectElement)?.value

    if (dataType === 'static') {
      const staticDataValue = (
        document.getElementById('staticDataValue') as HTMLInputElement
      )?.value.trim()
      if (!staticDataValue) {
        return false
      }
    } else if (dataType === 'function') {
      const dataGenerator = (
        document.getElementById('dataGenerator') as HTMLSelectElement
      )?.value
      if (!dataGenerator) {
        return false
      }
    }
  }

  return true
}

function updateButtonStates() {
  const prevButton = document.getElementById('prevButton') as HTMLButtonElement
  const nextButton = document.getElementById('nextButton') as HTMLButtonElement

  if (prevButton) {
    prevButton.disabled = currentStep === 1
  }

  if (nextButton) {
    nextButton.textContent = currentStep < 3 ? 'Next' : 'Generate Selector'
  }
}

function validateCurrentStep(): boolean {
  if (currentStep === 1) {
    if (!selectedElementType) {
      showStatusBuilder('Please select an element type', 'error')
      return false
    }
  } else if (currentStep === 2) {
    const fieldName = (
      document.getElementById('fieldName') as HTMLInputElement
    )?.value.trim()
    const selectorValue = (
      document.getElementById('selectorValue') as HTMLInputElement
    )?.value.trim()

    if (!fieldName) {
      showStatusBuilder('Please enter a field name', 'error')
      return false
    }

    if (!selectorValue) {
      showStatusBuilder('Please enter a selector value', 'error')
      return false
    }
  }

  return true
}

function generateSelector() {
  try {
    const fieldName = (
      document.getElementById('fieldName') as HTMLInputElement
    )?.value.trim()
    const selectorMethod = (
      document.getElementById('selectorMethod') as HTMLSelectElement
    )?.value
    const selectorValue = (
      document.getElementById('selectorValue') as HTMLInputElement
    )?.value.trim()
    const exactMatch = (document.getElementById('exactMatch') as HTMLInputElement)
      ?.checked
    const index = parseInt(
      (document.getElementById('indexOption') as HTMLInputElement)?.value || '0'
    )
    const actionType = (document.getElementById('actionType') as HTMLSelectElement)?.value

    if (!fieldName || !selectorMethod || !selectorValue || !actionType) {
      throw new Error('Missing required fields')
    }

    currentSelector = {
      selector: selectorValue,
      type: actionType as any,
      ...(index > 0 ? {index} : {})
    }

    switch (selectorMethod) {
      case 'label':
        currentSelector.queryType = 'label'
        currentSelector.queryOptions = {
          exact: exactMatch
        }
        break
      case 'role':
        const roleName = (document.getElementById('roleName') as HTMLSelectElement)?.value
        currentSelector.queryType = 'role'
        currentSelector.queryOptions = {
          name: selectorValue
        }
        currentSelector.selector = roleName || 'button'
        break
      case 'text':
        currentSelector.queryType = 'text'
        currentSelector.queryOptions = {
          exact: exactMatch
        }
        break
      case 'testId':
        currentSelector.queryType = 'testId'
        break
      case 'css':
        break
    }

    if (actionType === 'input' && currentSelector) {
      const dataType = (document.getElementById('dataType') as HTMLSelectElement)?.value

      if (dataType === 'static') {
        currentSelector.data = (
          document.getElementById('staticDataValue') as HTMLInputElement
        )?.value
      } else if (currentSelector) {
        currentSelector.dataType = 'function'
        currentSelector.dataGenerator = (
          document.getElementById('dataGenerator') as HTMLSelectElement
        )?.value
      }
    }

    const previewCode = document.getElementById('previewCode')
    const resultContainer = document.getElementById('resultContainer')

    if (previewCode && resultContainer && currentSelector) {
      const codePreview = JSON.stringify(currentSelector, null, 2)
      previewCode.textContent = `"${fieldName}": ${codePreview}`

      resultContainer.style.display = 'block'
      showStatusBuilder('Selector generated successfully!', 'success')
    }
  } catch (error) {
    console.error('Error generating selector:', error)
    showStatusBuilder('Error generating selector: ' + (error as Error).message, 'error')
  }
}

function copyToClipboard() {
  const previewCode = document.getElementById('previewCode')

  if (previewCode && previewCode.textContent) {
    navigator.clipboard
      .writeText(previewCode.textContent)
      .then(() => {
        showStatusBuilder('Copied to clipboard!', 'success')
      })
      .catch(err => {
        console.error('Failed to copy:', err)
        showStatusBuilder('Failed to copy to clipboard', 'error')
      })
  }
}

function addToJsonEditor() {
  try {
    const jsonTextarea = document.getElementById('selectorsJson') as HTMLTextAreaElement
    const previewCode = document.getElementById('previewCode') as HTMLElement

    if (!jsonTextarea || !previewCode) {
      showStatusBuilder('Error: Could not find required elements.', 'error')
      return
    }

    if (!previewCode.textContent) {
      showStatusBuilder('Error: No selector configuration found.', 'error')
      return
    }

    let newSelectorText = previewCode.textContent.trim()
    if (!newSelectorText.startsWith('{')) {
      newSelectorText = '{' + newSelectorText + '}'
    }
    const newSelector = JSON.parse(newSelectorText)
    const selectorName = Object.keys(newSelector)[0]

    if (!selectorName) {
      showStatusBuilder('Invalid selector configuration: missing name.', 'error')
      return
    }

    let existingJSON: Record<string, any> = {}

    if (jsonTextarea.value.trim()) {
      try {
        existingJSON = JSON.parse(jsonTextarea.value)
      } catch (error) {
        showStatusBuilder('Invalid JSON in the editor. Cannot add selector.', 'error')
        return
      }
    }

    if (existingJSON[selectorName] !== undefined) {
      if (
        !confirm(
          `UWAGA! Selektor "${selectorName}" już istnieje i zostanie nadpisany. Czy na pewno chcesz kontynuować?`
        )
      ) {
        showStatusBuilder('Operacja anulowana przez użytkownika.', 'warning')
        return
      }
    }

    const updatedJSON = {...existingJSON}
    updatedJSON[selectorName] = newSelector[selectorName]
    const formattedJSON = JSON.stringify(updatedJSON, null, 2)

    jsonTextarea.value = formattedJSON
    jsonTextarea.dispatchEvent(new Event('input', {bubbles: true}))
    jsonTextarea.dispatchEvent(new Event('change', {bubbles: true}))

    showStatusBuilder(`Added selector "${selectorName}" to the JSON editor.`, 'success')

    resetForm()
  } catch (error) {
    showStatusBuilder(
      'Error adding selector to JSON: ' + (error as Error).message,
      'error'
    )
  }
}

function resetForm() {
  currentStep = 1
  selectedElementType = ''
  currentSelector = null

  document.querySelectorAll('.step').forEach((step, index) => {
    step.classList.toggle('active', index === 0)
  })

  document.querySelectorAll('.type-option').forEach(option => {
    option.classList.remove('selected')
  })

  const fieldName = document.getElementById('fieldName') as HTMLInputElement
  const selectorValue = document.getElementById('selectorValue') as HTMLInputElement
  const staticDataValue = document.getElementById('staticDataValue') as HTMLInputElement
  const resultContainer = document.getElementById('resultContainer')

  if (fieldName) fieldName.value = ''
  if (selectorValue) selectorValue.value = ''
  if (staticDataValue) staticDataValue.value = ''
  if (resultContainer) resultContainer.style.display = 'none'

  updateButtonStates()
}

function showStatusBuilder(
  message: string,
  type: 'success' | 'error' | 'warning' = 'success'
) {
  const statusElement = document.getElementById('statusMessageBuilder')

  if (statusElement) {
    statusElement.textContent = message
    statusElement.className = `status ${type}`

    if (type === 'success') {
      setTimeout(() => {
        if (statusElement) statusElement.className = 'status'
      }, 5000)
    }
  }
}

// Load custom site selectors from storage
async function getCustomSiteSelectors(): Promise<CustomSiteSelectors> {
  try {
    const sites = await getCustomSiteSelectorsFromStorage()
    return {sites}
  } catch (error) {
    console.error('Failed to load custom site selectors:', error)
    return {sites: {}}
  }
}

// Save custom site selectors to storage
async function saveCustomSiteSelectors(data: CustomSiteSelectors): Promise<void> {
  try {
    await chrome.storage.local.set({[STORAGE_KEY]: data})
  } catch (error) {
    console.error('Failed to save custom site selectors:', error)
    throw error
  }
}

// Add or update a custom site
async function addCustomSite(pattern: string, selectorsJson: string): Promise<void> {
  if (!pattern) {
    throw new Error('Site pattern cannot be empty')
  }

  let selectorsObj: Record<string, SelectorType>
  try {
    selectorsObj = JSON.parse(selectorsJson)
  } catch (error: any) {
    throw new Error('Invalid JSON format')
  }

  const customSelectors = await getCustomSiteSelectors()

  customSelectors.sites[pattern] = selectorsObj

  await saveCustomSiteSelectors(customSelectors)
}

// Delete a custom site
async function deleteCustomSite(pattern: string): Promise<void> {
  const customSelectors = await getCustomSiteSelectors()

  if (customSelectors.sites[pattern]) {
    delete customSelectors.sites[pattern]
    await saveCustomSiteSelectors(customSelectors)
  }
}

// Export custom sites to JSON file
function exportCustomSites(customSelectors: CustomSiteSelectors): void {
  const dataStr = JSON.stringify(customSelectors, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
  const exportFileName = 'custom_site_selectors.json'

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileName)
  linkElement.click()
}

// Import custom sites from JSON file
async function importCustomSites(fileContent: string): Promise<void> {
  try {
    const importedData = JSON.parse(fileContent) as CustomSiteSelectors

    if (!importedData.sites) {
      throw new Error('Invalid format: missing "sites" property')
    }

    await saveCustomSiteSelectors(importedData)
  } catch (error: any) {
    throw new Error(`Import failed: ${error.message}`)
  }
}

function showStatus(message: string, type: 'success' | 'error' = 'success'): void {
  const statusElement = document.getElementById('statusMessage')
  if (!statusElement) return

  statusElement.innerHTML = message
  statusElement.className = `status ${type}`
  statusElement.style.display = 'block'

  // Make sure the custom sites section is visible when showing a status
  const customSitesSection = document.getElementById('yourCustomSitesSection')
  const customSitesHeader = document.getElementById('yourCustomSitesHeader')

  if (customSitesSection && customSitesHeader) {
    customSitesSection.classList.remove('collapsed')
    customSitesHeader.classList.remove('collapsed')
  }

  if (type === 'success') {
    setTimeout(() => {
      statusElement.style.display = 'none'
    }, 5000)
  }
}

// Display custom sites list
async function displayCustomSites(): Promise<void> {
  const customSelectors = await getCustomSiteSelectors()
  const sites = Object.keys(customSelectors.sites).sort()
  const container = document.getElementById('customSites')

  if (!container) return

  container.innerHTML = ''

  const noSitesMessage = document.createElement('p')
  noSitesMessage.className = 'help-text'
  noSitesMessage.id = 'noCustomSites'
  noSitesMessage.textContent = 'No custom sites added yet.'

  if (sites.length === 0) {
    container.appendChild(noSitesMessage)
    return
  }

  // Display each custom site
  sites.forEach(pattern => {
    const siteItem = document.createElement('div')
    siteItem.className = 'custom-site-item'

    const header = document.createElement('div')
    header.className = 'custom-site-header'

    const nameSpan = document.createElement('span')
    nameSpan.className = 'site-name'
    nameSpan.textContent = pattern

    const actions = document.createElement('div')
    actions.className = 'site-actions'

    const editBtn = document.createElement('button')
    editBtn.textContent = 'Edit'
    editBtn.className = 'btn-edit'
    editBtn.addEventListener('click', () => {
      // Set form values for editing
      const patternInput = document.getElementById('sitePattern') as HTMLInputElement
      const jsonInput = document.getElementById('selectorsJson') as HTMLTextAreaElement
      const addButton = document.getElementById('addCustomSite') as HTMLButtonElement

      patternInput.value = pattern
      jsonInput.value = JSON.stringify(customSelectors.sites[pattern], null, 2)

      isEditMode = true
      editingPattern = pattern
      if (addButton) {
        addButton.textContent = 'Save Changes'
        addButton.className = 'btn-save'
      }

      // Scroll to form
      patternInput.scrollIntoView({behavior: 'smooth'})
      patternInput.focus()
    })

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete'
    deleteBtn.className = 'btn-delete'
    deleteBtn.addEventListener('click', async () => {
      if (confirm(`Are you sure you want to delete the site pattern "${pattern}"?`)) {
        try {
          await deleteCustomSite(pattern)
          await displayCustomSites()
          await displaySelectors()
          showStatus(`Site pattern "${pattern}" deleted successfully`)
        } catch (error: any) {
          showStatus(`Failed to delete site: ${error.message}`, 'error')
        }
      }
    })

    actions.appendChild(editBtn)
    actions.appendChild(deleteBtn)

    header.appendChild(nameSpan)
    header.appendChild(actions)

    const content = document.createElement('pre')
    content.className = 'site-content'
    content.textContent = JSON.stringify(customSelectors.sites[pattern], null, 2)

    siteItem.appendChild(header)
    siteItem.appendChild(content)

    container.appendChild(siteItem)
  })
}

// Display the site selectors (built-in + custom)
async function displaySelectors(): Promise<void> {
  const container = document.getElementById('siteSelectors')
  if (!container) return

  // Clear previous content
  container.innerHTML = ''

  try {
    // First, show the built-in selectors immediately (synchronous)
    let siteData = getBuiltInSiteData()

    // Add a heading for built-in selectors
    const heading = document.createElement('h3')
    heading.textContent = 'Built-in Site Selectors'
    container.appendChild(heading)

    renderSelectors(container, siteData)

    // Then asynchronously load custom selectors and update display
    try {
      // Get combined site data (built-in + custom)
      const combinedData = await getCombinedSiteData()

      // Clear and update the display
      container.innerHTML = ''

      // Add a heading for all selectors
      const updatedHeading = document.createElement('h3')
      updatedHeading.textContent = 'Built-in & Custom Site Selectors'
      container.appendChild(updatedHeading)

      renderSelectors(container, combinedData)
    } catch (error) {
      console.error('Error loading custom selectors:', error)
      // Built-in selectors are already displayed, so we just show an error
      showStatus(
        'Failed to load custom selectors. Showing built-in selectors only.',
        'error'
      )
    }
  } catch (error) {
    console.error('Error displaying selectors:', error)
    showStatus('Failed to display selectors', 'error')
  }
}

function renderSelectors(
  container: HTMLElement,
  siteData: Record<string, Record<string, SelectorType>>
): void {
  Object.entries(siteData).forEach(([site, selectors]) => {
    const siteGroup = document.createElement('div')
    siteGroup.className = 'site-group'

    siteGroup.innerHTML = `
      <h2>${site}</h2>
      <div class="selector-list">
        ${Object.entries(selectors)
          .map(
            ([name, config]: [string, SelectorType]) => `
            <div class="selector-item">
              <h4>${name}</h4>
              <div class="selector-details">
                <div>type: <span class="selector-type">${config.type}</span></div>
                ${
                  config.type === 'multiStep'
                    ? `
                    <div class="multi-step-details">
                      <div>timeout: ${config.timeout || DEFAULT_TIMEOUT}ms ${
                        !config.timeout
                          ? '<span class="default-note">(default)</span>'
                          : ''
                      }</div>
                      <div class="steps">
                        ${config.steps
                          ?.map(
                            (step, index) => `
                          <div class="step">
                            <div>Step ${index + 1}:</div>
                            <div>selector: ${step.selector}</div>
                            <div>type: ${step.type}</div>
                            ${step.data ? `<div>data: ${step.data}</div>` : ''}
                            ${
                              step.dataType && step.dataType !== 'static'
                                ? `<div class="selector-note">Data generator: ${
                                    step.dataType
                                  } (${step.dataGenerator || 'not specified'})</div>`
                                : ''
                            }
                            ${
                              typeof step.index !== 'undefined'
                                ? `<div class="selector-note">Uses querySelectorAll with index: ${step.index}</div>`
                                : ''
                            }
                          </div>
                        `
                          )
                          .join('')}
                      </div>
                    </div>
                    `
                    : `
                    <div>selector: ${config.selector}</div>
                    ${config.data ? `<div>data: ${config.data}</div>` : ''}
                    ${
                      config.dataType && config.dataType !== 'static'
                        ? `<div class="selector-note">Data generator: ${
                            config.dataType
                          } (${config.dataGenerator || 'not specified'})</div>`
                        : ''
                    }
                    ${
                      typeof config.index !== 'undefined'
                        ? `<div class="selector-note">Uses querySelectorAll with index: ${config.index}</div>`
                        : ''
                    }
                    `
                }
              </div>
            </div>
          `
          )
          .join('')}
      </div>
    `

    container.appendChild(siteGroup)
  })
}

// Set up event listeners for form and buttons
function setupEventListeners(): void {
  // Add custom site
  const addButton = document.getElementById('addCustomSite')
  const exportButton = document.getElementById('exportCustomSites')
  const importButton = document.getElementById('importCustomSites')

  if (addButton) {
    addButton.className = 'btn-primary'
  }

  if (exportButton) {
    exportButton.className = 'btn-secondary'
  }

  if (importButton) {
    importButton.className = 'btn-secondary'
  }

  if (addButton) {
    addButton.addEventListener('click', async () => {
      const patternInput = document.getElementById('sitePattern') as HTMLInputElement
      const jsonInput = document.getElementById('selectorsJson') as HTMLTextAreaElement

      const pattern = patternInput.value.trim()
      const selectorsJson = jsonInput.value.trim()

      try {
        if (isEditMode && editingPattern !== pattern) {
          await deleteCustomSite(editingPattern)
        }

        await addCustomSite(pattern, selectorsJson)

        // Clear form and reset edit mode
        patternInput.value = ''
        jsonInput.value = ''

        if (isEditMode) {
          addButton.textContent = 'Add Custom Site'
          addButton.className = 'btn-primary'
          isEditMode = false
          editingPattern = ''
          showStatus(`Site pattern "${pattern}" updated successfully`)
        } else {
          showStatus(`Site pattern "${pattern}" added successfully`)
        }

        // Refresh displays
        await displayCustomSites()
        await displaySelectors()
      } catch (error: any) {
        showStatus(error.message, 'error')
      }
    })
  }

  // Export custom sites
  if (exportButton) {
    exportButton.addEventListener('click', async () => {
      try {
        const customSelectors = await getCustomSiteSelectors()
        exportCustomSites(customSelectors)
      } catch (error: any) {
        showStatus(`Export failed: ${error.message}`, 'error')
      }
    })
  }

  // Import custom sites
  const importFile = document.getElementById('importFile') as HTMLInputElement

  if (importButton && importFile) {
    importButton.addEventListener('click', () => {
      importFile.click()
    })

    importFile.addEventListener('change', async () => {
      if (importFile.files?.length) {
        const file = importFile.files[0]
        const reader = new FileReader()

        reader.onload = async event => {
          try {
            if (event.target?.result) {
              await importCustomSites(event.target.result as string)

              // Refresh displays
              await displayCustomSites()
              await displaySelectors()

              showStatus('Custom site selectors imported successfully')
            }
          } catch (error: any) {
            showStatus(error.message, 'error')
          }
          // Reset file input
          importFile.value = ''
        }

        reader.readAsText(file)
      }
    })
  }

  const selectorMethodSelect = document.getElementById(
    'selectorMethod'
  ) as HTMLSelectElement
  if (selectorMethodSelect) {
    selectorMethodSelect.addEventListener('change', () => {
      updateSelectorMethodOptions(selectorMethodSelect.value)
    })

    updateSelectorMethodOptions(selectorMethodSelect.value)
  }
}

// Initialize the page
async function init(): Promise<void> {
  try {
    await displayCustomSites()
    await displaySelectors()
    setupEventListeners()
    initSelectorBuilder()
    initCollapsibleSections()

    showStatus('Loaded successfully')
  } catch (error) {
    console.error('Initialization error:', error)
    showStatus('Failed to initialize page', 'error')
  }
}

window.addEventListener('load', function () {
  const textarea = document.getElementById('selectorsJson') as HTMLTextAreaElement
  if (textarea) {
    textarea.style.whiteSpace = 'pre'
    textarea.style.minHeight = '350px'
  }
})

document.addEventListener('DOMContentLoaded', init)
