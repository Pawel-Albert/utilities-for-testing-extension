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
  mobile: `${generateRandomInt(1, 3)}${addLeadingZeros(
    generateRandomInt(0, 99999999),
    8
  )}`, // For mobile lets just stick with 1-3 on the beginning to avoid using real phone numbers in Poland(also Nigeria?) so no matter the env real people don't get msg
  password: 'Password1234!', // placeholder
  pesel: generatePesel(sex)
}
