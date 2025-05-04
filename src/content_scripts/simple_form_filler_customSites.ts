import {fillForm} from './model/formFiller'
import {getSiteDataAsync} from './model/siteSelectorAsync'
import {updateEmailFields} from '../utils/emailHelper'
import '../utils/dataGenerators'

async function fillCustomForm() {
  try {
    const config = await chrome.storage.sync.get(['userPrefix', 'emailDomain'])
    console.log('Loaded config:', config)

    const currentHost = window.location.host
    const currentPath = window.location.pathname
    const fullUrl = currentHost + currentPath

    console.log('Current full URL:', fullUrl)

    const siteData = await getSiteDataAsync()
    let currentSiteKey: string | undefined

    if (currentHost.startsWith('lendi-b2c-')) {
      currentSiteKey = Object.keys(siteData).find(key => key.includes('lendi-b2c-*'))
    } else if (currentHost.includes('fincrm-frontend')) {
      currentSiteKey = Object.keys(siteData).find(key => key.includes('fincrm-frontend'))
    } else {
      currentSiteKey = Object.keys(siteData).find(key => {
        const patterns = key.split('|')
        return patterns.some(pattern => {
          if (pattern.includes('/')) {
            return fullUrl.match(new RegExp(pattern.replace(/\*/g, '.*')))
          }
          return pattern === currentHost
        })
      })

      if (!currentSiteKey) {
        currentSiteKey = Object.keys(siteData).find(key =>
          key.split('|').includes(currentHost)
        )
      }
    }

    if (!currentSiteKey) {
      console.log(
        `%c No site object prepared for ${fullUrl}`,
        'font-family:monospace; color:red;font-size:20px'
      )
      return
    }

    console.log('Current site:', fullUrl)
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
