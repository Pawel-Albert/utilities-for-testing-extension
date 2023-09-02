import {fakeDataPL} from './fakeDataPL'

export const siteData = {
  'www.qa.lendi.pl|www.lendi.pl': {
    firstName: {
      selector: '[data-cy=lead-card-firstname-input] input',
      type: 'inputShadow',
      data: fakeDataPL.firstName
    },
    lastName: {
      selector: '[data-cy=lead-card-lastname-input] input',
      type: 'inputShadow',
      data: fakeDataPL.lastName
    },
    email: {
      selector: '[data-cy=lead-card-email-input] input',
      type: 'inputShadow',
      data: fakeDataPL.email
    },
    phone: {
      selector: '[data-cy=lead-card-phone-input] input',
      type: 'inputShadow',
      data: fakeDataPL.mobile
    },
    consultCheckbox: {
      selector: '[data-cy="lead-card-data-process-checkbox"] input',
      type: 'checkCheckbox'
    }
    // ...other selectors
  },
  default: {
    email: {selector: 'input[name=email]', type: 'input', data: fakeDataPL.email},
    password: {
      selector: 'input[name=password]',
      type: 'input',
      data: fakeDataPL.password
    },
    mobile: {selector: 'input[name=mobile]', type: 'input', data: fakeDataPL.mobile},
    firstName: {
      selector: 'input[name=firstName]',
      type: 'input',
      data: fakeDataPL.firstName
    },
    lastName: {
      selector: 'input[name=lastName]',
      type: 'input',
      data: fakeDataPL.lastName
    },
    pesel: {
      selector: 'input[name=personalIdentifier]',
      type: 'input',
      data: fakeDataPL.pesel
    },
    selectAllcheckbox: {
      selector: 'input[name=selectAllFields_step1]',
      type: 'simpleClick'
    }
    // ...other selectors
  }
  //   'www.example.com': {
  //     username: {selector: 'input[name*=user]', type: 'text'},
  //     password: {selector: 'input[name*=pass]', type: 'password'}
  //     // ...other selectors
  //   }
  //   // ...other site data
}
