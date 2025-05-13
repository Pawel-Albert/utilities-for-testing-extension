import {QueryType, QueryOptions} from '../types/enhancedSelectors'
import {ActionType, DataGeneratorType} from '../types/formFiller'

/**
 * Get element by label text
 * @param container Parent container to search within
 * @param text Label text to find
 * @param exact Whether to require exact text match
 * @param index Index of the element to use when multiple are found (0-based)
 * @returns The input element associated with the label, or null if not found
 */
export function getByLabel(
  container = document.body,
  text: string,
  exact = true,
  index = 0
): HTMLElement | null {
  const labels = Array.from(container.querySelectorAll('label')).filter(label => {
    const labelText = label.textContent?.trim() || ''
    return exact ? labelText === text : labelText.includes(text)
  })

  if (labels.length > 1) {
    console.info(
      `Found ${labels.length} labels with text "${text}". Using index ${index}.`
    )
  } else if (labels.length === 0) {
    console.info(`No labels found with text "${text}"`)
    return null
  }

  if (!labels[index]) {
    console.info(`Requested label index ${index} out of bounds (0-${labels.length - 1})`)
    index = 0
  }

  const label = labels[index]
  const forId = label.getAttribute('for')
  if (forId) {
    const element = document.getElementById(forId)
    if (element) return element as HTMLElement
  }
  const input = label.querySelector('input, select, textarea')
  if (input) return input as HTMLElement

  return null
}

/**
 * Get element by visible text content
 * @param container Parent container to search within
 * @param text Text to find
 * @param exact Whether to require exact text match
 * @param index Index of the element to use when multiple are found (0-based)
 * @returns Element containing the text, or null if not found
 */
export function getByText(
  container = document.body,
  text: string,
  exact = true,
  index = 0
): HTMLElement | null {
  const allElements = container.querySelectorAll('*')
  const matchingElements: HTMLElement[] = []

  for (const element of Array.from(allElements)) {
    if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') continue

    const elementText = element.textContent?.trim() || ''
    const isMatch = exact ? elementText === text : elementText.includes(text)

    if (isMatch && !element.children.length) {
      matchingElements.push(element as HTMLElement)
    }
  }

  if (matchingElements.length > 1) {
    console.info(
      `Found ${matchingElements.length} elements with text "${text}". Using index ${index}.`
    )
  } else if (matchingElements.length === 0) {
    console.warn(`No elements found with text "${text}"`)
    return null
  }

  if (!matchingElements[index]) {
    console.warn(
      `Requested text element index ${index} out of bounds (0-${
        matchingElements.length - 1
      })`
    )
    index = 0
  }

  return matchingElements[index] || null
}

/**
 * Get element by role
 * @param container Parent container to search within
 * @param role ARIA role to find
 * @param options Additional options like name, index (for multiple matches)
 * @returns Element with the role, or null if not found
 */
export function getByRole(
  container = document.body,
  role: string,
  options: QueryOptions = {}
): HTMLElement | null {
  const index = options.index || 0

  let selector = `[role="${role}"]`

  // Handle common implicit roles
  if (role === 'button') {
    selector = `${selector}, button, [type="button"], [type="submit"], [type="reset"]`
  } else if (role === 'textbox') {
    selector = `${selector}, input:not([type]), input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="tel"], input[type="url"], input[type="search"], textarea`
  } else if (role === 'checkbox') {
    selector = `${selector}, input[type="checkbox"]`
  } else if (role === 'radio') {
    selector = `${selector}, input[type="radio"]`
  }

  const elements = Array.from(container.querySelectorAll(selector)) as HTMLElement[]

  const matchingElements = elements.filter(element => {
    if (options.name) {
      const accessibleName =
        element.getAttribute('aria-label') ||
        element.textContent?.trim() ||
        element.getAttribute('placeholder') ||
        element.getAttribute('alt') ||
        element.getAttribute('title') ||
        ''

      return accessibleName.includes(options.name)
    }

    return true
  })

  if (matchingElements.length > 1) {
    console.info(
      `Found ${matchingElements.length} elements with role "${role}". Using index ${index}.`
    )
  } else if (matchingElements.length === 0) {
    console.warn(`No elements found with role "${role}"`)
    return null
  }

  if (!matchingElements[index]) {
    console.warn(
      `Requested role element index ${index} out of bounds (0-${
        matchingElements.length - 1
      })`
    )
    return matchingElements[0]
  }

  return matchingElements[index]
}

/**
 * Get element by data-testid attribute
 * @param container Parent container to search within
 * @param testId Test ID to find
 * @param index Index of the element to use when multiple are found (0-based)
 * @returns Element with the test ID, or null if not found
 */
