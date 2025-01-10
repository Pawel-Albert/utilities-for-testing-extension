import {generateRandomInt, addLeadingZeros} from '../../utils/helpers'

const PROVINCE_LEADING_ZEROS = 2
const LEADING_ZEROS = 6
const CONTROL_SUM_DEVIDER = 11

export const generateRegon = (): string => {
  const provinceCode = addLeadingZeros(
    generateRandomInt(0, 48) * 2 + 1,
    PROVINCE_LEADING_ZEROS
  )
  const regonRandomPart = addLeadingZeros(generateRandomInt(0, 999999), LEADING_ZEROS)
  const core = provinceCode + regonRandomPart
  const controlDigit =
    (parseInt(core[0]) * 8 +
      parseInt(core[1]) * 9 +
      parseInt(core[2]) * 2 +
      parseInt(core[3]) * 3 +
      parseInt(core[4]) * 4 +
      parseInt(core[5]) * 5 +
      parseInt(core[6]) * 6 +
      parseInt(core[7]) * 7) %
    CONTROL_SUM_DEVIDER
  const controleValue = controlDigit == 10 ? 0 : controlDigit
  return core + controleValue
}
