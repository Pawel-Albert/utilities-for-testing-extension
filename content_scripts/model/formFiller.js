import {action} from './utilis'

export function fillForm(currentSite, currentSiteData) {
  if (!currentSiteData) {
    console.log(
      `%c No site object prepared for ${currentSite}`,
      'font-family:monospace; color:red;font-size:20px'
    )
    return
  }

  try {
    Object.entries(currentSiteData).forEach(([_, fieldData]) => {
      let element

      if ('index' in fieldData) {
        const elements = document.querySelectorAll(fieldData.selector)
        element = elements[fieldData.index]
      } else {
        element = document.querySelector(fieldData.selector)
      }

      if (element) {
        if (fieldData.type === 'input') {
          action.inputFiller(element, fieldData.data)
        }
        if (fieldData.type === 'inputShadow') {
          action.inputFillerShadow(element, fieldData.data)
        }

        if (fieldData.type === 'simpleClick') {
          action.simpleClick(element)
        }

        if (fieldData.type === 'dispatchedClick') {
          action.dispatchedClick(element)
        }

        if (fieldData.type === 'checkCheckbox') {
          action.checkCheckbox(element)
        }
      }
      console.log(
        `%c Filled something for sure...but what?`,
        'font-family:monospace; color:pink;font-size:20px'
      )
    })
  } catch (error) {
    console.log(error)
  }
}
