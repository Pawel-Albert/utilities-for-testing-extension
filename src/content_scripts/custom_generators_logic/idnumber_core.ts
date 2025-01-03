import {generateRandomInt, addLeadingZeros, getRandomKey} from '../../utilis/helpers'

////////////////////////////////////////////////////////////////////////////////////////
//ID_NUMBER_CONFIG
////////////////////////////////////////////////////////////////////////////////////////
const KEYS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
const VALUES = [
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  32, 33, 34, 35
]
const createObjectTwoArrays = (KEYS: string[], VALUES: number[]): Record<string, number> => {
  return Object.fromEntries(KEYS.map((_, i) => [KEYS[i], VALUES[i]]))
}
const letersToIntigiersMap = createObjectTwoArrays(KEYS, VALUES)

const CONTROL_SUM_DEVIDER = 10
const NUMBER_OF_LETERS = 3 // Proper Id contains 3 letters at the beginning

const LEADING_ZEROS = 5
////////////////////////////////////////////////////////////////////////////////////////
//ID_NUMBER
////////////////////////////////////////////////////////////////////////////////////////
export const generateIdNumber = (): string => {
  let randomThreeLeters: string[] = []
  for (let i = 1; i <= NUMBER_OF_LETERS; i++) {
    randomThreeLeters = [...randomThreeLeters, getRandomKey(letersToIntigiersMap)]
  }
  const idNumberRandomPart = addLeadingZeros(generateRandomInt(0, 99999), LEADING_ZEROS)
  const controlDigit =
    (7 * letersToIntigiersMap[randomThreeLeters[0]] +
      3 * letersToIntigiersMap[randomThreeLeters[1]] +
      1 * letersToIntigiersMap[randomThreeLeters[2]] +
      7 * parseInt(idNumberRandomPart[0]) +
      3 * parseInt(idNumberRandomPart[1]) +
      1 * parseInt(idNumberRandomPart[2]) +
      7 * parseInt(idNumberRandomPart[3]) +
      3 * parseInt(idNumberRandomPart[4])) %
    CONTROL_SUM_DEVIDER
  return randomThreeLeters.join('') + controlDigit + idNumberRandomPart
} 