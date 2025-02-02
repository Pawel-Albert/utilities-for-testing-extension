import {SiteDataType} from '../../types/formFiller'
import {fakeDataPL, fakeDataSb} from './fakeDataPL'
import {fakeDataRO} from './fakeDataRO'

export function getSiteData(): SiteDataType {
  // This is company specific code, later we will also ad fully customizable site selectors
  // Get domain from session storage and current host to determine the country
  const domain = sessionStorage.getItem('__DOMAIN__')
  const currentHost = window.location.host
  console.log('Domain:', domain)

  // Determine if Romania based on:
  // 1. Session storage domain (for domain switcher)
  // 2. Current host (for direct access to RO platform)
  const isRomania =
    domain === 'finance.imobiliare.ro' || currentHost.includes('finance.imobiliare.ro')

  console.log('Is Romania:', isRomania)

  // Generate both data sets upfront
  const plData = fakeDataPL()
  const roData = fakeDataRO()

  // Use commonData for shared fields, avoiding repetitive ternary operators
  const commonData = isRomania ? roData : plData

  return {
    'demo.sb-betting.com': {
      mobile: {
        selector: 'input[data-test="mobile"]',
        type: 'input',
        data: fakeDataSb().mobile
      },
      email: {
        selector: 'input[data-test="email"]',
        type: 'input',
        data: fakeDataSb().email
      },
      password: {
        selector: 'input[data-test="password"]',
        type: 'input',
        data: fakeDataSb().password
      },
      confirmPassword: {
        selector: 'input[data-test="confirm_password"]',
        type: 'input',
        data: fakeDataSb().password
      },
      firstName: {
        selector: 'input[data-test="first_name"]',
        type: 'input',
        data: fakeDataSb().firstName
      },
      lastName: {
        selector: 'input[data-test="last_name"]',
        type: 'input',
        data: fakeDataSb().lastName
      },
      dateOfBirth: {
        selector: 'input[data-test="date_of_birth"]',
        type: 'input',
        data: fakeDataSb().birthdayDate
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
        data: commonData.firstName
      },
      lastName: {
        selector: '[data-cy=lead-card-lastname-input] input',
        type: 'inputShadow',
        data: commonData.lastName
      },
      email: {
        selector: '[data-cy=lead-card-email-input] input',
        type: 'inputShadow',
        data: commonData.email
      },
      phone: {
        selector: '[data-cy=lead-card-phone-input] input:not([disabled])',
        type: 'inputShadow',
        data: commonData.mobile
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
        data: commonData.mortagePeriod
      },
      incomeAmmount: {
        selector: 'input[pattern="[0-9]*"][min="0"]',
        type: 'input',
        data: commonData.incomeAmmount,
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
        data: commonData.yearOfBearth
      },
      householdExpenses: {
        selector: 'input[pattern="[0-9]*"][data-mask-raw-value]',
        type: 'input',
        data: commonData.householdExpenses,
        index: 2
      },
      mobileGeneral: {
        selector: '[type=tel]:not([disabled])',
        type: 'input',
        data: commonData.mobile
      },
      SOI: {
        selector: 'input[inputmode="none"]',
        type: 'dispatchedClick',
        index: 4
      },
      SOIPicker: {
        selector:
          '[target="[object HTMLDivElement]"] [role="listbox"] [data-no-activator]',
        type: 'dispatchedClick',
        index: 2
      }
    },

    'platforma.qa.lendi.pl|fincrm-frontend|platforma.qa.finance.imobiliare.ro': {
      clientFirstName: {
        selector: '[id="clientFirstName"]',
        type: 'input',
        data: commonData.firstName
      },
      clientLastName: {
        selector: '[id="clientLastName"]',
        type: 'input',
        data: commonData.lastName
      },
      clientIdentityNumber: {
        selector: '[id="clientPesel"]',
        type: 'input',
        data: isRomania ? roData.cnp : plData.pesel
      },
      clientPhoneNumber: {
        selector: '[id="clientPhoneNumber"]',
        type: 'input',
        data: commonData.mobile
      },
      clientEmail: {
        selector: '[id="clientEmail"]',
        type: 'input',
        data: commonData.email
      },
      acceptsAllCheckbox: {
        selector: 'div [role=checkbox]',
        type: 'checkCheckbox',
        index: 0
      },
      acceptsProcessingCheckbox: {
        selector: '[id="acceptsProcessing"] [role=checkbox]',
        type: 'checkCheckbox'
      },
      acceptsProcessingLeadCheckbox: {
        selector: '[id="acceptsProcessingLead"] [role=checkbox]',
        type: 'checkCheckbox'
      },
      acceptsReceivingInfoCheckbox: {
        selector: '[id="acceptsReceivingInfo"] [role=checkbox]',
        type: 'checkCheckbox'
      },
      acceptsReceivingOffersCheckbox: {
        selector: '[id="acceptsReceivingOffers"] [role=checkbox]',
        type: 'checkCheckbox'
      },
      clientCompanyName: {
        selector: '[id="clientCompanyName"]',
        type: 'input',
        data: commonData.companyName
      },
      clientTaxId: {
        selector: '[id="clientNip"]',
        type: 'input',
        data: isRomania ? roData.cui : plData.nip
      },
      // Only for PL
      clientRegon: {
        selector: '[id="clientRegon"]',
        type: 'input',
        data: plData.regon
      }
    },

    default: {
      email: {
        selector: 'input[name=email]',
        type: 'input',
        data: commonData.email
      },
      password: {
        selector: 'input[name=password]',
        type: 'input',
        data: commonData.password
      },
      mobile: {
        selector: 'input[name=mobile]',
        type: 'input',
        data: commonData.mobile
      },
      firstName: {
        selector: 'input[name=firstName]',
        type: 'input',
        data: commonData.firstName
      },
      lastName: {
        selector: 'input[name=lastName]',
        type: 'input',
        data: commonData.lastName
      }
    }
  }
}
