import {faker} from '@faker-js/faker/locale/pl'
import {generateRandomInt, addLeadingZeros} from '../../utilis/helpers'
import {generatePesel, sex} from '../custom_generators_logic/pesel_core'

export const fakeDataPL = {
  cityName: faker.address.cityName(),
  postalCode: faker.address.zipCode(),
  street: faker.address.street(),
  streetFull: faker.address.streetAddress(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: `testLendi${Date.now()}@gmail.com`,
  login: `testLendi${Date.now()}`,
  promoCode: `${faker.word.adjective({strategy: 'shortest'})}_PromoTest`,
  mobile: generatePolishMobile(),
  password: 'Password1234!', // placeholder
  pesel: generatePesel(sex),
  mortagePeriod: 30,
  incomeAmmount: 5000,
  yearOfBearth: 1950,
  householdExpenses: 100
}

function generatePolishMobile() {
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
