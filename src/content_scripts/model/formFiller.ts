import {ActionType, SelectorType, StepType} from '../../types/formFiller'
import {action} from './utilis'

function executeAction(
  element: HTMLElement | null,
  type: ActionType,
  data?: string | number
) {
  if (!element) return

  switch (type) {
    case 'input':
      action.inputFiller(element, data!)
      break
    case 'inputShadow':
      action.inputFillerShadow(element, data!)
      break
    case 'simpleClick':
      action.simpleClick(element)
      break
    case 'dispatchedClick':
      action.dispatchedClick(element)
      break
    case 'checkCheckbox':
      if (element instanceof HTMLInputElement) {
        action.checkCheckbox(element)
      }
      break
  }
}

function getElement(selector: string, index?: number): HTMLElement | null {
  if (typeof index !== 'undefined') {
    const elements = document.querySelectorAll(selector)
    return (elements[index] as HTMLElement) || null
  }
  return document.querySelector(selector)
}

async function executeStep(step: StepType) {
  const element = getElement(step.selector, step.index)
  executeAction(element, step.type, step.data)
}

async function executeMultiStep(fieldData: SelectorType) {
  const timeout = fieldData.timeout || 1000

  if (fieldData.steps) {
    for (let i = 0; i < fieldData.steps.length; i++) {
      await executeStep(fieldData.steps[i])

      if (i < fieldData.steps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, timeout))
      }
    }
  }
}

export function fillForm(
  currentSite: string,
  currentSiteData: Record<string, SelectorType>
) {
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
