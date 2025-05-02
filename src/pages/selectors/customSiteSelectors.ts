import {SiteDataType, SelectorType} from '../../types/formFiller'
import {getSiteData} from '../../content_scripts/model/siteSelectors'

const STORAGE_KEY = 'customSiteSelectors'

/**
 * Interface for custom site selectors stored in Chrome storage
 */
export interface CustomSiteSelectors {
  sites: Record<string, Record<string, SelectorType>>
}

/**
 * Load custom site selectors from storage
 */
export async function getCustomSiteSelectors(): Promise<CustomSiteSelectors> {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEY])
    return result[STORAGE_KEY] || {sites: {}}
  } catch (error) {
    console.error('Failed to load custom site selectors:', error)
    return {sites: {}}
  }
}

/**
 * Get combined site data (built-in + custom)
 */
export async function getCombinedSiteData(): Promise<SiteDataType> {
  try {
    const builtInSiteData = getSiteData()
    const customSelectors = await getCustomSiteSelectors()

    // Merge built-in and custom selectors
    const result = {...builtInSiteData}

    // Add custom sites or override existing ones
    Object.entries(customSelectors.sites).forEach(([siteKey, selectors]) => {
      result[siteKey] = selectors
    })

    return result
  } catch (error) {
    console.error('Error getting combined site data:', error)
    // Fallback to built-in data if async loading fails
    return getSiteData()
  }
}

/**
 * Save custom site selectors to storage
 */
export async function saveCustomSiteSelectors(data: CustomSiteSelectors): Promise<void> {
  try {
    await chrome.storage.local.set({[STORAGE_KEY]: data})
  } catch (error) {
    console.error('Failed to save custom site selectors:', error)
    throw error
  }
}

/**
 * Add or update a custom site
 */
export async function addCustomSite(
  pattern: string,
  selectorsJson: string
): Promise<void> {
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

/**
 * Delete a custom site
 */
export async function deleteCustomSite(pattern: string): Promise<void> {
  const customSelectors = await getCustomSiteSelectors()

  if (customSelectors.sites[pattern]) {
    delete customSelectors.sites[pattern]
    await saveCustomSiteSelectors(customSelectors)
  }
}

/**
 * Export custom sites to JSON file
 */
export function exportCustomSites(customSelectors: CustomSiteSelectors): void {
  const dataStr = JSON.stringify(customSelectors, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
  const exportFileName = 'custom_site_selectors.json'

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileName)
  linkElement.click()
}

/**
 * Import custom sites from JSON file
 */
export async function importCustomSites(fileContent: string): Promise<void> {
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
