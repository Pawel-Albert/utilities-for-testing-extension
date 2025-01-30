import {generateRandomInt} from '../../../utils/helpers'
import {RoPhoneOptions} from './types'

// Romanian mobile phone number format: 7xxxxxxxx or +407xxxxxxxx
// Mobile numbers range: 700000000-799999999

/**
 * Validates if the given number is a valid Romanian mobile number
 * @param number Phone number to validate
 * @returns true if valid, false otherwise
 */
export const validateRomanianMobile = (number: string): boolean => {
  const cleanNumber = number.replace(/\s+/g, '') // Remove whitespace
  return /^\+?407[0-9]\d{7}$/.test(cleanNumber)
}

/**
 * Formats a Romanian phone number with proper spacing
 * @param number Phone number to format
 * @returns Formatted number or null if invalid
 */
export const formatRomanianNumber = (number: string): string | null => {
  const cleaned = number.replace(/\D/g, '') // Remove non-digit characters

  // For numbers with country code
  if (cleaned.startsWith('40')) {
    return `+${cleaned.substring(0, 2)} ${cleaned.substring(2, 4)} ${cleaned.substring(
      4,
      7
    )} ${cleaned.substring(7)}`
  }

  // For numbers without country code
  if (cleaned.startsWith('7')) {
    return `0${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(
      5
    )}`
  }

  return null // Invalid format
}

export const generateRoPhone = (options: RoPhoneOptions = {}): string => {

  const number = generateRandomInt(700000000, 799999999)


  return options.internationalFormat ? `+40${number}` : `${number}`
}
