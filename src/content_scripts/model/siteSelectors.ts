import {SiteDataType} from '../../types/formFiller'

/**
 * This file provides the default site data for form filling.
 *
 * To add your custom sites:
 * 1. Go to extension settings > Custom Site Selectors
 * 2. Add your URL pattern and field selectors
 *
 * You can also edit this file directly to add more built-in site data.
 */

/**
 * Returns the built-in site data
 * @returns Object containing site selectors based on URL patterns
 */
export function getBuiltInSiteData(): SiteDataType {
  // Simple example data that will work with the form filler implementation
  return {
    // Example site: Will match example.com and its subdomains
    'example.com': {
      // Standard input fields
      username: {
        selector: 'input[name="username"]',
        type: 'input',
        data: 'testuser123'
      },
      email: {
        selector: 'input[type="email"]',
        type: 'input',
        dataType: 'function',
        dataGenerator: 'generateRandomEmail'
      },
      password: {
        selector: 'input[type="password"]',
        type: 'input',
        data: 'TestPassword123!'
      },
      firstName: {
        selector: 'input[name="firstName"]',
        type: 'input',
        dataType: 'function',
        dataGenerator: 'fakerFirstName'
      },
      lastName: {
        selector: 'input[name="lastName"]',
        type: 'input',
        dataType: 'function',
        dataGenerator: 'fakerLastName'
      },
      // Checkbox example
      terms: {
        selector: 'input[type="checkbox"][name="terms"]',
        type: 'checkCheckbox'
      },
      // Multi-step interaction example
      dropdown: {
        type: 'multiStep',
        selector: '.dropdown', // Reference selector
        timeout: 100,
        steps: [
          {
            selector: '.dropdown-toggle',
            type: 'simpleClick'
          },
          {
            selector: '.dropdown-item',
            type: 'simpleClick',
            index: 1
          }
        ]
      }
    },

    // Multiple domains example (pipe separated)
    'test-app.com|staging.test-app.com': {
      email: {
        selector: '#login-email',
        type: 'input',
        dataType: 'function',
        dataGenerator: 'generateRandomEmail'
      },
      phone: {
        selector: '#phone',
        type: 'input',
        dataType: 'function',
        dataGenerator: 'fakerPhoneNumber'
      }
    }
  }
}

/**
 * Main synchronous function that provides site data.
 * This is the entry point used by the form filler.
 *
 * Field configuration reference:
 * - selector: CSS selector to find elements
 * - type: Action type ("input", "inputShadow", "simpleClick", "dispatchedClick", "checkCheckbox", "multiStep")
 * - data: Static value to use (for static data type)
 * - dataType: "static" (default) or "function"
 * - dataGenerator: Name of function to generate data (e.g., "generateRandomEmail", "fakerFirstName")
 *   - Can include parameters: "fakerFirstName:en" (English locale)
 *   - Multiple parameters: "fakerZipCode:##-###:pl" (format, locale)
 * - index: When multiple elements match a selector, use the element at this index (0-based)
 * - timeout: Delay in milliseconds (for multiStep actions)
 * - steps: Array of step actions for multiStep type
 */
export function getSiteData(): SiteDataType {
  return getBuiltInSiteData()
}
