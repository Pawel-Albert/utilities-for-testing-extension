import {defaultSettings} from './content_scripts/config/defaults.js'

const menuItems = [
  {
    id: 'data-generators',
    title: 'Data Generators',
    contexts: ['all'],
    type: 'normal'
  },
  {
    parentId: 'data-generators',
    title: 'Generate PESEL (18+)',
    id: 'Generate PESEL (18+)',
    file: 'content_scripts/pesel.js',
    contexts: ['editable']
  },
  {
    parentId: 'data-generators',
    title: 'Generate IBAN',
    id: 'Generate IBAN',
    file: 'content_scripts/iban.js',
    contexts: ['editable']
  },
  {
    parentId: 'data-generators',
    title: 'Generate ID number',
    id: 'Generate ID number',
    file: 'content_scripts/idnumber.js',
    contexts: ['editable']
  },
  {
    parentId: 'data-generators',
    title: 'Generate PASSPORT number',
    id: 'Generate PASSPORT number',
    file: 'content_scripts/passport_number.js',
    contexts: ['editable']
  },
  {
    parentId: 'data-generators',
    title: 'Generate valid PL mobile phone',
    id: 'Generate valid PL mobile phone',
    file: 'content_scripts/phoneNumber.js',
    contexts: ['editable']
  },
  {
    parentId: 'data-generators',
    title: 'Generate valid PL NIP',
    id: 'Generate valid PL NIP',
    file: 'content_scripts/nip.js',
    contexts: ['editable']
  },
  {
    parentId: 'data-generators',
    title: 'Generate valid PL REGON',
    id: 'Generate valid PL REGON',
    file: 'content_scripts/regon.js',
    contexts: ['editable']
  },

  {
    id: 'text-tools',
    title: 'Text Tools',
    contexts: ['all'],
    type: 'normal'
  },
  {
    parentId: 'text-tools',
    title: 'Generate Counter String',
    id: 'Generate Counter String',
    file: 'content_scripts/counter_string.js',
    contexts: ['editable']
  },
  {
    parentId: 'text-tools',
    title: 'Generate Lorem Ipsum',
    id: 'Generate Lorem Ipsum',
    file: 'content_scripts/lorem_ipsum.js',
    contexts: ['editable']
  },
  {
    parentId: 'text-tools',
    title: 'Multiply Text in Lines',
    id: 'Multiply Text in Lines',
    file: 'content_scripts/text_multiplier.js',
    contexts: ['editable']
  },
  {
    parentId: 'text-tools',
    title: 'Generate Text Pattern',
    id: 'Generate Text Pattern',
    file: 'content_scripts/text_pattern.js',
    contexts: ['editable']
  },

  {
    id: 'form-tools',
    title: 'Form Tools',
    contexts: ['all'],
    type: 'normal'
  },
  {
    parentId: 'form-tools',
    title: "Remove all 'disabled' attributes",
    id: "Remove all 'disabled' attributes",
    file: 'content_scripts/unlock_disabled.js',
    contexts: ['all']
  },
  {
    parentId: 'form-tools',
    title: 'Clear all input restrictions',
    id: 'Clear all input restrictions',
    file: 'content_scripts/clear_all_input_restrictions.js',
    contexts: ['all']
  },
  {
    parentId: 'form-tools',
    title: 'Change all inputs type from password to text',
    id: 'Change all inputs type from password to text',
    file: 'content_scripts/password_input_to_text.js',
    contexts: ['all']
  },
  {
    parentId: 'form-tools',
    title: 'Highlight elements with same ID',
    id: 'Highlight elements with same ID',
    file: 'content_scripts/same_id.js',
    contexts: ['all']
  },
  {
    parentId: 'form-tools',
    title: "Highlight  and show all 'display none' elements",
    id: "Highlight  and show all 'display none' elements",
    file: 'content_scripts/display_all_none.js',
    contexts: ['all']
  },

  {
    id: 'form-fillers',
    title: 'Form Fillers',
    contexts: ['all'],
    type: 'normal'
  },
  {
    parentId: 'form-fillers',
    title: 'Simple form filler - default site',
    id: 'Simple form filler - default site',
    file: 'content_scripts/simple_form_filler_defaultSite.js',
    contexts: ['all']
  },
  {
    parentId: 'form-fillers',
    title: 'Simple form filler - custom sites',
    id: 'Simple form filler - custom sites',
    file: 'content_scripts/simple_form_filler_customSites.js',
    contexts: ['all']
  },

  {
    id: 'console-tools',
    title: 'Console Tools',
    contexts: ['all'],
    type: 'normal'
  },
  {
    parentId: 'console-tools',
    title: 'JSON prettier via console',
    id: 'JSON prettier via console',
    file: 'content_scripts/json_prettier_to_console.js',
    contexts: ['all']
  },
  {
    parentId: 'console-tools',
    title: 'Timestamp to date',
    id: 'Timestamp to date',
    file: 'content_scripts/timestamp_to_date.js',
    contexts: ['all']
  },
  {
    parentId: 'console-tools',
    title: 'Base64 decode and print to console',
    id: 'Base64 decode and print to console',
    file: 'content_scripts/base64_decode.js',
    contexts: ['all']
  },
  {
    parentId: 'console-tools',
    title: 'Base64 encode and print to console',
    id: 'Base64 encode and print to console',
    file: 'content_scripts/base64_encode.js',
    contexts: ['all']
  },

  {
    id: 'domain-tools',
    title: 'Domain Tools',
    contexts: ['all'],
    type: 'normal'
  },
  {
    parentId: 'domain-tools',
    title: 'Switch domain (finance.imobiliare.ro)',
    id: 'Switch domain',
    file: 'content_scripts/domain_switcher.js',
    contexts: ['all']
  },
  {
    type: 'separator',
    id: 'separator-1',
    contexts: ['all']
  }
]

try {
  chrome.runtime.onInstalled.addListener(async () => {
    menuItems.forEach(({title, id, contexts, type = 'normal', parentId}) => {
      chrome.contextMenus.create({title, id, contexts, type, parentId})
    })
  })

  chrome.contextMenus.onClicked.addListener((event, tab) => {
    if (tab.id === -1 || tab.url.match('chrome://')) return

    const item = menuItems.find(({id}) => id === event.menuItemId)
    if (!item || !item.file) return

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
