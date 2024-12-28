import {action} from './utilis'

/**
 * Executes action on element based on type and data
 */
function executeAction(element, type, data) {
  if (!element) return

  switch (type) {
    case 'input':
      action.inputFiller(element, data)
      break
    case 'inputShadow':
      action.inputFillerShadow(element, data)
      break
    case 'simpleClick':
      action.simpleClick(element)
      break
    case 'dispatchedClick':
      action.dispatchedClick(element)
      break
    case 'checkCheckbox':
      action.checkCheckbox(element)
      break
  }
}

/**
 * Gets element based on selector and index
 */
function getElement(selector, index) {
  if (typeof index !== 'undefined') {
    const elements = document.querySelectorAll(selector)
    return elements[index]
  }
  return document.querySelector(selector)
}

async function executeStep(step) {
  const element = getElement(step.selector, step.index)
  executeAction(element, step.type, step.data)
}

async function executeMultiStep(fieldData) {
  const timeout = fieldData.timeout || 1000

  for (let i = 0; i < fieldData.steps.length; i++) {
    await executeStep(fieldData.steps[i])

    if (i < fieldData.steps.length - 1) {
      await new Promise(resolve => setTimeout(resolve, timeout))
    }
  }
}

export function fillForm(currentSite, currentSiteData) {
  if (!currentSiteData) {
    console.log(
      `%c No site object prepared for ${currentSite}`,
      'font-family:monospace; color:red;font-size:20px'
    )
    return
  }

  try {
    Object.entries(currentSiteData).forEach(async ([name, fieldData]) => {
      if (fieldData.type === 'multiStep') {
        await executeMultiStep(fieldData)
        console.log(
          `%c Executed multiStep for ${name}`,
          'font-family:monospace; color:blue;font-size:20px'
        )
      } else {
        const element = getElement(fieldData.selector, fieldData.index)
        executeAction(element, fieldData.type, fieldData.data)
      }
    })
  } catch (error) {
    console.log(error)
  }
}
