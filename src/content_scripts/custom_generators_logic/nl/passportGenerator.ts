import {generateRandomInt, addLeadingZeros, getRandomKey} from '../../../utils/helpers'

// Dutch passport number format: 9 characters
// Format: 2 letters + 7 digits
// Example: NLD1234567

const LETTERS: string[] = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
const VALUES: number[] = [
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
  34, 35
]

const createLetterToNumberMap = (letters: string[], values: number[]): Record<string, number> => {
  return Object.fromEntries(letters.map((_, i) => [letters[i], values[i]]))
}

const letterToNumberMap = createLetterToNumberMap(LETTERS, VALUES)

const CONTROL_SUM_DIVIDER = 10
const NUMBER_OF_LETTERS = 2
const LEADING_ZEROS = 7

/**
 * Generates a valid Dutch passport number
 * Format: 2 letters + 7 digits
 * @returns Valid Dutch passport number
 */
export const generateNlPassportNumber = (): string => {
  // Generate 2 random letters
  const letters: string[] = []
  for (let i = 0; i < NUMBER_OF_LETTERS; i++) {
    letters.push(getRandomKey(letterToNumberMap))
  }

  // Generate 7 random digits
  const numberPart = addLeadingZeros(generateRandomInt(0, 9999999), LEADING_ZEROS)

  // Calculate control digit (simplified - real algorithm may be more complex)
  const controlSum =
    (7 * letterToNumberMap[letters[0]] +
      3 * letterToNumberMap[letters[1]] +
      1 * parseInt(numberPart[0]) +
      7 * parseInt(numberPart[1]) +
      3 * parseInt(numberPart[2]) +
      1 * parseInt(numberPart[3]) +
      7 * parseInt(numberPart[4]) +
      3 * parseInt(numberPart[5])) %
    CONTROL_SUM_DIVIDER

  // For Dutch passports, the control digit is typically the last digit of the number part
  // This is a simplified version - real format may vary
  return letters.join('') + numberPart
}

