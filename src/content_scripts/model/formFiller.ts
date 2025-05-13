import {
  ActionType,
  DataGeneratorType,
  SelectorType,
  StepType
} from '../../types/formFiller'
import {EnhancedSelectorType, EnhancedStepType} from '../../types/enhancedSelectors'
import {getElementByQuery} from '../../utils/selector-utils'
import {action} from './utilis'

// Helper to check if an object is an enhanced selector
function isEnhancedSelector(
  selector: SelectorType | StepType | EnhancedSelectorType | EnhancedStepType
): selector is EnhancedSelectorType | EnhancedStepType {
  return 'queryType' in selector
}

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
      console.error(
        `%cFunction "${funcName}" not found in global scope`,
        'color: #f44336; font-weight: bold'
      )
      return fieldData.data || ''
    }

    // If we reached here, unsupported data generator type
    console.info(`%cUnsupported dataType: ${dataType}`, 'color: #ff9800')
    return fieldData.data || '' // Fallback to static data
  } catch (error) {
    console.error(`%cError generating data:`, 'color: #f44336; font-weight: bold', error)
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

/**
 * Get DOM element using either standard CSS selectors or enhanced selectors
 *
 * @param selectorInfo Either a CSS selector string or an enhanced selector object
 * @param index Optional index if multiple elements match
 * @returns HTMLElement or null if not found
 */
function getElement(
  selectorInfo: string | EnhancedSelectorType | EnhancedStepType,
  index?: number
): HTMLElement | null {
  // Handle string selectors (legacy mode - CSS only)
  if (typeof selectorInfo === 'string') {
    if (typeof index !== 'undefined') {
      const elements = document.querySelectorAll(selectorInfo)
      return (elements[index] as HTMLElement) || null
    }
    return document.querySelector(selectorInfo) as HTMLElement | null
  }

  // Handle enhanced selectors
  if (isEnhancedSelector(selectorInfo) && selectorInfo.queryType) {
    // Make sure to include the index from both places
    const queryOptions = {
      ...(selectorInfo.queryOptions || {}),
      // Only use the passed index if no index exists in queryOptions
      index:
        selectorInfo.queryOptions?.index !== undefined
          ? selectorInfo.queryOptions.index
          : index
    }

    // Use the selector-utils with enhanced selectors
    return getElementByQuery(
      document.body,
      selectorInfo.selector,
      selectorInfo.queryType,
      queryOptions
    )
  }

  // Fall back to standard selector
  return getElement(selectorInfo.selector, index)
}

async function executeStep(step: StepType | EnhancedStepType) {
  let element: HTMLElement | null

  if (isEnhancedSelector(step) && step.queryType) {
    // Pass the step's index to getElement
    element = getElement(step)
  } else {
    element = getElement(step.selector, step.index)
  }

  executeAction(element, step.type, step)
}

async function executeMultiStep(fieldData: SelectorType | EnhancedSelectorType) {
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
  currentSiteData: Record<string, SelectorType | EnhancedSelectorType>
) {
  if (!currentSiteData) {
    console.info(
      `%cNo site object prepared for ${currentSite}`,
      'color: #f44336; font-family: monospace; font-size: 16px'
    )
    return
  }

  // Count for success/failure summary
  let successCount = 0
  let failureCount = 0

  try {
    Object.entries(currentSiteData).forEach(async ([name, fieldData]) => {
      if (fieldData.type === 'multiStep') {
        await executeMultiStep(fieldData)
        console.info(
          `%cMultiStep executed: %c${name}`,
          'color: #2196f3; font-weight: bold',
          'color: #4caf50; font-weight: bold'
        )
        successCount++
      } else {
        let element: HTMLElement | null

        if (isEnhancedSelector(fieldData) && fieldData.queryType) {
          // Don't pass fieldData.index separately, as it's already in the object
          element = getElement(fieldData)
        } else {
          element = getElement(fieldData.selector, fieldData.index)
        }

        if (element) {
          executeAction(element, fieldData.type, fieldData)
          console.info(
            `%c✓ %c${name}: %c${fieldData.type} successfully applied`,
            'color: #4caf50; font-weight: bold',
            'color: #2196f3; font-weight: bold',
            'color: #333'
          )
          successCount++
        } else {
          console.info(
            `%c✗ %c${name}: %cElement not found with selector: %c${
              typeof fieldData === 'string' ? fieldData : fieldData.selector
            }`,
            'color: #f44336; font-weight: bold',
            'color: #2196f3; font-weight: bold',
            'color: #333',
            'color: #9c27b0; font-style: italic'
          )
          failureCount++
        }
      }
    })

    // After a small delay, show the summary
    setTimeout(() => {
      console.info(
        `%c=============== Form Filling Summary ===============`,
        'color: #2196f3; font-weight: bold; font-size: 14px'
      )
      console.info(
        `%c✓ Successfully filled: %c${successCount} %cfields`,
        'color: #4caf50; font-weight: bold',
        'color: #4caf50; font-weight: bold; font-size: 14px',
        'color: #333'
      )
      if (failureCount > 0) {
        console.info(
          `%c✗ Failed to fill: %c${failureCount} %cfields`,
          'color: #f44336; font-weight: bold',
          'color: #f44336; font-weight: bold; font-size: 14px',
          'color: #333'
        )
      }
      console.info(
        `%c==================================================`,
        'color: #2196f3; font-weight: bold; font-size: 14px'
      )
    }, 1000)
  } catch (error) {
    console.error(`%cForm filling error:`, 'color: #f44336; font-weight: bold', error)
  }
}
