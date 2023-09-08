import {generateRandomInt, addLeadingZeros} from '../../utilis/helpers'

export function generatePolishMobile() {
  const prefixes = [
    '50',
    '51',
    '53',
    '57',
    '60',
    '66',
    '69',
    '72',
    '73',
    '78',
    '79',
    '88'
  ]
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const randomSuffix = addLeadingZeros(generateRandomInt(0, 9999999), 7)
  return `${randomPrefix}${randomSuffix}`
}
