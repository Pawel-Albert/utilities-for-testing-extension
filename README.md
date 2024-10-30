![](https://github.com/Pawel-Albert/utilities-for-testing-extension/blob/main/%F0%9F%92%BButylis%E2%9A%99%EF%B8%8F.png)

# Google chrome extension with a couple of small functionalities for testers in the form of context menu

## Project Description

The project is a chrome extension in the form of a context menu (available via right mouse button)- mostly niche and current company-specific functionalities. The project was written in vanilla Javascript, bundled with Parcel, and for fake data generation to some extent fakerjs was used. This project heavily uses already written code in my other project https://github.com/Pawel-Albert/test-data-generators. The purpose of the project is to provide some actual utility tool for personal and team usage and at the same time to practice building own chrome extension and just have fun while coding small scripts. Disclaimer: This project is by no means a fully fledged commercial level extension.

## Installation

### Clone

Clone this repo to your local machine using

```shell
git clone https://github.com/Pawel-Albert/utilities-for-testing-extension.git
```

### Setup

Type in terminal

```shell
$ npm install
$ npm run build
```

A folder "dist" should be created. Go to chrome://extensions/. While in developer mode use "load unpacked" extension option and choose "dist" folder. Extension now is ready to use (remember to allow for use in incognito mode if needed).

## Configuration

The extension now includes basic configuration options for form filling:

- User Prefix - allows setting a custom prefix for generated usernames (default: testUser)
- Email Domain - allows setting a custom domain for generated email addresses (default: gmail.com)

More configuration options will be added in future updates.

## Features

All features are available to use in the form of a context menu. After using the right mouse button you can hover on TesterUtilities and click on the desired functionality.

- "Remove all 'disabled' attributes"
  > It will remove all 'disabled' atributes and also css classes with 'disabled' name.
  > This script can be also run by using shortcut command - default is 'ALT + 1'.
  > Shortcuts can be changed at any time - go to chrome://extensions/shortcuts.
- "Highlight elements with same ID"
- "Clear_all_input_restrictions"
  > It will remove few typical input restrictions: required, maxlength, minlength, onpaste function.
- "Change all inputs type from password to text"
  > To use it you can choose it from context menu UI, or use provided default shortcut that is 'ALT + 4'.
- "JSON prettier via console"
  > After clicking it in context menu you will be asked in window prompt to input a valid JSON that will be printed in dev tools console in a formatted way.
- "Timestamp to date"
  > After clicking it in context menu you will be asked in window prompt to input locale timezone(default is 'pl') and after that a valid timestamp (example: 1669852799000). Result will be displayed in window Alert in provided locale timezone.
- "Base64 decode and print to console"
- "Base64 encode and print to console"
- "Generate PESEL (18+)"
  > Designed usage is on inputs - generates valid Polish "PESEL" (thats an Universal Electronic System for Registration of the Population).
  > Above and all other (generate scripts), besides populating input with the data, the data is also printed to the dev tools console.
- "Generate IBAN"
- "Generate ID number"
- "Generate PASSPORT number"
- "Simple form filler - default site": This new functionality auto-fills forms on the default site. It's available in the context menu UI, to use it you can also press the default shortcut that was set to 'ALT + 2'. The data that fills the form is generated and set directly in the code. For instance, to set up a new site for form filling, you would create an entry in the `siteSelectors` file like the following generic example:

```javascript
const mySiteData = {
  default: {
    username: {
      selector: 'input[name=username]',
      type: 'input',
      data: myFakeData.username
    },
    password: {selector: 'input[name=password]', type: 'input', data: myFakeData.password}
    // ...other selectors
    // You can add more fields to the form filling process by adding more entries in the site data object. Each entry requires a selector to find the input (also click events are possible) field on the page, the type of data, and the data itself.
  }
}
```

- "Simple form filler - custom sites": This feature auto-fills forms on the custom sites defined in the extension. It's not available in the context menu UI, to use it you can press the default shortcut that was set to 'ALT + 3'. Setting up the data for custom sites is done similarly to the default site, you would create the site and data mapping directly in the `siteSelectors` file.

To configure multiple custom sites for auto-filling forms, you can extend the `siteSelectors` like in this generic example:

```javascript
const mySiteData = {
  'mySite1.com': {
    username: {
      selector: 'input[name=username]',
      type: 'input',
      data: myFakeData.username
    },
    password: {selector: 'input[name=password]', type: 'input', data: myFakeData.password}
    // ...other selectors
  },
  'mySite2.com': {
    email: {selector: 'input[name=email]', type: 'input', data: myFakeData.email},
    password: {selector: 'input[name=password]', type: 'input', data: myFakeData.password}
    // ...other selectors
  },
  default: {
    username: {
      selector: 'input[name=username]',
      type: 'input',
      data: myFakeData.username
    },
    password: {selector: 'input[name=password]', type: 'input', data: myFakeData.password}
    // ...other selectors
  }
}
```

### Major Update

The extension has undergone a significant refactoring to improve its flexibility and compatibility. The "Simple form filler" and "Simple form filler EN" functionalities, which were previously available in the main branch, have been moved to a separate branch called 'vanila-SB'. This change was made to enhance the project's maintainability and to better accommodate the specific requirements of these features.

### Deprecated Features

- "Simple form filler" - This feature was previously available in the main branch. It has now been moved to the 'vanila-SB' branch.
- "Simple form filler EN" - This feature was also moved to the 'vanila-SB' branch. It's not available in context menu UI.

Please switch to the 'vanila-SB' branch if you wish to continue using these features.

## Todo

- [x] Form auto filler with random data
- [x] Fix Generate functions, as currently they are not registered by browser as user actions
- [x] Add basic configuration for form filling (user prefix, email domain)
- [ ] Expand configuration options for form filling
- [ ] Lot of small "quality of life changes" on user requests
