import {
  ActionType,
  DataGeneratorType,
  SelectorType,
  StepType
} from '../../types/formFiller'
import {action} from './utilis'

function getDataValue(fieldData: SelectorType | StepType): string | number {
  const dataType = fieldData.dataType || 'static'
  if (dataType === 'static' || !fieldData.dataGenerator) {
    return fieldData.data || ''
  }

  try {
    // For function data generators, try to call the function from global context
    if (dataType === 'function') {
      // Handle parameters: "generateIncomeAmount:3000:10000"
      const [funcName, ...args] = fieldData.dataGenerator.split(':')
      const fn = window[funcName as keyof Window]
      if (typeof fn === 'function') {
        // Convert parameters to appropriate types
        const convertedArgs = args.map(arg => {
          if (arg.toLowerCase() === 'true') return true
          if (arg.toLowerCase() === 'false') return false
          if (!isNaN(Number(arg))) return Number(arg)
          return arg
        })
        // Pass parameters to the function
        return fn(...convertedArgs)
      }
      console.error(`Function "${funcName}" not found in global scope`)
      return fieldData.data || ''
    }

    // If we reached here, unsupported data generator type
    console.warn(`Unsupported dataType: ${dataType}`)
    return fieldData.data || '' // Fallback to static data
  } catch (error) {
    console.error(`Error generating data:`, error)
    return fieldData.data || '' // Fallback to static data
  }
}

function executeAction(
  element: HTMLElement | null,
  type: ActionType,
  fieldData: SelectorType | StepType
) {
  if (!element) return

  const data = getDataValue(fieldData)

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
  executeAction(element, step.type, step)
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
        executeAction(element, fieldData.type, fieldData)
      }
    })
  } catch (error) {
    console.log(error)
  }
}
