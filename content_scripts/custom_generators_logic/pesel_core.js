import {generateRandomInt, addLeadingZeros} from '../../utilis/helpers.js'

////////////////////////////////////////////////////////////////////////////////////////
//PESEL_CONFIG
////////////////////////////////////////////////////////////////////////////////////////
export const sex = 'both' // Hardcoded
const LEADING_ZEROS = 3
const PESEL_CONTROL_CONSTANTS = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]

const randomTimeStamp = () => {
  const maxBirthDate = new Date(Date.now() - 568036800000) // 18 years ago in milliseconds
  const minBirthDate = new Date(Date.now() - 3155760000000) // 100 years ago in milliseconds
  const minTimestamp = minBirthDate.getTime()
  const maxTimestamp = maxBirthDate.getTime()
  return new Date(generateRandomInt(minTimestamp, maxTimestamp))
}
const timeStampToLocaleDate = timeStamp => {
  return new Date(timeStamp).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// First 6 digits are from birth date - no need for 19 and 22 century cases at they are not possible either way
const getDatePartPesel = date => {
  const digitOneFromYear = date.slice(8, 9)
  const digitTwoFromYear = date.slice(9, 10)
  const milenialPartFromYear = date.slice(6, 8)

  const digitThreeFromYear =
    milenialPartFromYear == 20 ? parseInt(date.slice(3, 4)) + 2 : date.slice(3, 4)
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

const controlDigit = (weights, string) => {
  const controlSum = [...string].reduce((sum, digit, index) => {
    return sum + digit * weights[index]
  }, 0)
  const controlSumDigitValue = controlSum % 10
  const controlDigitValue = 10 - controlSumDigitValue
  return controlDigitValue === 10 ? '0' : controlDigitValue.toString()
}

////////////////////////////////////////////////////////////////////////////////////////
//PESEL
////////////////////////////////////////////////////////////////////////////////////////
export const generatePesel = sex => {
  const timeStamp = randomTimeStamp()
  const datePart = getDatePartPesel(timeStampToLocaleDate(timeStamp))
  const randomPart = addLeadingZeros(generateRandomInt(0, 999), LEADING_ZEROS)
  const sexFieldPart =
    sex === 'both'
      ? generateRandomInt(0, 9)
      : sex === 'male'
      ? generateRandomInt(0, 4) * 2 + 1
      : generateRandomInt(0, 4) * 2
  const controlDigitValue = controlDigit(
    PESEL_CONTROL_CONSTANTS,
    datePart + randomPart + sexFieldPart
  )
  return datePart + randomPart + sexFieldPart + controlDigitValue
}
