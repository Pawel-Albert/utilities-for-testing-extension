import {fillForm} from './model/formFiller'
import {getSiteData} from './model/siteSelectors'
import {updateEmailFields} from '../utils/emailHelper'

async function fillDefaultForm() {
  try {
    const config = await chrome.storage.sync.get(['userPrefix', 'emailDomain'])
    console.log('Loaded config:', config)
    const siteData = getSiteData()
    const currentSite = 'default'
    const currentSiteData = siteData[currentSite]

    const updatedSiteData = updateEmailFields(currentSiteData, {
      userPrefix: config.userPrefix,
      emailDomain: config.emailDomain
    })

    fillForm(currentSite, updatedSiteData)
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
}

fillDefaultForm()
