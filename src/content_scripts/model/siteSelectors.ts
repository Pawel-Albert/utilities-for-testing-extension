import {fakeDataPL, fakeDataSb} from './fakeDataPL'
import {SiteDataType} from './types'

export const siteData: SiteDataType = {
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
      selector: '[id^=checkbox]',
      type: 'checkCheckbox',
      index: 0
    },
    mortagePeriod: {
      selector: 'input[pattern="[0-9]*"][min="5"][max="35"]',
      type: 'input',
      data: fakeDataPL.mortagePeriod
    },
    incomeAmmount: {
      selector: 'input[pattern="[0-9]*"][min="0"]',
      type: 'input',
      data: fakeDataPL.incomeAmmount,
      index: 1
    },
    incomePeriod: {
      selector: '[draggable="false"]',
      type: 'simpleClick',
      index: 0
    },
    anyCreditsFalse: {
      selector: '[draggable="false"]',
      type: 'simpleClick',
      index: 3
    },
    anyCardsFalse: {
      selector: '[draggable="false"]',
      type: 'simpleClick',
      index: 5
    },
    yearOfBearth: {
      selector: 'input[pattern="[0-9]*"][min="1940"]',
      type: 'input',
      data: fakeDataPL.yearOfBearth
    },
    householdExpenses: {
      selector: 'input[pattern="[0-9]*"][data-mask-raw-value]',
      type: 'input',
      data: fakeDataPL.householdExpenses,
      index: 2
    },
    mobileGeneral: {
      selector: '[type=tel]:not([disabled])',
      type: 'input',
      data: fakeDataPL.mobile
    },
    SOI: {
      selector: 'input[inputmode="none"]',
      type: 'dispatchedClick',
      index: 4
    },
    SOIPicker: {
      selector: '[target="[object HTMLDivElement]"] [role="listbox"] [data-no-activator]',
      type: 'dispatchedClick',
      index: 2
    }
    // example of multiStep type
    // selectWithDropdown: {
    //   type: 'multiStep',
    //   timeout: 500,
    //   steps: [
    //     {
    //       selector: '[data-cy=lead-card-firstname-input] input',
    //       type: 'inputShadow',
    //       data: fakeDataPL.firstName
    //     },
    //     {
    //       selector: '[data-cy=lead-card-lastname-input] input',
    //       type: 'inputShadow',
    //       data: fakeDataPL.lastName
    //     },
    //     {
    //       selector: '[data-cy=lead-card-email-input] input',
    //       type: 'inputShadow',
    //       data: fakeDataPL.email
    //     }
    //   ]
    // },
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
