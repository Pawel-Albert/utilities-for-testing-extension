import {setNativeValue, generateRandomInt, addLeadingZeros} from '../utylis/helpers'
import {generatePesel, sex} from './custom_generators_logic/pesel_core.js'
import {faker} from '@faker-js/faker/locale/en_NG'

const fakeData = {
  cityName: faker.address.cityName(),
  postalCode: faker.address.zipCode(),
  street: faker.address.street(),
  streetFull: faker.address.streetAddress(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: `test_sb${Date.now()}@gmail.com`,
  login: `testSB${Date.now()}`, // logins have some character restrictions that emails dont
  promoCode: `${faker.word.adjective({strategy: 'shortest'})}_PromoTest`,
  mobile: `${generateRandomInt(1, 3)}${addLeadingZeros(
    generateRandomInt(0, 99999999),
    8
  )}`, // For mobile lets just stick with 1-3 on the beginning to avoid using real phone numbers in Poland(also Nigeria?) so no matter the env real people don't get msg
  password: 'Password1234', // Please change password to something you whant to use as this is placeholder
  accountNumber: addLeadingZeros(generateRandomInt(0, 9999999999), 10)
}

// CSS selector mainly used in this extension are not the same on similar sites,
// That's why there will be some code repetition as I don't see point on even trying to keep it DRY
// There will be at least 2 form inputs objects for sites sharing most similarities
const formInputs = {
  ...(document.querySelector('input[name*=mail]') && {
    email: document.querySelector('input[name*=mail]')
  }),
  ...(document.querySelector('input[name*=loginName]') && {
    login: document.querySelector('input[name*=loginName]')
  }),
  ...(document.querySelector('input[data-test="account_registerForm_password"]') && {
    password: document.querySelector('input[data-test="account_registerForm_password"]')
  }),
  ...(document.querySelector('input[name*=confirm]') && {
    repeatPassword: document.querySelector('input[name*=confirm]')
  }),
  ...(document.querySelector('input[name*=mobile]') && {
    mobile: document.querySelector('input[name*=mobile]')
  }),
  ...(document.querySelector('input[name*=promoCode]') && {
    promoCode: document.querySelector('input[name*=promoCode]')
  }),
  ...(document.querySelector('input[name*=firstName]') && {
    firstName: document.querySelector('input[name*=firstName]')
  }),
  ...(document.querySelector('input[name*=lastName]') && {
    lastName: document.querySelector('input[name*=lastName]')
  }),
  ...(document.querySelector('input[name*=personal]') && {
    pesel: document.querySelector('input[name*=personal]')
  }),
  ...(document.querySelector('input[name*=postalCode]') && {
    postalCode: document.querySelector('input[name*=postalCode]')
  }),
  ...(document.querySelector('input[name*=address]') && {
    address: document.querySelector('input[name*=address]')
  }),
  ...(document.querySelector('input[name*=city]') && {
    city: document.querySelector('input[name*=city]')
  }),
  ...(document.querySelector('input[name*=selectAllFields]') && {
    allChecboxes: document.querySelector('input[name*=selectAllFields]')
  }),
  ...(document.querySelector('input[name*=rodo]') && {
    rodoClause: document.querySelector('input[name*=rodo]')
  }),
  ...(document.querySelectorAll('[data-test*="selectButton"]') && {
    sof: document.querySelectorAll('[data-test*="selectButton"]')
  }),
  ...(document.querySelectorAll('label > div[class]')[0] && {
    notAnRobotChbx: document.querySelectorAll('label > div[class]')[0]
  }),
  ...(document.querySelector('[name=state]') && {
    state: document.querySelector('[name=state]')
  }),
  ...(document.querySelector('[id*=countrySelect]') && {
    country: document.querySelector('[id*=countrySelect]')
  }),
  ...(document.querySelector('[id*=bankSelect]') && {
    ngBank: document.querySelector('[id*=bankSelect]')
  }),
  ...(document.querySelector('[id*=accountTypeSelect]') && {
    acountType: document.querySelector('[id*=accountTypeSelect]')
  }),
  ...(document.querySelector('[data-test="account_registerForm_bankAccount"') && {
    accountNumber: document.querySelector(
      '[data-test="account_registerForm_bankAccount"]'
    )
  }),
  ...(document.querySelector('[data-test="account_registerForm_gender"') && {
    gender: document.querySelector('[data-test="account_registerForm_gender"]')
  }),
  ...(document.querySelector('[data-test="account_registerForm_birthDay"') && {
    datePickerDay: document.querySelector('[data-test="account_registerForm_birthDay"]')
  }),
  ...(document.querySelector('[data-test="account_registerForm_birthMonth"') && {
    datePickerMonth: document.querySelector(
      '[data-test="account_registerForm_birthMonth"]'
    )
  }),
  ...(document.querySelector('[data-test="account_registerForm_birthYear"') && {
    datePickerYear: document.querySelector('[data-test="account_registerForm_birthYear"]')
  })
}

;(function fillForm() {
  try {
    if (formInputs.email) {
      setNativeValue(formInputs.email, fakeData.email)
      formInputs.email.dispatchEvent(new Event('input', {bubbles: true}))
    }
    if (formInputs.login) {
      setNativeValue(formInputs.login, fakeData.login)
      formInputs.login.dispatchEvent(new Event('input', {bubbles: true}))
    }

    if (formInputs.password) {
      setNativeValue(formInputs.password, fakeData.password)
      formInputs.password.dispatchEvent(new Event('input', {bubbles: true}))
    }
    if (formInputs.repeatPassword) {
      setNativeValue(formInputs.repeatPassword, fakeData.password)
      formInputs.repeatPassword.dispatchEvent(new Event('input', {bubbles: true}))
    }

    if (formInputs.mobile) {
      setNativeValue(formInputs.mobile, fakeData.mobile)
      formInputs.mobile.dispatchEvent(new Event('input', {bubbles: true}))
    }
    if (formInputs.promoCode) {
      setNativeValue(formInputs.promoCode, fakeData.promoCode)
      formInputs.promoCode.dispatchEvent(new Event('input', {bubbles: true}))
    }
    if (formInputs.firstName) {
      setNativeValue(formInputs.firstName, fakeData.firstName)
      formInputs.firstName.dispatchEvent(new Event('input', {bubbles: true}))
    }
    if (formInputs.lastName) {
      setNativeValue(formInputs.lastName, fakeData.lastName)
      formInputs.lastName.dispatchEvent(new Event('input', {bubbles: true}))
    }

    if (formInputs.city) {
      setNativeValue(formInputs.city, fakeData.cityName)
      formInputs.city.dispatchEvent(new Event('input', {bubbles: true}))
    }
    if (formInputs.postalCode) {
      setNativeValue(formInputs.postalCode, fakeData.postalCode)
      formInputs.postalCode.dispatchEvent(new Event('input', {bubbles: true}))
    }
    if (formInputs.pesel) {
      setNativeValue(formInputs.pesel, generatePesel(sex))
      formInputs.pesel.dispatchEvent(new Event('input', {bubbles: true}))
    }
    if (formInputs.address) {
      setNativeValue(formInputs.address, fakeData.street)
      formInputs.address.dispatchEvent(new Event('input', {bubbles: true}))
    }

    if (formInputs.allChecboxes) {
      formInputs.allChecboxes.click() // not good not great but suits the sites its used for
    }

    if (formInputs.rodoClause && !formInputs.allChecboxes) {
      formInputs.rodoClause.click() // not good not great but suits the sites its used for
    }
    if (formInputs.sof.length > 4) {
      formInputs.sof[5].click()
      document.querySelectorAll('[data-test="selectOptions"] li span')[1].click()
    }
    if (formInputs.notAnRobotChbx) {
      formInputs.notAnRobotChbx.click()
    }
    if (formInputs.state) {
      formInputs.state.selectedIndex = generateRandomInt(2, 7)
      formInputs.state.dispatchEvent(new Event('change', {bubbles: true}))
    }
    if (formInputs.country) {
      formInputs.country.selectedIndex = 1
      formInputs.country.dispatchEvent(new Event('change', {bubbles: true}))
    }
    if (formInputs.ngBank) {
      formInputs.ngBank.selectedIndex = generateRandomInt(2, 5)
      formInputs.ngBank.dispatchEvent(new Event('change', {bubbles: true}))
    }
    if (formInputs.acountType) {
      formInputs.acountType.selectedIndex = generateRandomInt(1, 2)
      formInputs.acountType.dispatchEvent(new Event('change', {bubbles: true}))
    }
    if (formInputs.accountNumber) {
      setNativeValue(formInputs.accountNumber, fakeData.accountNumber)
      formInputs.accountNumber.dispatchEvent(new Event('input', {bubbles: true}))
    }
    if (formInputs.gender) {
      formInputs.gender.selectedIndex = generateRandomInt(0, 1)
      formInputs.gender.dispatchEvent(new Event('change', {bubbles: true}))
    }
    if (formInputs.datePickerDay) {
      formInputs.datePickerDay.selectedIndex = generateRandomInt(0, 30)
      formInputs.datePickerDay.dispatchEvent(new Event('change', {bubbles: true}))
    }
    if (formInputs.datePickerMonth) {
      formInputs.datePickerMonth.selectedIndex = generateRandomInt(0, 11)
      formInputs.datePickerMonth.dispatchEvent(new Event('change', {bubbles: true}))
    }
    if (formInputs.datePickerYear) {
      formInputs.datePickerYear.selectedIndex = generateRandomInt(0, 100)
      formInputs.datePickerYear.dispatchEvent(new Event('change', {bubbles: true}))
    }
    console.log(
      `%c Filled something for sure...but what?`,
      'font-family:monospace; color:pink;font-size:20px'
    )
  } catch (error) {
    console.log(error)
  }
})()
