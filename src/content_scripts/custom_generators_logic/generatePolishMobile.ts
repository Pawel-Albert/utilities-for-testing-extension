import {generateRandomInt, addLeadingZeros} from '../../utils/helpers'

export function generatePolishMobile(): string {
  const prefixes: string[] = [
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
