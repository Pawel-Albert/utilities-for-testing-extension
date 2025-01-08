![](https://github.com/Pawel-Albert/utilities-for-testing-extension/blob/main/%F0%9F%92%BButylis%E2%9A%99%EF%B8%8F.png)

# TesterUtilities - Chrome Extension for Testing

## Project Description

A Chrome extension that combines context menu tools with a user scripts manager. Started as a simple testing utility with generators and form fillers, now expanded to include custom JavaScript execution, data persistence and configurable settings. The extension provides various testing tools like data generators, form manipulation utilities, and text processing features. All functionalities can be accessed through the context menu or managed via a dedicated settings panel. Built with TypeScript and Parcel.

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

## Features

All features are available in the context menu, organized into logical groups. After right-clicking, hover over TesterUtilities to see the following groups:

### Data Generators

- "Generate PESEL (18+)" - Generates valid Polish PESEL number (for adults)
- "Generate IBAN" - Generates valid IBAN number
- "Generate ID number" - Generates valid Polish ID number
- "Generate PASSPORT number" - Generates valid Polish passport number
- "Generate valid PL mobile phone" - Generates valid Polish mobile phone number
- "Generate valid PL NIP" - Generates valid Polish NIP (tax identification number)
- "Generate valid PL REGON" - Generates valid Polish REGON number

### Text Tools

- "Generate Counter String" - Generates a counter string with specified length
- "Generate Lorem Ipsum" - Generates Lorem Ipsum text with specified length
- "Multiply Text in Lines" - Multiplies given text in multiple lines with specified parameters
- "Generate Text Pattern" - Generates various text patterns based on input text

### Form Tools

- "Remove all 'disabled' attributes" - Removes all disabled attributes from form elements
- "Clear all input restrictions" - Removes typical input restrictions
- "Change all inputs type from password to text" - Converts password fields to text fields
- "Highlight elements with same ID" - Highlights elements with duplicate IDs
- "Highlight and show all 'display none' elements" - Shows hidden elements

### Form Fillers

- "Simple form filler - default site" - Auto-fills forms on default site (Alt+2)
- "Simple form filler - custom sites" - Auto-fills forms on custom sites (Alt+3)

To configure form fillers for your sites, you can extend the `siteSelectors` configuration. Here's an example:

```javascript
const mySiteData = {
  // Configuration for specific site
  'mySite1.com': {
    username: {
      selector: 'input[name=username]',
      type: 'input',
      data: myFakeData.username
    },
    password: {
      selector: 'input[name=password]',
      type: 'input',
      data: myFakeData.password
    }
    // Add more fields as needed
  },

  // Configuration for another site
  'mySite2.com': {
    email: {
      selector: 'input[name=email]',
      type: 'input',
      data: myFakeData.email
    },
    password: {
      selector: 'input[name=password]',
      type: 'input',
      data: myFakeData.password
    }
    // Add more fields as needed
  },

  // Default configuration used when no specific site match
  default: {
    username: {
      selector: 'input[name=username]',
      type: 'input',
      data: myFakeData.username
    },
    password: {
      selector: 'input[name=password]',
      type: 'input',
      data: myFakeData.password
    }
    // Add more fields as needed
  }
}
```

Each field configuration requires:

- `selector`: CSS selector to find the element
- `type`: Type of element ('input' for input fields)
- `data`: Data to be inserted (can use predefined fake data or custom values)

### Console Tools

- "JSON prettier via console" - Formats JSON and prints to console
- "Timestamp to date" - Converts timestamp to readable date
- "Base64 decode and print to console" - Decodes Base64 string
- "Base64 encode and print to console" - Encodes string to Base64

### Domain Tools

- "Switch domain" - Switches between domains (Alt+1) - Company-specific feature, currently configured only for internal company domains. To use it for different domains, the configuration needs to be modified in the source code.

## Configuration

The extension now includes configuration options for both form filling and text generators, accessible through the extension's options page:

### Form Filler Settings

- User Prefix - Custom prefix for generated usernames (default: test)
- Email Domain - Custom domain for generated email addresses (default: gmail.com)

### Text Generator Settings

- Lorem Ipsum default length - Default length for Lorem Ipsum text (default: 100)
- Pattern Generator default text - Default text for pattern generation (default: test)
- Pattern Generator default length - Default length for generated patterns (default: 1000)
- Text Multiplier default text - Default text for multiplication (default: sample text)
- Text Multiplier default lines - Default number of lines (default: 3)
- Text Multiplier line length - Default length of each line (default: 50)
- Counter String default length - Default length for counter string (default: 100)

All settings are persistent between browser sessions and can be modified at any time through the extension's options page.

## Recent Updates

### Version 0.2.9

- Added new text generation tools with configurable defaults
- Reorganized context menu into logical groups
- Added persistent settings for all text generators
- Improved project structure with centralized configuration
- Enhanced user experience with customizable default values

### Version 0.2.10 Updates

#### Settings Management Improvements

- Added persistent settings storage using IndexedDB
- Settings now survive extension reinstalls/updates
- Added settings backup & restore functionality:
  - Export settings to JSON file
  - Import settings from JSON file
- Added debug view for current settings state
- Settings are now managed through a dedicated options page

#### Storage Architecture

The extension now uses a more robust storage system:

- Primary storage: IndexedDB for persistent data
- Settings are stored in a dedicated database 'TesterUtilitiesDB'
- Improved error handling and fallback mechanisms
- Debug tools for storage inspection

#### New UI Features in Options Page

- Added dedicated sections for different setting types
- Form Filler Settings configuration
- Text Generator Settings management
- Backup & Restore tools
- Debug tools for storage inspection

### Version 0.2.11 Updates

#### Project Structure Improvements

- Reorganized project structure with src/ directory
- Moved all UI files to src/pages/
- Added popup with quick links and description

#### UI Enhancements

- Added consistent styling across popup and options
- Improved navigation between different pages
- Added extension icon and description to popup

#### Code Quality

- Cleaned up duplicate navigation links
- Improved file organization and imports
- Updated all file paths for better maintainability

### Version 0.2.12 Updates

#### User Scripts Feature

- Added User Scripts feature (BETA)
- Improved storage management with IndexedDB backup
- Unified settings handling
- Better pattern matching for script execution
- Added script management UI

### Version 0.3.0 Updates

#### PESEL Generator Improvements

- Split PESEL generator into separate modes:
  - Male (18+)
  - Female (18+)
  - Custom with age/date options
- Fixed control digit calculation
- Improved validation and error handling

#### User Scripts Enhancements

- Added enable/disable functionality for scripts
- Added unique IDs for better script management
- Improved UI with toasts instead of alerts
- Added confirmation modals for destructive actions
- Scripts can now be filtered by enabled state
- Better script state persistence

### Version 0.4.0 Updates

#### Script Management Improvements

- Added dual script execution modes:
  - User Scripts Panel: Persistent buttons injected into page DOM (like TamperMonkey)
  - Execution Scripts Panel: Instant script execution (may be limited by CSP)
- Enhanced script registration with new options:
  - `runAt`: Control when scripts are executed
  - `allFrames`: Control script execution in frames
  - `persistAcrossSessions`: Keep scripts between browser sessions
- Improved script execution reliability with DOM content loading checks
- Better error handling and script state management

#### UI/UX Enhancements

- Added Chrome Side Panel integration
- Improved script management interface
- Better visual feedback for script states
- Added tooltips and help text for new features

#### Technical Improvements

- Updated Chrome User Scripts API implementation
- Enhanced TypeScript type definitions
- Better script injection timing control
- Improved error handling and logging

## Todo

- [x] Form auto filler with random data
- [x] Fix Generate functions, as currently they are not registered by browser as user actions
- [x] Add basic configuration for form filling (user prefix, email domain)
- [x] Add text generator configuration options
- [x] Organize context menu into logical groups
- [ ] Improve User Scripts feature:
  - [ ] Add script categories/tags
  - [ ] Add script sharing functionality
  - [ ] Add script import/export
  - [ ] Add script versioning
  - [ ] Add script dependencies
- [ ] Implement Chrome Side Panel integration
- [ ] Add more configuration options based on user feedback
- [ ] Implement more "quality of life" improvements based on user requests

## Polityka Prywatności / Privacy Policy

**TesterUtilities - Rozszerzenie dla Testowania**

TesterUtilities nie zbiera ani nie przechowuje żadnych danych osobowych użytkowników. Rozszerzenie służy wyłącznie jako narzędzie pomocnicze do uruchamiania skryptów testerskich. Nie przekazujemy, nie przetwarzamy ani nie przechowujemy żadnych informacji dotyczących użytkowników tego rozszerzenia.

W razie dodatkowych pytań proszę o kontakt.

---

**TesterUtilities - Testing Extension**

TesterUtilities does not collect or store any personal user data. This extension serves solely as a utility tool for running testing scripts. We do not transmit, process, or retain any information about the users of this extension.

For any further questions, please feel free to contact me.
