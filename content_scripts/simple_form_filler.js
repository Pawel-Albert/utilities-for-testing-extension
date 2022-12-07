import {setNativeValue, generateRandomInt, addLeadingZeros} from '../utylis/helpers'
import {generatePesel, sex} from './custom_generators_logic/pesel_core.js'

// CSS selector mainly used in this extension are not the same on similar sites,
// That's why there will be some code repetition as I don't see point on even trying to keep it DRY
// There will be at least 2 farm Inputs objects for sites sharing most similarities
const formInputs = {
  ...(document.querySelector('input[name*=mail]') && {
    email: document.querySelector('input[name*=mail]')
  }),
  ...(document.querySelector('input[name*=loginName]') && {
    login: document.querySelector('input[name*=loginName]')
  }),
  ...(document.querySelector('input[name*=password]') && {
    password: document.querySelector('input[name*=password]')
  }),
  ...(document.querySelector('input[name*=password]') && {
    repeatPassword: document.querySelector('input[name*=password]')
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
  })
}

;(function fillForm() {
  try {
    const baseEmails = `test_sb${Date.now()}`
    const baseLogins = `testSB${Date.now()}` // logins have some character restrictions that emails dont
    //This email will always remain unique, you can change const part to easier recognize your tests

    if (formInputs.email) {
      setNativeValue(formInputs.email, `${baseEmails}@gmail.com`)
      formInputs.email.dispatchEvent(new Event('input', {bubbles: true}))
    }
    if (formInputs.login) {
      setNativeValue(formInputs.login, `${baseLogins}`)
      formInputs.login.dispatchEvent(new Event('input', {bubbles: true}))
    }
    // Please change password to something you whant to use as this is placeholder
    if (formInputs.password) {
      setNativeValue(formInputs.password, 'Password1234')
      formInputs.password.dispatchEvent(new Event('input', {bubbles: true}))
    }
    if (formInputs.repeatPassword) {
      setNativeValue(formInputs.repeatPassword, 'Password1234')
      formInputs.repeatPassword.dispatchEvent(new Event('input', {bubbles: true}))
    }
    // For mobile lets just stick with 1-3 on the beginning to avoid using real phone numbers in Poland so no matter the env real people don't get msg
    if (formInputs.mobile) {
      setNativeValue(
        formInputs.mobile,
        `${generateRandomInt(1, 3)}${addLeadingZeros(generateRandomInt(0, 99999999), 8)}`
      )
      formInputs.mobile.dispatchEvent(new Event('input', {bubbles: true}))
    }
    if (formInputs.promoCode) {
      setNativeValue(formInputs.promoCode, 'promoCodeTest')
      formInputs.promoCode.dispatchEvent(new Event('input', {bubbles: true}))
    }
    if (formInputs.firstName) {
      setNativeValue(formInputs.firstName, 'Stefan')
      formInputs.firstName.dispatchEvent(new Event('input', {bubbles: true}))
    }
    if (formInputs.lastName) {
      setNativeValue(formInputs.lastName, 'Frankowski')
      formInputs.lastName.dispatchEvent(new Event('input', {bubbles: true}))
    }

    if (formInputs.pesel) {
      setNativeValue(formInputs.pesel, generatePesel(sex))
      formInputs.pesel.dispatchEvent(new Event('input', {bubbles: true}))
    }
    console.log(
      `%c Filled something for sure...but what?`,
      'font-family:monospace; color:pink;font-size:20px'
    )
  } catch (error) {
    console.log(error)
  }
})()
