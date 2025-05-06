import {faker} from '@faker-js/faker'
import {generatePesel} from '../content_scripts/custom_generators_logic/pesel_core'
import {generateNip} from '../content_scripts/custom_generators_logic/nip_core'
import {generateRegon} from '../content_scripts/custom_generators_logic/regon_core'
import {generateIban} from '../content_scripts/custom_generators_logic/iban_core'
import {generateIdNumber} from '../content_scripts/custom_generators_logic/idnumber_core'
import {generatePassportNumber} from '../content_scripts/custom_generators_logic/passport_number_core'
import {generateCnp} from '../content_scripts/custom_generators_logic/ro/cnpGenerator'
import {generateCui} from '../content_scripts/custom_generators_logic/ro/cuiGenerator'
import {generateRoPhone} from '../content_scripts/custom_generators_logic/ro/phoneGenerator'
import {generatePolishMobile as generatePolishMobileCore} from '../content_scripts/custom_generators_logic/generatePolishMobile'
import {generateRandomInt} from '../content_scripts/custom_generators_logic/randomInt_core'
import {generateLicensePlate} from '../content_scripts/custom_generators_logic/licensePlate_core'

/**
 * This file contains all data generators available in the global scope
 * for the fillForm function and JSON selectors.
 *
 * They are defined on the window object to allow them to be called dynamically
 * in formFiller.ts using the notation dataGenerator: "generatePolishMobile:48"
 */

// Set default locale - can be changed dynamically
faker.setLocale('pl')

// Function to get localized faker instance
window.fakerLocalized = function (locale = 'pl') {
  try {
    // Save current locale
    const originalLocale = faker.locale

    // Try to set the requested locale
    faker.setLocale(locale)

    // Schedule restore of original locale after this execution context
    setTimeout(() => {
      faker.setLocale(originalLocale)
    }, 0)

    return faker
  } catch (error) {
    console.warn(`Locale ${locale} not available, falling back to default locale`, error)
    return faker
  }
}

window.generateRandomEmail = function () {
  return `test${Date.now()}@example.com`
}

window.generatePolishMobile = function (prefix?: number) {
  if (prefix) {
    return String(prefix) + generatePolishMobileCore().substring(2)
  }
  return generatePolishMobileCore()
}

// Document generators - PL
window.generatePeselMale = function (minAge = 18, maxAge = 65) {
  return generatePesel('male', {minAge, maxAge})
}

window.generatePeselFemale = function (minAge = 18, maxAge = 65) {
  return generatePesel('female', {minAge, maxAge})
}

window.generatePesel = function (minAge = 18, maxAge = 65) {
  return generatePesel('both', {minAge, maxAge})
}

window.generateNip = function () {
  return generateNip()
}

window.generateRegon = function () {
  return generateRegon()
}

window.generateIban = function () {
  return generateIban()
}

window.generateIdNumber = function () {
  return generateIdNumber()
}

window.generatePassportNumber = function () {
  return generatePassportNumber()
}

// Document generators - RO
window.generateCnpMale = function (minAge = 18, maxAge = 65) {
  return generateCnp('male', {minAge, maxAge})
}

window.generateCnpFemale = function (minAge = 18, maxAge = 65) {
  return generateCnp('female', {minAge, maxAge})
}

window.generateCui = function (isVatPayer = false) {
  return generateCui({isVatPayer: Boolean(isVatPayer)})
}

window.generateRoPhone = function (internationalFormat = false) {
  return generateRoPhone({internationalFormat: Boolean(internationalFormat)})
}

