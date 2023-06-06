import {siteData} from './model/siteSelectors'
import {fillForm} from './model/formFiller'

const currentSite = 'default'
const currentSiteData = siteData[currentSite]

fillForm(currentSite, currentSiteData)
