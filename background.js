const menuItems = [
  {
    title: "Remove all 'disabled' attributes",
    id: "Remove all 'disabled' attributes",
    file: 'content_scripts/unlock_disabled.js'
  },
  {
    title: 'Highlight elements with same ID',
    id: 'Highlight elements with same ID',
    file: 'content_scripts/same_id.js'
  },
  {
    title: "Highlight  and show all 'display none' elements",
    id: "Highlight  and show all 'display none' elements",
    file: 'content_scripts/display_all_none.js'
  },
  {
    title: 'Clear all input restrictions',
    id: 'Clear all input restrictions',
    file: 'content_scripts/clear_all_input_restrictions.js'
  },
  {
    title: 'Change all inputs type from password to text',
    id: 'Change all inputs type from password to text',
    file: 'content_scripts/password_input_to_text.js'
  },
  {
    title: 'JSON prettier via console',
    id: 'JSON prettier via console',
    file: 'content_scripts/json_prettier_to_console.js'
  },
  {
    title: 'Timestamp to date',
    id: 'Timestamp to date',
    file: 'content_scripts/timestamp_to_date.js'
  },
  {
    title: 'Base64 decode and print to console',
    id: 'Base64 decode and print to console',
    file: 'content_scripts/base64_decode.js'
  },
  {
    title: 'Base64 encode and print to console',
    id: 'Base64 encode and print to console',
    file: 'content_scripts/base64_encode.js'
  },
  {
    title: 'Simple form filler - default site',
    id: 'Simple form filler - default site',
    file: 'content_scripts/simple_form_filler_defaultSite.js'
  },
  {
    title: 'Simple form filler - custom sites',
    id: 'Simple form filler - custom sites',
    file: 'content_scripts/simple_form_filler_customSites.js'
  },
  {
    title: 'Generate PESEL (18+)',
    id: 'Generate PESEL (18+)',
    file: 'content_scripts/pesel.js',
    contexts: ['page', 'selection', 'editable']
  },
  {
    title: 'Generate IBAN',
    id: 'Generate IBAN',
    file: 'content_scripts/iban.js',
    contexts: ['page', 'selection', 'editable']
  },
  {
    title: 'Generate ID number',
    id: 'Generate ID number',
    file: 'content_scripts/idnumber.js',
    contexts: ['page', 'selection', 'editable']
  },
  {
    title: 'Generate PASSPORT number',
    id: 'Generate PASSPORT number',
    file: 'content_scripts/passport_number.js',
    contexts: ['page', 'selection', 'editable']
  },
  {
    title: 'Generate valid PL mobile phone number',
    id: 'Generate valid PL mobile phone number',
    file: 'content_scripts/phoneNumber.js',
    contexts: ['page', 'selection', 'editable']
  },
  {
    title: 'Generate valid PL NIP',
    id: 'Generate valid PL NIP',
    file: 'content_scripts/nip.js',
    contexts: ['page', 'selection', 'editable']
  },
  {
    title: 'Generate valid PL REGON',
    id: 'Generate valid PL REGON',
    file: 'content_scripts/regon.js',
    contexts: ['page', 'selection', 'editable']
  },
  {
    title: 'Switch domain (finance.imobiliare.ro)',
    id: 'Switch domain',
    file: 'content_scripts/domain_switcher.js',
    contexts: ['all']
  }
]

try {
  chrome.runtime.onInstalled.addListener(() => {
    menuItems.forEach(({title, id, contexts = ['all'], file}) => {
      chrome.contextMenus.create({title, id, contexts})
    })
  })

  chrome.contextMenus.onClicked.addListener((event, tab) => {
    if (tab.id === -1 || tab.url.match('chrome://')) return

    const item = menuItems.find(({id}) => id === event.menuItemId)
    if (!item) return

    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: [item.file]
    })
  })
} catch (error) {
  console.error(error)
}

const commandActions = {
  'Simple form filler - default site': [
    'content_scripts/simple_form_filler_defaultSite.js'
  ],
  'Simple form filler - custom sites': [
    'content_scripts/simple_form_filler_customSites.js'
  ],
  'Remove all disabled attributes': ['content_scripts/unlock_disabled.js'],
  'Convert password input to text': ['content_scripts/password_input_to_text.js'],
  'Switch domain': ['content_scripts/domain_switcher.js']
}

try {
  chrome.commands.onCommand.addListener(command => {
    const files = commandActions[command]

    if (!files) return

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      const tab = tabs[0]

      if (!tab || tab.id === -1 || tab.url.match('chrome://')) return

      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files
      })
    })
  })
} catch (error) {
  console.log(error)
}
