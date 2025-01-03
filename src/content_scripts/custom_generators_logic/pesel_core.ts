import {generateRandomInt, addLeadingZeros} from '../../utilis/helpers'

////////////////////////////////////////////////////////////////////////////////////////
//PESEL_CONFIG
////////////////////////////////////////////////////////////////////////////////////////
const LEADING_ZEROS = 3
const PESEL_CONTROL_CONSTANTS: number[] = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]

type PeselOptions = {
  birthDate?: string
  age?: number
  minAge?: number
  maxAge?: number
}

const randomTimeStamp = (minAge = 18, maxAge = 100): Date => {
  const maxBirthDate = new Date(Date.now() - minAge * 31557600000)
  const minBirthDate = new Date(Date.now() - maxAge * 31557600000)
  const minTimestamp = minBirthDate.getTime()
  const maxTimestamp = maxBirthDate.getTime()
  return new Date(generateRandomInt(minTimestamp, maxTimestamp))
}

const dateToTimeStamp = (dateStr: string): Date => {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format')
  }
  return date
}

const timeStampToLocaleDate = (timeStamp: Date): string => {
  return timeStamp.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const getDatePartPesel = (date: string): string => {
  const digitOneFromYear = date.slice(8, 9)
  const digitTwoFromYear = date.slice(9, 10)
  const milenialPartFromYear = date.slice(6, 8)

  const digitThreeFromYear =
    milenialPartFromYear == '20' ? parseInt(date.slice(3, 4)) + 2 : date.slice(3, 4)
  const digitFourFromYear = date.slice(4, 5)
  const digitFiveFromYear = date.slice(0, 1)
  const digitSixFromYear = date.slice(1, 2)
  return (
    digitOneFromYear +
    digitTwoFromYear +
    digitThreeFromYear +
    digitFourFromYear +
    digitFiveFromYear +
    digitSixFromYear
  )
}

const controlDigit = (weights: number[], string: string): string => {
  const controlSum = [...string].reduce((sum, digit, index) => {
    return sum + parseInt(digit) * weights[index]
  }, 0)
  const controlSumDigitValue = controlSum % 10
  const controlDigitValue = 10 - controlSumDigitValue
  return controlDigitValue === 10 ? '0' : controlDigitValue.toString()
}

////////////////////////////////////////////////////////////////////////////////////////
//PESEL
////////////////////////////////////////////////////////////////////////////////////////
export const generatePesel = (
  sex: 'male' | 'female' | 'both',
  options: PeselOptions = {}
): string => {
  let timeStamp: Date
  if (options.birthDate) {
    timeStamp = dateToTimeStamp(options.birthDate)
  } else if (options.age) {
    timeStamp = randomTimeStamp(options.age, options.age)
  } else {
    timeStamp = randomTimeStamp(options.minAge, options.maxAge)
  }
  const datePart = getDatePartPesel(timeStampToLocaleDate(timeStamp))
  const randomPart = addLeadingZeros(generateRandomInt(0, 999), LEADING_ZEROS)
  const sexFieldPart =
    sex === 'male'
      ? generateRandomInt(0, 4) * 2 + 1
      : sex === 'female'
      ? generateRandomInt(0, 4) * 2
      : generateRandomInt(0, 9)
  const controlDigitValue = controlDigit(
    PESEL_CONTROL_CONSTANTS,
    datePart + randomPart + sexFieldPart
  )
  return datePart + randomPart + sexFieldPart + controlDigitValue
}
