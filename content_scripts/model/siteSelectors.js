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
      selector: '[data-cy=lead-card-phone-input] input:not([disabled])',
      type: 'inputShadow',
      data: fakeDataPL.mobile
    },
    consultCheckbox: {
      selector: '[data-cy="lead-card-data-process-checkbox"] input',
      type: 'checkCheckbox'
    },
    checkAll: {
      selectorAll: document.querySelectorAll('[id^=checkbox]')[0],
      type: 'checkCheckbox'
    },
    mortagePeriod: {
      selector: 'input[pattern="[0-9]*"][min="5"][max="35"]',
      type: 'input',
      data: fakeDataPL.mortagePeriod
    },
    incomeAmmount: {
      selectorAll: document.querySelectorAll('input[pattern="[0-9]*"][min="0"]')[1],
      type: 'input',
      data: fakeDataPL.incomeAmmount
    },
    incomePeriod: {
      selectorAll: document.querySelectorAll("[draggable='false']")[0],
      type: 'simpleClick'
    },
    anyCreditsFalse: {
      selectorAll: document.querySelectorAll("[draggable='false']")[3],
      type: 'simpleClick'
    },
    anyCardsFalse: {
      selectorAll: document.querySelectorAll("[draggable='false']")[5],
      type: 'simpleClick'
    },
    yearOfBearth: {
      selector: 'input[pattern="[0-9]*"][min="1940"]',
      type: 'input',
      data: fakeDataPL.yearOfBearth
    },
    householdExpenses: {
      selectorAll: document.querySelectorAll(
        'input[pattern="[0-9]*"][data-mask-raw-value]'
      )[2],
      type: 'input',
      data: fakeDataPL.householdExpenses
    },
    mobileGeneral: {
      selector: '[type=tel]:not([disabled])',
      type: 'input',
      data: fakeDataPL.mobile
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
