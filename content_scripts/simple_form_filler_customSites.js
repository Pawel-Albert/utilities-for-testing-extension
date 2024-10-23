import {siteData} from './model/siteSelectors'
import {fillForm} from './model/formFiller'

const currentSite = window.location.hostname
let currentSiteKey;

if (currentSite.startsWith('lendi-b2c-')) {
  currentSiteKey = Object.keys(siteData).find(key => key.includes('lendi-b2c-*'));
} else if (currentSite.includes('fincrm-frontend-git')) {
  currentSiteKey = Object.keys(siteData).find(key => key.includes('fincrm-frontend-git'));
} else {
  currentSiteKey = Object.keys(siteData).find(key => key.split('|').includes(currentSite));
}

const currentSiteData = siteData[currentSiteKey]
console.log(currentSite)
fillForm(currentSite, currentSiteData)
