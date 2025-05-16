![](https://github.com/Pawel-Albert/utilities-for-testing-extension/blob/main/%F0%9F%92%BButylis%E2%9A%99%EF%B8%8F.png)

# TesterUtilities - Chrome Extension for Testing

## Project Description

A Chrome extension that combines context menu tools with a user scripts manager. Started as a simple testing utility with generators and form fillers, now expanded to include custom JavaScript execution, data persistence and configurable settings. The extension provides various testing tools like data generators, form manipulation utilities, and text processing features. All functionalities can be accessed through the context menu or managed via a dedicated settings panel. Built with TypeScript and Parcel.

🌐 Available on Chrome Web Store: [TesterUtilities](https://chromewebstore.google.com/detail/testerutilities/lmlfadbikkafmfacnbdlcjaehopomkii)

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

To configure form fillers for your sites, you can now use the Custom Site Selectors feature. This provides a user-friendly interface for adding and managing your site configurations without having to modify the code.

#### Custom Site Selectors

The extension now offers a dedicated UI for managing custom site selectors accessible through the options page. You can:

1. **Add new site configurations** with a simple JSON editor
2. **Import/export** configurations to share them between browsers or with colleagues
3. **View and edit** existing configurations
4. **Test and preview** your selectors

Here's an example of the new JSON configuration format:

```javascript
{
  "email": {
    "selector": "input[name='email']",
    "type": "input",
    "dataType": "function",
    "dataGenerator": "generateRandomEmail"
  },
  "password": {
    "selector": "input[type='password']",
    "type": "input",
    "data": "SecurePassword123!"
  },
  "firstName": {
    "selector": "input[name='firstName']",
    "type": "input",
    "dataType": "function",
    "dataGenerator": "fakerFirstName"
  },
  "dropdown": {
    "type": "multiStep",
    "selector": ".dropdown",
    "timeout": 500,
    "steps": [
      {
        "selector": ".dropdown-toggle",
        "type": "simpleClick"
      },
      {
        "selector": ".dropdown-item",
        "type": "simpleClick",
        "index": 2
      }
    ]
  }
}
```

Key features of the new system:

- **Multiple domain support** with pipe separator: `example.com|test.org`
- **Wildcard matching** for subdomains: `*.example.com`
- **Dynamic data generators** with parameters: `fakerZipCode:##-###:pl`
- **Multi-step interactions** for complex forms
- **Support for shadow DOM** and other complex UI elements
- **Multiple action types**: input, click, checkbox, and more

For detailed documentation, visit the Site Selectors page in the extension options.

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

### Version 0.4.1 Updates

#### Romanian Data Generators

- Added Romanian data generators:
  - CNP (Personal Numeric Code) with male/female/custom options
  - CUI (Company ID) with optional RO prefix for VAT payers
  - Romanian mobile phone numbers with national/international format
- Reorganized Data Generators menu into country-specific sections:
  - Polish Data Generators (PESEL, NIP, etc.)
  - Romanian Data Generators (CNP, CUI, phone)

#### Technical Improvements

- Updated Chrome User Scripts API implementation
- Enhanced TypeScript type definitions
- Better script injection timing control
- Improved error handling and logging

### Version 0.4.2 Updates

#### Script Panels Improvements

- Unified location checking for chrome:// and chrome-extension:// URLs
- Removed duplicate warnings and inline scripts
- Improved CSP compliance
- Added better descriptions for Execute/User Scripts differences
- Simplified button hover and click effects
- Added pattern display to buttons
- Improved button layout with flexbox

#### Group Management & Filtering

- Added comprehensive group management functionality (add/edit/delete groups)
- Implemented group filter component with collapsible panel
- Added filter state persistence in chrome.storage
- Replaced select with pills for better UX
- Added Select All and Clear buttons
- Added proper handling of scripts without groups
- Added descriptive labels to group modals
- Improved group names display (showing name instead of ID)
- Persisted filter state per panel type

#### Performance & UX Improvements

- Eliminated flickering in User Scripts Panel toggle operations
- Added throttling to panel refresh (2s interval)
- Optimized toggle state management
- Improved script list rendering with content comparison
- Enhanced error handling for toggle state restoration
- Added better debug information and storage info display

#### URL Pattern Validation

- Implemented comprehensive URL pattern validation with user-friendly messages
- Added pattern normalization for common cases
- Added validation for:
  - Protocol/scheme (http://, https://, \*://)
  - Domain format and TLD
  - Path structure
  - Special characters and security checks
  - Length limits
- Replaced console errors with toast notifications
- Improved error handling in pattern processing

### Version 0.4.3 Updates

#### Console & Build Improvements

- Added collapsible console panel with state persistence
- Improved build process with automatic dist cleanup
- Enhanced console error handling and auto-expand on errors

### Version 0.5.0 Updates

#### Custom Site Selectors Configuration UI

- Added comprehensive UI for managing custom site selectors
  - New dedicated interface for adding, editing, and deleting custom site configurations
  - JSON-based configuration with live preview and validation
  - Import/export functionality for sharing configurations
  - Detailed documentation and examples directly in the UI
- Enhanced pattern matching for site URLs:
  - Support for multiple domains with pipe separator (e.g., `example.com|test.com`)
  - Wildcard support for subdomains and paths
  - Improved regex-based URL matching algorithm
- Completely redesigned site selector structure for better customization
  - Simple syntax for defining form fields and their selectors
  - Support for complex multi-step interactions and workflows
  - Detailed field configuration options with comprehensive documentation

#### Enhanced Data Generators

- Added new data generators:
  - Random Integer generator with configurable min/max range
  - License Plate generator with support for multiple countries (Poland, Germany, UK, US, Romania)
- Improved structure for custom data generators with dedicated core logic modules
- Better type safety and error handling for all data generators

#### Form Filler Improvements

- Completely refactored form filling logic for better reliability
- Support for dynamically configured fields through the custom site selector UI
- Advanced field interaction types:
  - Regular input fields
  - Shadow DOM elements
  - Checkboxes and radio buttons
  - Dropdowns and select elements
  - Multi-step interactions for complex forms
- Added support for dynamic data generation with parameters
  - Format specification (e.g., `fakerZipCode:##-###:pl`)
  - Multiple parameters (format, locale)
- Field detection with robust selector strategies

#### Advanced Faker.js Integration

- Added direct access to any Faker.js function using dot notation
- Added locale support for all data generators
- Implemented safe locale handling with fallback mechanisms
- Extended data generator functions with comprehensive documentation

#### Code Quality & Structure

- Improved code organization with functional programming approach
- Enhanced TypeScript type definitions and interfaces
- Better error handling and logging
- Removed company-specific code in favor of generic templates

### Version 0.5.1 Updates

#### Testing Library-like Selectors

- Added a powerful selector system inspired by Testing Library for more semantic and resilient element selection
- Implemented four new selector types:
  - **Role-based selectors**: Find elements by ARIA role (button, textbox, checkbox, etc.)
  - **Label-based selectors**: Find form elements by associated label text
  - **Text-based selectors**: Find elements containing specific text
  - **TestID-based selectors**: Find elements by data-testid attribute
- Added advanced selector options:
  - **Index selection**: Choose specific element when multiple matches are found
  - **Exact matching**: Control whether text matching is exact or partial
- Created helper functions to simplify selector creation with comprehensive documentation

### Version 0.5.2 Updates

#### Test Pages on GitHub Pages

- Added set of test pages hosted on GitHub Pages for practicing with selectors:
  - ARIA form - Demonstrates forms with ARIA roles and labels
  - Label form - Forms with standard HTML labels
  - Text form - Elements that can be selected by text content
  - TestID form - Elements with data-testid attributes
  - Shadow DOM form - Testing Shadow DOM components
  - Multi-step form - For practicing step-by-step form filling
  - Complex form - Combining multiple selection strategies
- All test pages are now accessible online at https://pawel-albert.github.io/utilities-for-testing-extension/test-pages/

#### Enhanced ARIA Role Support

- Improved `getByRole` function with more resilient implementation:
  - Support for `combobox` role (select elements)
  - Better accessible name calculation following ARIA guidelines
  - Support for input elements with associated labels through `for` attribute
  - Enhanced name comparisons with exact matching option
- Added diagnostic function `diagnosticLogAllElementsWithRoles` to help debug ARIA roles and accessible names

#### Improved Date Fields Support

- Enhanced role-based selectors for date inputs
- Better handling of date-specific input types
- Fixed issues with accessible name calculation for date fields

#### Romanian Data Generators Enhancements

- Improved CNP (Personal Numeric Code) generation with more robust validation
- Better CUI (Company ID) formatting with optional RO prefix
- Enhanced Romanian phone number generation with format options

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
- [x] Implement Chrome Side Panel integration
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
