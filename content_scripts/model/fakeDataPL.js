import {faker} from '@faker-js/faker/locale/pl'
import {generatePesel, sex} from '../custom_generators_logic/pesel_core'
import {generatePolishMobile} from '../custom_generators_logic/generatePolishMobile'
import {generateNip} from '../custom_generators_logic/nip_core'
import {generateRegon} from '../custom_generators_logic/regon_core'
import {generateRandomBirthDate} from '../../utilis/helpers'

export const fakeDataPL = {
  cityName: faker.address.cityName(),
  postalCode: faker.address.zipCode(),
  street: faker.address.street(),
  streetFull: faker.address.streetAddress(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: `test${Date.now()}@gmail.com`,
  login: `test${Date.now()}`,
  promoCode: `${faker.word.adjective({strategy: 'shortest'})}_PromoTest`,
  mobile: generatePolishMobile(),
  password: 'Password1234!', // placeholder
  pesel: generatePesel(sex),
  nip: generateNip(),
  regon: generateRegon(),
  companyName: faker.company.name(),
  mortagePeriod: 30,
  incomeAmmount: 5000,
  yearOfBearth: 1950,
  householdExpenses: 100
}

export const fakeDataSb = {
  cityName: faker.address.cityName(),
  postalCode: faker.address.zipCode(),
  street: faker.address.street(),
  streetFull: faker.address.streetAddress(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: `SBB-${Date.now()}@test.com`,
  login: `SBB-${Date.now()}`,
  mobile: generatePolishMobile(),
  password: 'Admin123!', // placeholder
  pesel: generatePesel(sex),
  nip: generateNip(),
  regon: generateRegon(),
  birthdayDate: generateRandomBirthDate()
}
