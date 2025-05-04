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
import {faker} from '@faker-js/faker'

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
  const originalLocale = faker.locale
  faker.setLocale(locale)

  const result = faker
  setTimeout(() => {
    faker.setLocale(originalLocale)
  }, 0)

  return result
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

// Faker-based generators with optional locale parameter
window.fakerFirstName = function (locale?: string) {
  if (!locale) return faker.name.firstName()

  const originalLocale = faker.locale
  faker.setLocale(locale)
  const result = faker.name.firstName()
  faker.setLocale(originalLocale)
  return result
}

window.fakerLastName = function (locale?: string) {
  if (!locale) return faker.name.lastName()

  const originalLocale = faker.locale
  faker.setLocale(locale)
  const result = faker.name.lastName()
  faker.setLocale(originalLocale)
  return result
}

window.fakerFullName = function (locale?: string) {
  if (!locale) return faker.name.fullName()

  const originalLocale = faker.locale
  faker.setLocale(locale)
  const result = faker.name.fullName()
  faker.setLocale(originalLocale)
  return result
}

window.fakerEmail = function (locale?: string) {
  if (!locale) return faker.internet.email()

  const originalLocale = faker.locale
  faker.setLocale(locale)
  const result = faker.internet.email()
  faker.setLocale(originalLocale)
  return result
}

window.fakerCompanyName = function (locale?: string) {
  if (!locale) return faker.company.name()

  const originalLocale = faker.locale
  faker.setLocale(locale)
  const result = faker.company.name()
  faker.setLocale(originalLocale)
  return result
}

window.fakerStreetName = function (locale?: string) {
  if (!locale) return faker.address.street()

  const originalLocale = faker.locale
  faker.setLocale(locale)
  const result = faker.address.street()
  faker.setLocale(originalLocale)
  return result
}

window.fakerBuildingNumber = function (locale?: string) {
  if (!locale) return faker.address.buildingNumber()

  const originalLocale = faker.locale
  faker.setLocale(locale)
  const result = faker.address.buildingNumber()
  faker.setLocale(originalLocale)
  return result
}

window.fakerZipCode = function (format?: string, locale?: string) {
  if (!locale)
    return format ? faker.address.zipCode(format) : faker.address.zipCode('##-###')

  const originalLocale = faker.locale
  faker.setLocale(locale)
  const result = format ? faker.address.zipCode(format) : faker.address.zipCode('##-###')
  faker.setLocale(originalLocale)
  return result
}

window.fakerCity = function (locale?: string) {
  if (!locale) return faker.address.city()

  const originalLocale = faker.locale
  faker.setLocale(locale)
  const result = faker.address.city()
  faker.setLocale(originalLocale)
  return result
}

window.fakerPhoneNumber = function (format?: string, locale?: string) {
  if (!locale) return format ? faker.phone.number(format) : faker.phone.number()

  const originalLocale = faker.locale
  faker.setLocale(locale)
  const result = format ? faker.phone.number(format) : faker.phone.number()
  faker.setLocale(originalLocale)
  return result
}

window.fakerJobTitle = function (locale?: string) {
  if (!locale) return faker.name.jobTitle()

  const originalLocale = faker.locale
  faker.setLocale(locale)
  const result = faker.name.jobTitle()
  faker.setLocale(originalLocale)
  return result
}

window.fakerCompanyDescription = function (locale?: string) {
  if (!locale) return faker.company.catchPhrase()

  const originalLocale = faker.locale
  faker.setLocale(locale)
  const result = faker.company.catchPhrase()
  faker.setLocale(originalLocale)
  return result
}

window.fakerIban = function (locale?: string) {
  if (!locale) return faker.finance.iban()

  const originalLocale = faker.locale
  faker.setLocale(locale)
  const result = faker.finance.iban()
  faker.setLocale(originalLocale)
  return result
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
  const originalLocale = locale ? faker.locale : null
  if (locale) faker.setLocale(locale)

  try {
    // Split path by dots and access nested properties
    const parts = path.split('.')
    let current: any = faker

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
    const result = current(...args)

    // Reset locale if needed
    if (originalLocale) faker.setLocale(originalLocale)

    return result
  } catch (error) {
    console.error(`Error using fakerRaw with path "${path}":`, error)
    if (originalLocale) faker.setLocale(originalLocale)
    return `Error: ${(error as Error).message}`
  }
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
