import {siteData} from './model/siteSelectors'
import {fillForm} from './model/formFiller'

const currentSite = window.location.hostname
const currentSiteData = siteData[currentSite]

fillForm(currentSite, currentSiteData)
