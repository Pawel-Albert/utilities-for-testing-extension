import {siteData} from './model/siteSelectors'
import {fillForm} from './model/formFiller'

const currentSite = window.location.hostname
const currentSiteKey = Object.keys(siteData).find(key =>
  key.split('|').includes(currentSite)
)
const currentSiteData = siteData[currentSiteKey]
console.log(currentSite)
fillForm(currentSite, currentSiteData)
