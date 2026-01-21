import {generateRandomInt, addLeadingZeros} from '../../../utils/helpers'

// Dutch debtor number (debiteurennummer) format can vary
// Common formats:
// - 8 digits
// - 9 digits
// - Alphanumeric (letters + digits)
// This generator creates a common 8-9 digit format

const DEBTOR_NUMBER_LENGTH = 9 // Common length for Dutch debtor numbers

/**
 * Generates a valid Dutch debtor number (debiteurennummer)
 * Format: 8-9 digits (most common)
 * @returns Valid Dutch debtor number
 */
export const generateNlDebtorNumber = (): string => {
  // Generate 8-9 digit number (most common format)
  const debtorNumber = addLeadingZeros(
    generateRandomInt(1, Math.pow(10, DEBTOR_NUMBER_LENGTH) - 1),
    DEBTOR_NUMBER_LENGTH
  )

  return debtorNumber
}

