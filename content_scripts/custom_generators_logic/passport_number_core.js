import {generateRandomInt, addLeadingZeros, getRandomKey} from '../../utilis/helpers'

////////////////////////////////////////////////////////////////////////////////////////
//PASSPORT_NUMBER_CONFIG
////////////////////////////////////////////////////////////////////////////////////////
const KEYS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
const VALUES = [
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  32, 33, 34, 35
]
const createObjectTwoArrays = (KEYS, VALUES) => {
  return Object.fromEntries(KEYS.map((_, i) => [KEYS[i], VALUES[i]]))
}
const letersToIntigiersMap = createObjectTwoArrays(KEYS, VALUES)

const CONTROL_SUM_DEVIDER = 10
const NUMBER_OF_LETERS = 2 // Proper PASSPORT contains 3 letters at the beginning

const LEADING_ZEROS = 6
////////////////////////////////////////////////////////////////////////////////////////
//PASSSPORT_NUMBER
////////////////////////////////////////////////////////////////////////////////////////
export const generatePassportNumber = () => {
  let randomTwoLeters = []
  for (let i = 1; i <= NUMBER_OF_LETERS; i++) {
    randomTwoLeters = [...randomTwoLeters, getRandomKey(letersToIntigiersMap)]
  }
  const passportNumberRandomPart = addLeadingZeros(
    generateRandomInt(0, 999999),
    LEADING_ZEROS
  )
  const controlDigit =
    (7 * letersToIntigiersMap[randomTwoLeters[0]] +
      3 * letersToIntigiersMap[randomTwoLeters[1]] +
      1 * passportNumberRandomPart[0] +
      7 * passportNumberRandomPart[1] +
      3 * passportNumberRandomPart[2] +
      1 * passportNumberRandomPart[3] +
      7 * passportNumberRandomPart[4] +
      3 * passportNumberRandomPart[5]) %
    CONTROL_SUM_DEVIDER
  return randomTwoLeters.join('') + controlDigit + passportNumberRandomPart + ''
}
