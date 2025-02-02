import {
  generateRandomInt,
  addLeadingZeros,
  validateAndParseDate,
  generateRandomDate
} from '../../../utils/helpers'
import {Sex, CnpOptions} from './types'

// CNP structure: S AA LL ZZ JJ NNN C
// S - Sex and century (1/2: 1900-1999, 3/4: 1800-1899, 5/6: 2000-2099, 7/8: resident, 9: foreign)
// AA - Year (00-99)
// LL - Month (01-12)
// ZZ - Day (01-31)
// JJ - County code (01-52)
// NNN - Sequence number (001-999)
// C - Control digit

const CNP_CONTROL_CONSTANTS = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9]
const MIN_YEAR = 1800
const MAX_YEAR = 2099

// Romanian county codes (județe)
const COUNTY_CODES = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',
  '51',
  '52'
]

const getSexAndCenturyCode = (year: number, sex: Sex): string => {
  const century = Math.floor(year / 100)
  let baseCode: number

  if (century === 18) baseCode = sex === 'male' ? 3 : 4
  else if (century === 19) baseCode = sex === 'male' ? 1 : 2
  else if (century === 20) baseCode = sex === 'male' ? 5 : 6
  else throw new Error('Unsupported year')

  return baseCode.toString()
}

const getRandomCountyCode = (): string => {
  return COUNTY_CODES[generateRandomInt(0, COUNTY_CODES.length - 1)]
}

const controlDigit = (cnpWithoutControl: string): string => {
  const sum = [...cnpWithoutControl].reduce((acc, digit, index) => {
    return acc + parseInt(digit) * CNP_CONTROL_CONSTANTS[index]
  }, 0)
  const control = sum % 11
  return control === 10 ? '1' : control.toString()
}

export const generateCnp = (sex: Sex, options: CnpOptions = {}): string => {
  let timeStamp: Date
  if (options.birthDate) {
    timeStamp = validateAndParseDate(options.birthDate, MIN_YEAR, MAX_YEAR)
  } else if (options.age) {
    timeStamp = generateRandomDate(options.age, options.age)
  } else {
    timeStamp = generateRandomDate(options.minAge, options.maxAge)
  }

  const year = timeStamp.getFullYear()
  const month = addLeadingZeros(timeStamp.getMonth() + 1, 2)
  const day = addLeadingZeros(timeStamp.getDate(), 2)
  const yearLastTwo = year.toString().slice(-2)

  const sexAndCentury = getSexAndCenturyCode(year, sex)
  const countyCode = options.county || getRandomCountyCode()
  const sequence = addLeadingZeros(generateRandomInt(1, 999), 3)

  const cnpWithoutControl = `${sexAndCentury}${yearLastTwo}${month}${day}${countyCode}${sequence}`
  const control = controlDigit(cnpWithoutControl)

  return cnpWithoutControl + control
}
