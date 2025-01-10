export const generateRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const addLeadingZeros = (intiger: number, numberOfZeros: number): string =>
  (intiger + '').padStart(numberOfZeros, '0')

export const randomArrayElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

export const genDataOnElement = (
  fnName: string | (() => string),
  el: HTMLElement
): void => {
  el.innerHTML = typeof fnName === 'string' ? fnName : fnName()
}

export const getRandomKey = <T extends object>(object: T): keyof T => {
  const keys = Object.keys(object) as Array<keyof T>
  return keys[Math.floor(Math.random() * keys.length)]
}

/**
 * Sets a value on an HTML input element, triggering any associated setters
 * This is useful when dealing with elements that have custom value setters
 * or when normal value assignment doesn't trigger necessary events
 *
 * @param el - The HTML element to set the value on
 * @param insertedValue - The value to set
 * @throws {Error} If the element doesn't have a value setter
 *
 * @example
 * ```ts
 * const input = document.querySelector('input') as HTMLInputElement
 * setNativeValue(input, 'new value')
 * ```
 */
export const setNativeValue = (el: HTMLElement, insertedValue: string): void => {
  const {set: valueSetter} = Object.getOwnPropertyDescriptor(el, 'value') || {}
  const prototype = Object.getPrototypeOf(el)
  const {set: prototypeValueSetter} =
    Object.getOwnPropertyDescriptor(prototype, 'value') || {}

  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(el, insertedValue)
  } else if (valueSetter) {
    valueSetter.call(el, insertedValue)
  } else {
    throw new Error("Provided element doesn't have a value setter")
  }
}

/**
 * Generates a random birth date within specified age range
 * The date is returned in ISO format (YYYY-MM-DD)
 *
 * @param minAge - Minimum age for generated date (default: 18)
 * @param maxAge - Maximum age for generated date (default: 100)
 * @returns ISO formatted date string
 *
 * @example
 * ```ts
 * // Generate birth date for someone between 20 and 30 years old
 * const birthDate = generateRandomBirthDate(20, 30)
 * console.log(birthDate) // e.g. "1995-03-15"
 * ```
 */
export const generateRandomBirthDate = (minAge = 18, maxAge = 100): string => {
  const today = new Date()

  const maxBirthDate = new Date(
    today.getFullYear() - minAge,
    today.getMonth(),
    today.getDay()
  )

  const minBirthDate = new Date(
    today.getFullYear() - maxAge,
    today.getMonth(),
    today.getDate()
  )

  const getRandomTimestamp =
    minBirthDate.getTime() +
    Math.random() * (maxBirthDate.getTime() - minBirthDate.getTime())
  const randomBirthDate = new Date(getRandomTimestamp)
  return randomBirthDate.toISOString().split('T')[0]
}
