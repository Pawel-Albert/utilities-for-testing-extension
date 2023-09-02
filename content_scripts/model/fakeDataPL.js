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
  email: `testT${Date.now()}@gmail.com`,
  login: `testT${Date.now()}`,
  promoCode: `${faker.word.adjective({strategy: 'shortest'})}_PromoTest`,
  mobileFake: `${generateRandomInt(5, 8)}${addLeadingZeros(
    generateRandomInt(0, 99999999),
    8
  )}`,
  mobile: faker.phone.number('508 ### ###'),
  password: 'Password1234!', // placeholder
  pesel: generatePesel(sex)
}