// Generic generators
window.generateRandomDate = function (minAge = 18, maxAge = 60) {
  const today = new Date()
  const minYear = today.getFullYear() - maxAge
  const maxYear = today.getFullYear() - minAge

  const year = Math.floor(minYear + Math.random() * (maxYear - minYear + 1))
  const month = Math.floor(1 + Math.random() * 11)
  const day = Math.floor(1 + Math.random() * 28)

  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

// Generic function for using faker with safe locale handling
function useLocale(callback: (localFaker: typeof faker) => any, locale?: string): any {
  if (!locale) return callback(faker)

  // Save current locale
  const originalLocale = faker.locale

  try {
    // Try to set the requested locale
    faker.setLocale(locale)
    return callback(faker)
  } catch (error) {
    console.warn(
      `Locale ${locale} not supported in Faker, falling back to ${originalLocale}`,
      error
    )
    return callback(faker)
  } finally {
    // Always restore original locale
    faker.setLocale(originalLocale)
  }
}

// Faker-based generators with optional locale parameter
window.fakerFirstName = function (locale?: string) {
  return useLocale(f => f.name.firstName(), locale)
}

window.fakerLastName = function (locale?: string) {
  return useLocale(f => f.name.lastName(), locale)
}

window.fakerFullName = function (locale?: string) {
  return useLocale(f => f.name.fullName(), locale)
}

window.fakerEmail = function (locale?: string) {
  return useLocale(f => f.internet.email(), locale)
}

window.fakerCompanyName = function (locale?: string) {
  return useLocale(f => f.company.name(), locale)
}

window.fakerStreetName = function (locale?: string) {
  return useLocale(f => f.address.street(), locale)
}

window.fakerBuildingNumber = function (locale?: string) {
  return useLocale(f => f.address.buildingNumber(), locale)
}

window.fakerZipCode = function (format?: string, locale?: string) {
  return useLocale(
    f => (format ? f.address.zipCode(format) : f.address.zipCode('##-###')),
    locale
  )
}

window.fakerCity = function (locale?: string) {
  return useLocale(f => f.address.city(), locale)
}

window.fakerPhoneNumber = function (format?: string, locale?: string) {
  return useLocale(f => (format ? f.phone.number(format) : f.phone.number()), locale)
}

window.fakerJobTitle = function (locale?: string) {
  return useLocale(f => f.name.jobTitle(), locale)
}

window.fakerCompanyDescription = function (locale?: string) {
  return useLocale(f => f.company.catchPhrase(), locale)
}

window.fakerIban = function (locale?: string) {
  return useLocale(f => f.finance.iban(), locale)
}

// Advanced direct access to faker
/**
 * Direct access to any Faker.js function using dot notation path
 * @param path - Dot notation path to Faker function (e.g., 'commerce.product', 'date.month')
 * @param locale - Optional locale to use (e.g., 'en', 'de', 'fr')
 * @param args - Optional arguments to pass to the Faker function
 *
 * Examples:
 * - fakerRaw:commerce.product:en - random product name in English
 * - fakerRaw:date.month:de - month name in German
 * - fakerRaw:finance.amount:pl:0:100:2 - amount between 0-100 with 2 decimal places in Polish format
 * - fakerRaw:lorem.paragraph:en:5 - 5 sentences of lorem ipsum in English
 */
window.fakerRaw = function (path: string, locale?: string, ...args: any[]) {
  return useLocale(localFaker => {
    try {
      // Split path by dots and access nested properties
      const parts = path.split('.')
      let current: any = localFaker

      // Navigate through the path
      for (const part of parts) {
        if (current[part] === undefined) {
          throw new Error(`Part "${part}" not found in faker path: ${path}`)
        }
        current = current[part]
      }

      // Check if we found a function
      if (typeof current !== 'function') {
        throw new Error(`Found ${typeof current} instead of function at path: ${path}`)
      }

      // Call the function with provided arguments
      return current(...args)
    } catch (error) {
      console.error(`Error using fakerRaw with path "${path}":`, error)
      return `Error: ${(error as Error).message}`
    }
  }, locale)
}

/**
 * Generates a random integer within the specified range.
 * @param min - Minimum value (inclusive, default: 1)
 * @param max - Maximum value (inclusive, default: 1000)
 * @returns Random integer between min and max (inclusive)
 *
 * Examples:
 * - fakerRandomInt - random number between 1 and 1000
 * - fakerRandomInt:1:100 - random number between 1 and 100
 */
window.fakerRandomInt = function (min: number = 1, max: number = 1000) {
  // Use our core implementation for the random integer generation
  return generateRandomInt(min, max)
}

/**
 * Generates a vehicle license plate number.
 * @param country - Country code for license plate format (default: 'pl')
 * @param locale - Optional locale to use for faker
 * @returns License plate number in the specified country format
 *
 * Supported countries:
 * - 'pl' - Poland: Format 'XX NNNNN' or 'XXX NNNNN' where X=letter, N=digit
 * - 'de' - Germany: Format 'XX XX NNN' where X=letter, N=digit
 * - 'uk' - United Kingdom: Format 'XX NN XXX' where X=letter, N=digit
 * - 'us' - United States: Format 'XXX NNNN' (varies by state, simplified format)
 * - 'ro' - Romania: Format 'XX NN XXX' where X=letter, N=digit
 *
 * Examples:
 * - fakerLicensePlate - Polish license plate (default)
 * - fakerLicensePlate:de - German license plate
 * - fakerLicensePlate:uk:en - UK license plate with English locale
 */
window.fakerLicensePlate = function (country: string = 'pl', locale?: string) {
  return useLocale(localFaker => {
    // Try to use Faker's built-in vehicle.licensePlate function if available
    try {
      if (
        localFaker['vehicle'] &&
        typeof (localFaker['vehicle'] as any)['licensePlate'] === 'function'
      ) {
        return (localFaker['vehicle'] as any)['licensePlate'](country)
      }
    } catch (error) {
      console.warn(`Error using faker.vehicle.licensePlate: ${error}`)
    }

    // Use our core implementation as a fallback
    return generateLicensePlate(country)
  }, locale)
}

// Global interface for TypeScript
declare global {
  interface Window {
    // Basic data generators
    generateRandomEmail: () => string
    generatePolishMobile: (prefix?: number) => string

    // Document generators - PL
    generatePeselMale: (minAge?: number, maxAge?: number) => string
    generatePeselFemale: (minAge?: number, maxAge?: number) => string
    generatePesel: (minAge?: number, maxAge?: number) => string
    generateNip: () => string
    generateRegon: () => string
    generateIban: () => string
    generateIdNumber: () => string
    generatePassportNumber: () => string

    // Document generators - RO
    generateCnpMale: (minAge?: number, maxAge?: number) => string
    generateCnpFemale: (minAge?: number, maxAge?: number) => string
    generateCui: (isVatPayer?: boolean) => string
    generateRoPhone: (internationalFormat?: boolean) => string

    // Generic generators
    generateRandomDate: (minAge?: number, maxAge?: number) => string
    fakerRandomInt: (min?: number, max?: number, locale?: string) => number
    fakerLicensePlate: (country?: string, locale?: string) => string

    // Faker-based generators
    fakerFirstName: (locale?: string) => string
    fakerLastName: (locale?: string) => string
    fakerFullName: (locale?: string) => string
    fakerEmail: (locale?: string) => string
    fakerCompanyName: (locale?: string) => string
    fakerStreetName: (locale?: string) => string
    fakerBuildingNumber: (locale?: string) => string
    fakerZipCode: (format?: string, locale?: string) => string
    fakerCity: (locale?: string) => string
    fakerPhoneNumber: (format?: string, locale?: string) => string
    fakerJobTitle: (locale?: string) => string
    fakerCompanyDescription: (locale?: string) => string
    fakerIban: (locale?: string) => string

    // Advanced faker access
    fakerLocalized: (locale?: string) => typeof faker
    fakerRaw: (path: string, locale?: string, ...args: any[]) => any
  }
}
export {}
