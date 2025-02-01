import {generateCnp} from '../custom_generators_logic/ro/cnpGenerator'
import {generateCui} from '../custom_generators_logic/ro/cuiGenerator'
import {generateRoPhone} from '../custom_generators_logic/ro/phoneGenerator'
import {FakeDataRO} from '../../types/fakeData'

export const fakeDataRO = (): FakeDataRO => {
  const firstName = 'TestRO'
  const lastName = 'UserRO'
  const cnp = generateCnp('male', {minAge: 18})
  const cui = generateCui()
  const mobile = generateRoPhone()
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@test.ro`
  const password = 'Test123!'
  const companyName = 'Test Company RO'

  // Common fields for both PL and RO
  const mortagePeriod = '20'
  const incomeAmmount = '5000'
  const yearOfBearth = '1990'
  const householdExpenses = '2000'

  return {
    firstName,
    lastName,
    cnp,
    cui,
    mobile,
    email,
    password,
    companyName,
    mortagePeriod,
    incomeAmmount,
    yearOfBearth,
    householdExpenses
  }
}
