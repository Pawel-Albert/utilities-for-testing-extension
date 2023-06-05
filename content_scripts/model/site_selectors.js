import {fakeDataPL} from './fakeDataPL'

export const siteData = {
  'test.totalbet.pl': {
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
