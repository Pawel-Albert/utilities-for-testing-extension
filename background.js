chrome.runtime.onInstalled.addListener(_ => {
  chrome.contextMenus.create({
    title: "Remove all 'disabled' attributes",
    id: "Remove all 'disabled' attributes",
    contexts: ['all']
  })

  chrome.contextMenus.create({
    title: 'Highlight elements with same ID',
    id: 'Highlight elements with same ID',
    contexts: ['all']
  })

  chrome.contextMenus.create({
    title: "Highlight  and show all 'display none' elements",
    id: "Highlight  and show all 'display none' elements",
    contexts: ['all']
  })
  chrome.contextMenus.create({
    title: 'Clear all input restrictions',
    id: 'Clear all input restrictions',
    contexts: ['all']
  })

  chrome.contextMenus.create({
    title: 'Change all inputs type from password to text',
    id: 'Change all inputs type from password to text',
    contexts: ['all']
  })

  chrome.contextMenus.create({
    title: 'JSON prettier via console',
    id: 'JSON prettier via console',
    contexts: ['all']
  })

  chrome.contextMenus.create({
    title: 'Timestamp to date',
    id: 'Timestamp to date',
    contexts: ['all']
  })

  chrome.contextMenus.create({
    title: 'Base64 decode and print to console',
    id: 'Base64 decode and print to console',
    contexts: ['all']
  })

  chrome.contextMenus.create({
    title: 'Base64 encode and print to console',
    id: 'Base64 encode and print to console',
    contexts: ['all']
  })

  chrome.contextMenus.create({
    title: 'Simple form filler',
    id: 'Simple form filler',
    contexts: ['all']
  })

  chrome.contextMenus.create({
    title: 'Generate PESEL (18+)',
    id: 'Generate PESEL (18+)',
    contexts: ['page', 'selection', 'editable']
  })

  chrome.contextMenus.create({
    title: 'Generate IBAN',
    id: 'Generate IBAN',
    contexts: ['page', 'selection', 'editable']
  })

  chrome.contextMenus.create({
    title: 'Generate ID number',
    id: 'Generate ID number',
    contexts: ['page', 'selection', 'editable']
  })

  chrome.contextMenus.create({
    title: 'Generate PASSPORT number',
    id: 'Generate PASSPORT number',
    contexts: ['page', 'selection', 'editable']
  })
})

try {
  chrome.contextMenus.onClicked.addListener((event, tab) => {
    if (tab.id === -1 || tab.url.match('chrome://')) return
    if (event.menuItemId === "Remove all 'disabled' attributes") {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/unlock_disabled.js']
      })
    }
    if (event.menuItemId === 'Generate PESEL (18+)') {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/pesel.js']
      })
    }
    if (event.menuItemId === 'Generate IBAN') {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/iban.js']
      })
    }
    if (event.menuItemId === 'Generate ID number') {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/idnumber.js']
      })
    }
    if (event.menuItemId === 'Highlight elements with same ID') {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/same_id.js']
      })
    }

    if (event.menuItemId === "Highlight  and show all 'display none' elements") {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/display_all_none.js']
      })
    }

    if (event.menuItemId === 'JSON prettier via console') {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/json_prettier_to_console.js']
      })
    }
    if (event.menuItemId === 'Clear all input restrictions') {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/clear_all_input_restrictions.js']
      })
    }
    if (event.menuItemId === 'Timestamp to date') {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/timestamp_to_date.js']
      })
    }

    if (event.menuItemId === 'Base64 decode and print to console') {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/base64_decode.js']
      })
    }

    if (event.menuItemId === 'Base64 encode and print to console') {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/base64_encode.js']
      })
    }

    if (event.menuItemId === 'Generate PASSPORT number') {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/passport_number.js']
      })
    }

    if (event.menuItemId === 'Simple form filler') {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/simple_form_filler.js']
      })
    }
    if (event.menuItemId === 'Change all inputs type from password to text') {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/password_input_to_text.js']
      })
    }
  })
} catch (err) {
  console.log(err)
}

try {
  chrome.commands.onCommand.addListener((command, tab) => {
    if (tab.id === -1 || tab.url.match('chrome://')) return
    if (command === 'Simple form filler') {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/simple_form_filler.js']
      })
    }
    if (command === 'Simple form filler EN') {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/simple_form_filler_en.js']
      })
    }
    if (command === 'Remove all disabled attributes') {
      console.log(`testes`)
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content_scripts/unlock_disabled.js']
      })
    }
  })
} catch (error) {
  console.log(error)
}
