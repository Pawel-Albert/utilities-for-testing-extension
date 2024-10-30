import {siteData} from './model/siteSelectors'
import {fillForm} from './model/formFiller'
import {updateEmailFields} from '../utilis/emailHelper'

async function initDefaultFormFiller() {
  const config = await chrome.storage.sync.get(['userPrefix', 'emailDomain'])
  const currentSite = 'default'

  const currentSiteData = updateEmailFields(siteData[currentSite], config)
  fillForm(currentSite, currentSiteData)
}

initDefaultFormFiller()
