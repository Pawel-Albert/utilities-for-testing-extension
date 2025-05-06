import {SiteDataType} from '../../types/formFiller'
import {getSiteData} from './siteSelectors'

// Storage key for custom site selectors
const STORAGE_KEY = 'customSiteSelectors'

/**
 * Get custom site selectors from local storage
 * This is kept in a separate file to avoid breaking the build process
 */
export async function getCustomSiteSelectors(): Promise<Record<string, any>> {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEY])
    return result[STORAGE_KEY]?.sites || {}
  } catch (error) {
    console.error('Failed to load custom site selectors:', error)
    return {}
  }
}

/**
 * Get combined site data (built-in + custom)
 * This is the async version that merges built-in and custom selectors
 */
export async function getSiteDataAsync(): Promise<SiteDataType> {
  try {
    const builtInSiteData = getSiteData()
    const customSiteData = await getCustomSiteSelectors()

    // Merge built-in and custom selectors
    const result = {...builtInSiteData}

    // Add custom sites or override existing ones
    Object.entries(customSiteData).forEach(([siteKey, selectors]) => {
      result[siteKey] = selectors
    })

    return result
  } catch (error) {
    console.error('Error merging site data:', error)
    // Fallback to built-in data on error
    return getSiteData()
  }
}
