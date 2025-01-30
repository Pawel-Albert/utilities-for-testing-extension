import {MenuItems} from './types/menu'

const menuItems: MenuItems = [
  {
    id: 'data-generators',
    title: 'Data Generators',
    contexts: ['all'],
    type: 'normal'
  },
  // Polish generators submenu
  {
    parentId: 'data-generators',
    id: 'pl-generators',
    title: 'Polish Data Generators',
    contexts: ['all'],
    type: 'normal'
  },
  {
    parentId: 'pl-generators',
    title: 'Generate PESEL',
    id: 'pesel-menu',
    contexts: ['editable']
  },
  {
    parentId: 'pesel-menu',
    title: 'Male (18+)',
    id: 'Generate PESEL Male',
    file: 'src/content_scripts/pesel_male.js',
    contexts: ['editable']
  },
  {
    parentId: 'pesel-menu',
    title: 'Female (18+)',
    id: 'Generate PESEL Female',
    file: 'src/content_scripts/pesel_female.js',
    contexts: ['editable']
  },
  {
    parentId: 'pesel-menu',
    title: 'Custom...',
    id: 'Generate PESEL Custom',
    file: 'src/content_scripts/pesel_custom.js',
    contexts: ['editable']
  },
  {
    parentId: 'pl-generators',
    title: 'Generate IBAN',
    id: 'Generate IBAN',
    file: 'src/content_scripts/iban.js',
    contexts: ['editable']
  },
  {
    parentId: 'pl-generators',
    title: 'Generate ID number',
    id: 'Generate ID number',
    file: 'src/content_scripts/idnumber.js',
    contexts: ['editable']
  },
  {
    parentId: 'pl-generators',
    title: 'Generate PASSPORT number',
    id: 'Generate PASSPORT number',
    file: 'src/content_scripts/passport_number.js',
    contexts: ['editable']
  },
  {
    parentId: 'pl-generators',
    title: 'Generate valid PL mobile phone',
    id: 'Generate valid PL mobile phone',
    file: 'src/content_scripts/phoneNumber.js',
    contexts: ['editable']
  },
  {
    parentId: 'pl-generators',
    title: 'Generate valid PL NIP',
    id: 'Generate valid PL NIP',
    file: 'src/content_scripts/nip.js',
    contexts: ['editable']
  },
  {
    parentId: 'pl-generators',
    title: 'Generate valid PL REGON',
    id: 'Generate valid PL REGON',
    file: 'src/content_scripts/regon.js',
    contexts: ['editable']
  },

  // Romanian generators submenu
  {
    parentId: 'data-generators',
    id: 'ro-generators',
    title: 'Romanian Data Generators',
    contexts: ['all'],
    type: 'normal'
  },
  {
    parentId: 'ro-generators',
    title: 'Generate CNP',
    id: 'cnp-menu',
    contexts: ['editable']
  },
  {
    parentId: 'cnp-menu',
    title: 'Male (18+)',
    id: 'Generate CNP Male',
    file: 'src/content_scripts/ro_cnp_male.js',
    contexts: ['editable']
  },
  {
    parentId: 'cnp-menu',
    title: 'Female (18+)',
    id: 'Generate CNP Female',
    file: 'src/content_scripts/ro_cnp_female.js',
    contexts: ['editable']
  },
  {
    parentId: 'cnp-menu',
    title: 'Custom...',
    id: 'Generate CNP Custom',
    file: 'src/content_scripts/ro_cnp.js',
    contexts: ['editable']
  },
  {
    parentId: 'ro-generators',
    title: 'Generate CUI',
    id: 'Generate CUI',
    file: 'src/content_scripts/ro_cui.js',
    contexts: ['editable']
  },
  {
    parentId: 'ro-generators',
    title: 'Generate Romanian Phone',
    id: 'Generate Romanian Phone',
    file: 'src/content_scripts/ro_phone.js',
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
    file: 'src/content_scripts/counter_string.js',
    contexts: ['editable']
  },
  {
    parentId: 'text-tools',
    title: 'Generate Lorem Ipsum',
    id: 'Generate Lorem Ipsum',
    file: 'src/content_scripts/lorem_ipsum.js',
    contexts: ['editable']
  },
  {
    parentId: 'text-tools',
    title: 'Multiply Text in Lines',
    id: 'Multiply Text in Lines',
    file: 'src/content_scripts/text_multiplier.js',
    contexts: ['editable']
  },
  {
    parentId: 'text-tools',
    title: 'Generate Text Pattern',
    id: 'Generate Text Pattern',
    file: 'src/content_scripts/text_pattern.js',
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
    file: 'src/content_scripts/unlock_disabled.js',
    contexts: ['all']
  },
  {
    parentId: 'form-tools',
    title: 'Clear all input restrictions',
    id: 'Clear all input restrictions',
    file: 'src/content_scripts/clear_all_input_restrictions.js',
    contexts: ['all']
  },
  {
    parentId: 'form-tools',
    title: 'Change all inputs type from password to text',
    id: 'Change all inputs type from password to text',
    file: 'src/content_scripts/password_input_to_text.js',
    contexts: ['all']
  },
  {
    parentId: 'form-tools',
    title: 'Highlight elements with same ID',
    id: 'Highlight elements with same ID',
    file: 'src/content_scripts/same_id.js',
    contexts: ['all']
  },
  {
    parentId: 'form-tools',
    title: "Highlight  and show all 'display none' elements",
    id: "Highlight  and show all 'display none' elements",
    file: 'src/content_scripts/display_all_none.js',
    contexts: ['all']
  },
  {
    parentId: 'form-tools',
    title: 'Display one hidden element',
    id: 'Display one hidden element',
    file: 'src/content_scripts/display_one_none.js',
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
    file: 'src/content_scripts/simple_form_filler_defaultSite.js',
    contexts: ['all']
  },
  {
    parentId: 'form-fillers',
    title: 'Simple form filler - custom sites',
    id: 'Simple form filler - custom sites',
    file: 'src/content_scripts/simple_form_filler_customSites.js',
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
    file: 'src/content_scripts/json_prettier_to_console.js',
    contexts: ['all']
  },
  {
    parentId: 'console-tools',
    title: 'Timestamp to date',
    id: 'Timestamp to date',
    file: 'src/content_scripts/timestamp_to_date.js',
    contexts: ['all']
  },
  {
    parentId: 'console-tools',
    title: 'Base64 decode and print to console',
    id: 'Base64 decode and print to console',
    file: 'src/content_scripts/base64_decode.js',
    contexts: ['all']
  },
  {
    parentId: 'console-tools',
    title: 'Base64 encode and print to console',
    id: 'Base64 encode and print to console',
    file: 'src/content_scripts/base64_encode.js',
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
    file: 'src/content_scripts/domain_switcher.js',
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

    await chrome.sidePanel.setPanelBehavior({
      openPanelOnActionClick: false
    })

    await chrome.sidePanel.setOptions({
      enabled: false
    })
  })

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab?.id) return

    const menuItem = menuItems.find(item => item.id === info.menuItemId)
    if (!menuItem?.file) return

    try {
      await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: [menuItem.file]
      })
    } catch (error) {
      console.error('Failed to execute script:', error)
    }
  })

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_MENU_ITEMS') {
      sendResponse(menuItems)
    }
  })
} catch (error) {
  console.error('Failed to initialize extension:', error)
}

const commandActions: Record<string, string[]> = {
  'Simple form filler - default site': [
    'src/content_scripts/simple_form_filler_defaultSite.js'
  ],
  'Simple form filler - custom sites': [
    'src/content_scripts/simple_form_filler_customSites.js'
  ],
  'Convert password input to text': ['src/content_scripts/password_input_to_text.js'],
  'Switch domain': ['src/content_scripts/domain_switcher.js']
}

try {
  chrome.commands.onCommand.addListener(command => {
    const files = commandActions[command]
    if (!files) return

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      const tab = tabs[0]
      if (!tab?.id || tab.id === -1 || tab.url?.match('chrome://')) return

      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files
      })
    })
  })
} catch (error) {
  console.error('Failed to initialize commands:', error)
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'unregisterScript') {
    try {
      await chrome.userScripts.unregister({ids: [message.scriptId]})
      console.log('Successfully unregistered script:', message.scriptId)
      sendResponse({success: true})
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to unregister script:', error)
        sendResponse({success: false, error: error.message})
      } else {
        console.error('Failed to unregister script with unknown error:', error)
        sendResponse({success: false, error: 'Unknown error occurred'})
      }
      return true
    }
  }
})
