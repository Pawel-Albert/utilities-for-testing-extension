import {
  generateRandomInt,
  addLeadingZeros,
  randomArrayElement
} from '../../../utils/helpers'
import {NlIbanOptions} from '../../../../types'

// Dutch IBAN structure: NL + 2 check digits + 4 letter bank code + 10 digit account number
// Total: 18 characters
// Example: NL91ABNA0417164300

// Major Dutch bank codes (BIC codes first 4 letters)
const DUTCH_BANK_CODES = [
  'ABNA', // ABN AMRO
  'INGB', // ING Bank
  'RABO', // Rabobank
  'SNSB', // SNS Bank
  'ASNB', // ASN Bank
  'BUNQ', // Bunq
  'KNAB', // Knab
  'TRBK', // Triodos Bank
  'FVLB', // Van Lanschot
  'DEUT', // Deutsche Bank Nederland
  'HSBC', // HSBC Bank
  'NWAB', // NIBC Bank
  'RBRB', // Regiobank
  'BICK', // BinckBank
  'COBA', // Commerzbank
  'UGBI', // UBS
  'BKCH', // Bank of China
  'BKID', // Bank Indonesia
  'BKJP', // Bank of Japan
  'BKUS', // Bank of America
  'CITI', // Citibank
  'JPMO', // JPMorgan Chase
  'WELA', // Wells Fargo
  'BOFA', // Bank of America
  'CHAS', // Chase Bank
  'PNBP', // PNB Paribas
  'SOCI', // Societe Generale
  'BNPA', // BNP Paribas
  'CRLY', // Credit Lyonnais
  'DEUT', // Deutsche Bank
  'COMM', // Commerzbank
  'UBSW', // UBS
  'CSCH', // Credit Suisse
  'ZKBK', // Zurcher Kantonalbank
  'BCIT', // Intesa Sanpaolo
  'UNCR', // UniCredit
  'BARC', // Barclays
  'HSBC', // HSBC
  'LLOY', // Lloyds Bank
  'NWBK', // NatWest
  'RBSB', // Royal Bank of Scotland
  'SCBL', // Standard Chartered
  'ANZB', // ANZ Bank
  'WBCM', // Westpac
  'CIBC', // CIBC
  'ROYC', // Royal Bank of Canada
  'TDOM', // TD Bank
  'BKCH', // Bank of China
  'ICBK', // Industrial and Commercial Bank of China
  'ABOC', // Agricultural Bank of China
  'BKID', // Bank Indonesia
  'BKJP', // Bank of Japan
  'BKUS', // Bank of America
  'CITI', // Citibank
  'JPMO', // JPMorgan Chase
  'WELA', // Wells Fargo
  'BOFA', // Bank of America
  'CHAS', // Chase Bank
  'PNBP', // PNB Paribas
  'SOCI', // Societe Generale
  'BNPA', // BNP Paribas
  'CRLY', // Credit Lyonnais
  'DEUT', // Deutsche Bank
  'COMM', // Commerzbank
  'UBSW', // UBS
  'CSCH', // Credit Suisse
  'ZKBK', // Zurcher Kantonalbank
  'BCIT', // Intesa Sanpaolo
  'UNCR', // UniCredit
  'BARC', // Barclays
  'HSBC', // HSBC
  'LLOY', // Lloyds Bank
  'NWBK', // NatWest
  'RBSB', // Royal Bank of Scotland
  'SCBL', // Standard Chartered
  'ANZB', // ANZ Bank
  'WBCM', // Westpac
  'CIBC', // CIBC
  'ROYC', // Royal Bank of Canada
  'TDOM' // TD Bank
]

const ACCOUNT_NUMBER_LENGTH = 10
const COUNTRY_CODE = 'NL'
const COUNTRY_CODE_NUMERIC = '2328' // NL = 23 (N), 28 (L) in IBAN calculation

/**
 * Converts letters to numbers for IBAN calculation
 * A=10, B=11, ..., Z=35
 */
const letterToNumber = (letter: string): string => {
  const charCode = letter.charCodeAt(0)
  return (charCode - 55).toString() // A=65, so 65-55=10
}

/**
 * Calculates IBAN check digits
 * Algorithm:
 * 1. Create IBAN with "00" as check digits: NL00 + bankCode + accountNumber
 * 2. Move first 4 chars (NL00) to end: bankCode + accountNumber + NL00
 * 3. Convert letters to numbers (A=10, B=11, ..., Z=35)
 * 4. Calculate modulo 97 using chunking (same approach as Polish IBAN)
 * 5. Check digits = 98 - remainder (result should make final IBAN mod 97 = 1)
 * @param bankCode - 4-letter bank code
 * @param accountNumber - 10-digit account number
 * @returns 2-digit check number
 */
const calculateIbanCheckDigits = (bankCode: string, accountNumber: string): string => {
  // Step 1: Create IBAN with "00" as placeholder check digits
  const ibanWithPlaceholder = COUNTRY_CODE + '00' + bankCode + accountNumber

  // Step 2: Move first 4 characters (NL00) to the end
  const rearranged =
    ibanWithPlaceholder.substring(4) + ibanWithPlaceholder.substring(0, 4)
  // Result: bankCode + accountNumber + NL00

  // Step 3: Convert letters to numbers (A=10, B=11, ..., Z=35)
  let numericString = ''
  for (const char of rearranged) {
    if (char >= '0' && char <= '9') {
      numericString += char
    } else if (char >= 'A' && char <= 'Z') {
      numericString += letterToNumber(char)
    }
  }

  // Step 4: Calculate modulo 97 using chunking (same approach as Polish IBAN)
  // Process in chunks of 7 digits to avoid overflow
  let controlSum = parseInt(numericString.slice(0, 7))
  for (let i = 7; i < numericString.length; i += 7) {
    const block = numericString.slice(i, i + 7)
    controlSum = parseInt((controlSum % 97) + block)
  }
  const moduloValue = controlSum % 97

  // Step 5: Check digits = 98 - remainder
  // This ensures that when we validate: (numericString with check digits) % 97 === 1
  const checkDigits = 98 - moduloValue
  return checkDigits.toString().padStart(2, '0')
}

/**
 * Generates a valid Dutch IBAN
 * @param options - Options for generation (bankCode)
 * @returns Valid 18-character Dutch IBAN
 */
export const generateNlIban = (options: NlIbanOptions = {}): string => {
  const bankCode = options.bankCode || randomArrayElement(DUTCH_BANK_CODES)
  const accountNumber = addLeadingZeros(
    generateRandomInt(0, 9999999999),
    ACCOUNT_NUMBER_LENGTH
  )
  const checkDigits = calculateIbanCheckDigits(bankCode, accountNumber)

  return `${COUNTRY_CODE}${checkDigits}${bankCode}${accountNumber}`
}
