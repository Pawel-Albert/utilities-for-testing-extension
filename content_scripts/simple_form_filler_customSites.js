import {siteData} from './model/siteSelectors'
import {fillForm} from './model/formFiller'
import {updateEmailFields} from '../utilis/emailHelper'

async function initFormFiller() {
  const config = await chrome.storage.sync.get(['userPrefix', 'emailDomain'])
  console.log('Loaded config:', config)
  const currentSite = window.location.hostname
  let currentSiteKey

  if (currentSite.startsWith('lendi-b2c-')) {
    currentSiteKey = Object.keys(siteData).find(key => key.includes('lendi-b2c-*'))
  } else if (currentSite.includes('fincrm-frontend-git')) {
    currentSiteKey = Object.keys(siteData).find(key =>
      key.includes('fincrm-frontend-git')
    )
  } else {
    currentSiteKey = Object.keys(siteData).find(key =>
      key.split('|').includes(currentSite)
    )
  }
  console.log('Current site:', currentSite)
  console.log('Using site config:', currentSiteKey)
  console.log('Site data:', siteData[currentSiteKey])
  const currentSiteData = updateEmailFields(siteData[currentSiteKey], config)
  fillForm(currentSite, currentSiteData)
}

initFormFiller()
