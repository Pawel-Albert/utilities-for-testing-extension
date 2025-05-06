import {getBuiltInSiteData} from '../../content_scripts/model/siteSelectors'
import {
  getSiteDataAsync,
  getCustomSiteSelectors as getCustomSiteSelectorsFromStorage
} from '../../content_scripts/model/siteSelectorAsync'
import {SelectorType} from '../../types/formFiller'
import {initCollapsibleSections} from '../../content_scripts/model/collapsible'

// Interface for custom site selectors stored in Chrome storage
interface CustomSiteSelectors {
  sites: Record<string, Record<string, SelectorType>>
}

const DEFAULT_TIMEOUT = 1000
const STORAGE_KEY = 'customSiteSelectors'

let isEditMode = false
let editingPattern = ''

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
}

// Initialize the page
async function init(): Promise<void> {
  try {
    await displayCustomSites()
    await displaySelectors()
    setupEventListeners()

    // Initialize collapsible sections
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
