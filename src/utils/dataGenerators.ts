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

/**
 * This file contains all data generators available in the global scope
 * for the fillForm function and JSON selectors.
 *
 * They are defined on the window object to allow them to be called dynamically
 * in formFiller.ts using the notation dataGenerator: "generatePolishMobile:48"
 */

// Basic data generators
window.generateRandomName = function () {
  const names = ['Anna', 'Jan', 'Maria', 'Piotr', 'Katarzyna', 'Tomasz']
  return names[Math.floor(Math.random() * names.length)]
}

window.generateRandomLastName = function () {
  const names = ['Kowalski', 'Nowak', 'Wiśniewska', 'Wójcik', 'Kowalczyk', 'Kamińska']
  return names[Math.floor(Math.random() * names.length)]
}

window.generateRandomEmail = function () {
  return `test${Date.now()}@example.com`
}

window.generatePolishMobile = function (prefix?: number) {
  // Use the proper Polish mobile number generator
  if (prefix) {
    return String(prefix) + generatePolishMobileCore().substring(2)
  }
  return generatePolishMobileCore()
}

window.generateMortagePeriod = function (min = 5, max = 35) {
  return String(Math.floor(Number(min) + Math.random() * (Number(max) - Number(min) + 1)))
}

window.generateIncomeAmount = function (min = 3000, max = 10000) {
  return String(Math.floor(Number(min) + Math.random() * (Number(max) - Number(min) + 1)))
}

// Removing generateHouseholdExpenses as it's just a simple number generator

window.generateYearOfBirth = function (min = 1940, max = 1990) {
  return String(Math.floor(Number(min) + Math.random() * (Number(max) - Number(min) + 1)))
}

// Generic number generator
window.generateRandomNumber = function (min = 1, max = 100) {
  return String(Math.floor(Number(min) + Math.random() * (Number(max) - Number(min) + 1)))
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

// Global interface for TypeScript
declare global {
  interface Window {
    // Basic data generators
    generateRandomName: () => string
    generateRandomLastName: () => string
    generateRandomEmail: () => string
    generatePolishMobile: (prefix?: number) => string
    generateMortagePeriod: (min?: number, max?: number) => string
    generateIncomeAmount: (min?: number, max?: number) => string
    generateRandomNumber: (min?: number, max?: number) => string
    generateYearOfBirth: (min?: number, max?: number) => string

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
  }
}
export {}
