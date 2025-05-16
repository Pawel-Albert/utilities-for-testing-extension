import {QueryType, QueryOptions} from '../types/enhancedSelectors'
import {ActionType, DataGeneratorType} from '../types/formFiller'

// Role mapping from HTML elements to ARIA roles
const roleMapping: Record<string, string | Record<string, string>> = {
  input: {
    default: 'textbox',
    checkbox: 'checkbox',
    radio: 'radio',
    button: 'button',
    submit: 'button',
    reset: 'button',
    image: 'button',
    color: 'textbox',
    date: 'textbox',
    'datetime-local': 'textbox',
    email: 'textbox',
    file: 'textbox',
    hidden: 'textbox',
    month: 'textbox',
    number: 'spinbutton',
    password: 'textbox',
    range: 'slider',
    search: 'searchbox',
    tel: 'textbox',
    text: 'textbox',
    time: 'textbox',
    url: 'textbox',
    week: 'textbox'
  },
  select: 'combobox',
  textarea: 'textbox',
  button: 'button',
  a: 'link'
}

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
  console.debug(`Looking for element with role "${role}" and options:`, options)

  const elements = Array.from(container.querySelectorAll('*')).filter(el => {
    const explicitRole = el.getAttribute('role')
    if (explicitRole === role) return true

    const tagName = el.tagName.toLowerCase()

    if (tagName === 'input') {
      const inputType = (el as HTMLInputElement).type || 'text'
      const inputMapping = roleMapping.input as Record<string, string>
      const inputRole = inputMapping[inputType] || inputMapping.default
      return inputRole === role
    }

    const implicitRole = roleMapping[tagName]
    if (typeof implicitRole === 'string') {
      return implicitRole === role
    } else if (implicitRole && typeof implicitRole === 'object') {
      return (implicitRole as Record<string, string>).default === role
    }

    return false
  })

  if (elements.length === 0) {
    console.debug(`No elements found with role "${role}"`)
    return null
  }

  const filtered = elements.filter(el => {
    for (const [key, value] of Object.entries(options)) {
      if (key === 'name' && value) {
        const accessibleName = getAccessibleName(el as HTMLElement)
        const nameMatches =
          options.exact === false
            ? accessibleName.toLowerCase().includes(String(value).toLowerCase())
            : accessibleName.toLowerCase() === String(value).toLowerCase()

        if (!nameMatches) return false
      }
    }
    return true
  })

  if (filtered.length === 0) {
    console.debug(`No elements found with role "${role}" and name "${options.name}"`)
    return null
  }

  const index = options.index !== undefined ? options.index : 0
  if (filtered.length > 1) {
    console.info(
      `Found ${filtered.length} elements with role "${role}" and name "${options.name}". Using index ${index}.`
    )
  }

  return (filtered[index] as HTMLElement) || null
}

/**
 * Gets the accessible name of an element using multiple methods
 * Following the accessible name calculation algorithm
 */
function getAccessibleName(element: HTMLElement): string {
  const ariaLabel = element.getAttribute('aria-label')
  if (ariaLabel) return ariaLabel.trim()

  const ariaLabelledBy = element.getAttribute('aria-labelledby')
  if (ariaLabelledBy) {
    const labelElements = ariaLabelledBy
      .split(' ')
      .map(id => document.getElementById(id))
      .filter(Boolean)

    if (labelElements.length) {
      return labelElements
        .map(el => el!.textContent || '')
        .join(' ')
        .trim()
    }
  }

  if (element.id) {
    const labels = document.querySelectorAll(`label[for="${element.id}"]`)
    if (labels.length) {
      return Array.from(labels)
        .map(label => label.textContent || '')
        .join(' ')
        .trim()
    }
  }

  const parentLabel = element.closest('label')
  if (parentLabel) {
    const clone = parentLabel.cloneNode(true) as HTMLElement
    const elementsToRemove = clone.querySelectorAll('input, select, textarea')
    elementsToRemove.forEach(el => el.parentNode?.removeChild(el))
    return clone.textContent?.trim() || ''
  }

  const placeholder = element.getAttribute('placeholder')
  if (placeholder) return placeholder.trim()

  if (element.title) return element.title.trim()

  if (
    element.tagName.toLowerCase() === 'button' ||
    element.tagName.toLowerCase() === 'a'
  ) {
    return element.textContent?.trim() || ''
  }

  return element.textContent?.trim() || ''
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

/**
 * Diagnostic function to help debug role selectors
 * Logs all elements with their roles and accessible names
 */
export function diagnosticLogAllElementsWithRoles(container = document.body): void {
  console.group('Diagnostic: All Elements with Roles')

  const elements = Array.from(container.querySelectorAll('*'))

  elements.forEach(el => {
    const tagName = el.tagName.toLowerCase()
    const id = el.id ? `#${el.id}` : ''
    const explicitRole = el.getAttribute('role')

    let type = ''
    if (tagName === 'input') {
      type = (el as HTMLInputElement).type || 'text'
    }

    const accessibleName = getAccessibleName(el as HTMLElement)

    let implicitRole = ''
    if (tagName === 'input') {
      const inputMapping = roleMapping.input as Record<string, string>
      implicitRole = inputMapping[type] || inputMapping.default
    } else {
      const mapping = roleMapping[tagName]
      if (typeof mapping === 'string') {
        implicitRole = mapping
      } else if (mapping && typeof mapping === 'object') {
        implicitRole = (mapping as Record<string, string>).default
      }
    }

    const effectiveRole = explicitRole || implicitRole || 'none'

    if (effectiveRole !== 'none' || accessibleName) {
      console.log({
        element: `${tagName}${id}${type ? `[type="${type}"]` : ''}`,
        explicitRole,
        implicitRole,
        effectiveRole,
        accessibleName
      })
    }
  })

  console.groupEnd()
}
