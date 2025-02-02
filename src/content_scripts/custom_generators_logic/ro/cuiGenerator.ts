import {generateRandomInt, addLeadingZeros} from '../../../utils/helpers'
import {CuiOptions} from './types'

// CUI/CIF structure: RO XXXXXXXX(C)
// RO - Optional prefix for VAT payers
// XXXXXXXX - 2-8 digit sequence
// C - Control digit

const CUI_CONTROL_CONSTANTS = [7, 5, 3, 2, 1, 7, 5, 3, 2]

const controlDigit = (cuiWithoutControl: string): string => {
  const paddedNumber = cuiWithoutControl.padStart(9, '0')

  const sum = [...paddedNumber].reduce((acc, digit, index) => {
    return acc + parseInt(digit) * CUI_CONTROL_CONSTANTS[index]
  }, 0)

  const control = ((sum * 10) % 11) % 10
  return control.toString()
}

export const generateCui = (options: CuiOptions = {}): string => {
  const sequence = generateRandomInt(1, 99999999)
  const sequenceStr = addLeadingZeros(sequence, 8)

  const control = controlDigit(sequenceStr)
  const cui = `${sequenceStr}${control}`

  // Add RO prefix for VAT payers if specified
  return options.isVatPayer ? `RO${cui}` : cui
}