export function getByTestId(
  container = document.body,
  testId: string,
  index = 0
): HTMLElement | null {
  const elements = Array.from(
    container.querySelectorAll(`[data-testid="${testId}"]`)
  ) as HTMLElement[]

  if (elements.length === 0) {
    console.warn(`No element found with data-testid="${testId}"`)
    return null
  }

  if (elements.length > 1) {
    console.info(
      `Found ${elements.length} elements with data-testid="${testId}". Using index ${index}.`
    )
  }

  if (!elements[index]) {
    console.warn(
      `Requested testId element index ${index} out of bounds (0-${elements.length - 1})`
    )
    return elements[0]
  }

  return elements[index]
}

/**
 * Get element by any query type
 * @param container Parent container to search within
 * @param selector The selector string
 * @param queryType Type of query (role, label, text, testId, css)
 * @param queryOptions Additional options for the query
 * @returns Matching element or null
 */
export function getElementByQuery(
  container: HTMLElement = document.body,
  selector: string,
  queryType: QueryType = 'css',
  queryOptions: QueryOptions = {}
): HTMLElement | null {
  try {
    let element: HTMLElement | null = null
    const index = queryOptions.index || 0

    switch (queryType) {
      case 'role':
        element = getByRole(container, selector, queryOptions)
        break
      case 'label':
        element = getByLabel(container, selector, queryOptions.exact !== false, index)
        break
      case 'text':
        element = getByText(container, selector, queryOptions.exact !== false, index)
        break
      case 'testId':
        element = getByTestId(container, selector, index)
        break
      case 'css':
      default:
        if (index > 0) {
          const elements = container.querySelectorAll(selector)
          element = (elements[index] as HTMLElement) || null
        } else {
          element = container.querySelector(selector) as HTMLElement | null
        }
        break
    }

    if (element && element.tagName === 'LABEL') {
      const input = element.querySelector('input, select, textarea')
      if (input) {
        console.info(`Found label element, returning nested input element instead`)
        return input as HTMLElement
      }
    }

    return element
  } catch (error) {
    console.error(`Error finding element with ${queryType}="${selector}":`, error)
    return null
  }
}

/**
 * Get all elements matching a query
 * @param container Parent container to search within
 * @param selector The selector string
 * @param queryType Type of query (role, label, text, testId, css)
 * @param queryOptions Additional options for the query
 * @returns Array of matching elements
 */
export function getAllElementsByQuery(
  container: HTMLElement = document.body,
  selector: string,
  queryType: QueryType = 'css',
  queryOptions: QueryOptions = {}
): HTMLElement[] {
  try {
    // This would need custom implementations for each query type to return all matches
    // For now, we'll use a simplified approach for the CSS case
    if (queryType === 'css') {
      return Array.from(container.querySelectorAll(selector)) as HTMLElement[]
    }

    // For other query types, get the first element and return as array
    const element = getElementByQuery(container, selector, queryType, queryOptions)
    return element ? [element] : []
  } catch (error) {
    console.error(`Error finding elements with ${queryType}="${selector}":`, error)
    return []
  }
}

/**
 * Helper function to create a role-based selector
 */
export function getByRoleSelector(
  role: string,
  options: QueryOptions = {},
  actionType: ActionType = 'input',
  data: string | number = '',
  dataType: DataGeneratorType = 'static',
  dataGenerator?: string
) {
  return {
    selector: role,
    type: actionType,
    queryType: 'role' as QueryType,
    queryOptions: options,
    data,
    dataType,
    dataGenerator
  }
}

/**
 * Helper function to create a label-based selector
 */
export function getByLabelSelector(
  labelText: string,
  options: QueryOptions = {},
  actionType: ActionType = 'input',
  data: string | number = '',
  dataType: DataGeneratorType = 'static',
  dataGenerator?: string
) {
  return {
    selector: labelText,
    type: actionType,
    queryType: 'label' as QueryType,
    queryOptions: options,
    data,
    dataType,
    dataGenerator
  }
}

/**
 * Helper function to create a text-based selector
 */
export function getByTextSelector(
  text: string,
  options: QueryOptions = {},
  actionType: ActionType = 'simpleClick'
) {
  return {
    selector: text,
    type: actionType,
    queryType: 'text' as QueryType,
    queryOptions: options
  }
}

/**
 * Helper function to create a testId-based selector
 */
export function getByTestIdSelector(
  testId: string,
  actionType: ActionType = 'input',
  data: string | number = '',
  dataType: DataGeneratorType = 'static',
  dataGenerator?: string
) {
  return {
    selector: testId,
    type: actionType,
    queryType: 'testId' as QueryType,
    data,
    dataType,
    dataGenerator
  }
}
