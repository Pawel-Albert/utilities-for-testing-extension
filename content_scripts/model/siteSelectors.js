import {fakeDataPL} from './fakeDataPL'
import {fakeDataSb} from './fakeDataPL'

export const siteData = {
  'demo.sb-betting.com': {
    mobile: {
      selector: 'input[data-test="mobile"]',
      type: 'input',
      data: fakeDataSb.mobile
    },
    email: {
      selector: 'input[data-test="email"]',
      type: 'input',
      data: fakeDataSb.email
    },
    password: {
      selector: 'input[data-test="password"]',
      type: 'input',
      data: fakeDataSb.password
    },
    confirmPassword: {
      selector: 'input[data-test="confirm_password"]',
      type: 'input',
      data: fakeDataSb.password
    },
    firstName: {
      selector: 'input[data-test="first_name"]',
      type: 'input',
      data: fakeDataSb.firstName
    },
    lastName: {
      selector: 'input[data-test="last_name"]',
      type: 'input',
      data: fakeDataSb.lastName
    },
    dateOfBirth: {
      selector: 'input[data-test="date_of_birth"]',
      type: 'input',
      data: fakeDataSb.birthdayDate
    },
    consentCheckbox: {
      selector: 'input[data-test="marketing_consent"]',
      type: 'checkCheckbox'
    }
  },

  'www.qa.lendi.pl|www.lendi.pl|lendi.pl|qa.lendi.pl|localhost|lendi-b2c-*': {
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
    },
    SOI: {
      selectorAll: document.querySelectorAll('input[inputmode="none"]')[4],
      type: 'dispatchedClick'
    },
    SOIPicker: {
      selectorAll: document.querySelectorAll(
        '[target="[object HTMLDivElement]"] [role="listbox"] [data-no-activator]'
      )[2],
      type: 'dispatchedClick'
    }
  },

  'platforma.qa.lendi.pl|fincrm-frontend-git': {
    clientFirstName: {
      selector: '[id="clientFirstName"]',
      type: 'input',
      data: fakeDataPL.firstName
    },
    clientLastName: {
      selector: '[id="clientLastName"]',
      type: 'input',
      data: fakeDataPL.lastName
    },
    clientPesel: {
      selector: '[id="clientPesel"]',
      type: 'input',
      data: fakeDataPL.pesel
    },
    clientPhoneNumber: {
      selector: '[id="clientPhoneNumber"]',
      type: 'input',
      data: fakeDataPL.mobile
    },
    clientEmail: {
      selector: '[id="clientEmail"]',
      type: 'input',
      data: fakeDataPL.email
    },
    acceptsProcessingCheckbox: {
      selector: 'input[id="acceptsProcessing"]',
      type: 'checkCheckbox'
    },
    acceptsProcessingLeadCheckbox: {
      selector: 'input[id="acceptsProcessingLead"]',
      type: 'checkCheckbox'
    },
    acceptsReceivingInfoCheckbox: {
      selector: 'input[id="acceptsReceivingInfo"]',
      type: 'checkCheckbox'
    },
    acceptsReceivingOffersCheckbox: {
      selector: 'input[id="acceptsReceivingOffers"]',
      type: 'checkCheckbox'
    },
    clientCompanyName: {
      selector: '[id="clientCompanyName"]',
      type: 'input',
      data: fakeDataPL.companyName
    },
    clientNip: {
      selector: '[id="clientNip"]',
      type: 'input',
      data: fakeDataPL.nip
    },
    clientRegon: {
      selector: '[id="clientRegon"]',
      type: 'input',
      data: fakeDataPL.regon
    }
  },

  default: {
    email: {selector: 'input[name=email]', type: 'input', data: fakeDataPL.email},
    password: {
      selector: 'input[name=password]',
      type: 'input',
      data: fakeDataPL.password
    },
    confirmPassword: {
      selector: 'input[data-test="confirm_password"]',
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
    }
  }
}
