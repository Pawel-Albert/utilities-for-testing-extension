import {fillForm} from './model/formFiller'
import {getSiteData} from './model/siteSelectors'
import {updateEmailFields} from '../utils/emailHelper'
import '../utils/dataGenerators'

async function fillDefaultForm() {
  try {
    const config = await chrome.storage.sync.get(['userPrefix', 'emailDomain'])
    console.log('Loaded config:', config)

    const currentHost = window.location.host
    const siteData = getSiteData()

    let currentSiteKey = 'default'
    for (const key of Object.keys(siteData)) {
      if (key === 'default') continue

      const matchesCurrent = key.split('|').some(domain => {
        if (domain.includes('*')) {
          const regex = new RegExp(domain.replace(/\./g, '\\.').replace(/\*/g, '.*'))
          return regex.test(currentHost)
        }
        return domain === currentHost
      })

      if (matchesCurrent) {
        currentSiteKey = key
        break
      }
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

fillDefaultForm()
