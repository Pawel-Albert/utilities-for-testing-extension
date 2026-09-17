import {generateRandomInt, addLeadingZeros} from '../../../utils/helpers'
import {Sex, BsnOptions} from '../../../../types'

// BSN (Burgerservicenummer) structure: 8 or 9 digits
// Control digit is calculated using Modulus 11 algorithm
// BSN cannot start with 0
// Note: BSN does NOT contain date of birth or any personal information

// Weights for BSN calculation
const BSN_WEIGHTS = [9, 8, 7, 6, 5, 4, 3, 2]

/**
 * Calculates weighted sum of digits
 * @param weights - Array of weights
 * @param digits - String of digits (padded to 8 chars)
 * @returns Weighted sum
 */
const weightedSum = (weights: number[], digits: string): number => {
  let sum = 0
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i] * parseInt(digits[i])
  }
  return sum
}

/**
 * Calculates BSN control digit using Modulus 11 algorithm
 * Checksum = (weighted sum of first 8 digits) % 11
 * If checksum is 10, the number is invalid
 * @param bsnWithoutControl - First 8 digits of BSN (padded with leading zeros if needed)
 * @returns Control digit (0-9) or null if invalid (checksum === 10)
 */
const calculateControlDigit = (bsnWithoutControl: string): string | null => {
  // Pad to 8 digits if needed
  const padded = bsnWithoutControl.padStart(8, '0')

  const checksum = weightedSum(BSN_WEIGHTS, padded) % 11

  // If checksum is 10, this combination is invalid
  if (checksum === 10) {
    return null
  }

  return checksum.toString()
}

/**
 * Generates a valid BSN (Burgerservicenummer)
 * BSN is 9 digits, cannot start with 0, last digit is control digit
 * Note: BSN does NOT encode date of birth, sex, or any personal information
 * @param sex - Sex of the person (not used in BSN but kept for consistency)
 * @param options - Options for generation (not used, kept for API consistency)
 * @returns Valid 9-digit BSN that passes the 11-check validation
 */
export const generateBsn = (sex: Sex, options: BsnOptions = {}): string => {
  // BSN doesn't encode sex or date, but we keep parameters for consistency with other generators
  // Generate BSN - first digit cannot be 0
  // Generate 8 digits: first digit 1-9, rest 0-9
  let bsnWithoutControl: string
  let controlDigit: string | null

  // Retry until we get a valid BSN (checksum must be 0-9, not 10)
  do {
    const firstDigit = generateRandomInt(1, 9) // Cannot start with 0
    const remainingDigits = addLeadingZeros(generateRandomInt(0, 9999999), 7)
    bsnWithoutControl = firstDigit + remainingDigits
    controlDigit = calculateControlDigit(bsnWithoutControl)
  } while (controlDigit === null)

  return bsnWithoutControl + controlDigit
}
