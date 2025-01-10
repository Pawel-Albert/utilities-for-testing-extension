import {fillForm} from './model/formFiller'
import {siteData} from './model/siteSelectors'
import {updateEmailFields} from '../utils/emailHelper'

async function fillCustomForm() {
  try {
    const config = await chrome.storage.sync.get(['userPrefix', 'emailDomain'])
    console.log('Loaded config:', config)

    const currentHost = window.location.host
    let currentSiteKey: string | undefined

    if (currentHost.startsWith('lendi-b2c-')) {
      currentSiteKey = Object.keys(siteData).find(key => key.includes('lendi-b2c-*'))
    } else if (currentHost.includes('fincrm-frontend-git')) {
      currentSiteKey = Object.keys(siteData).find(key =>
        key.includes('fincrm-frontend-git')
      )
    } else {
      currentSiteKey = Object.keys(siteData).find(key =>
        key.split('|').includes(currentHost)
      )
    }

    if (!currentSiteKey) {
      console.log(
        `%c No site object prepared for ${currentHost}`,
        'font-family:monospace; color:red;font-size:20px'
      )
      return
    }

    console.log('Current site:', currentHost)
    console.log('Using site config:', currentSiteKey)
    console.log('Site data:', siteData[currentSiteKey])

    const currentSiteData = siteData[currentSiteKey]
    const updatedSiteData = updateEmailFields(currentSiteData, {
      userPrefix: config.userPrefix,
      emailDomain: config.emailDomain
    })

    fillForm(currentSiteKey, updatedSiteData)
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
}

fillCustomForm()
