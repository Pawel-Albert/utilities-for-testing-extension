chrome.runtime.onInstalled.addListener((_) => {
  chrome.contextMenus.create({
    title: "Remove all 'disabled' attributes",
    id: "Remove all 'disabled' attributes",
    contexts: ["page", "selection", "editable"],
  });

  chrome.contextMenus.create({
    title: "Highlight elements with same ID",
    id: "Highlight elements with same ID",
    contexts: ["page", "selection", "editable"],
  });

  chrome.contextMenus.create({
    title: "Highlight  and show all 'display none' elements",
    id: "Highlight  and show all 'display none' elements",
    contexts: ["page", "selection", "editable"],
  });

  chrome.contextMenus.create({
    title: "Highlight  and show one 'display none' element",
    id: "Highlight  and show one 'display none' element",
    contexts: ["page", "selection", "editable"],
  });

  chrome.contextMenus.create({
    title: "Clear_all_input_restrictions",
    id: "Clear_all_input_restrictions",
    contexts: ["page", "selection", "editable"],
  });

  chrome.contextMenus.create({
    title: "JSON prettier via console",
    id: "JSON prettier via console",
    contexts: ["page", "selection", "editable"],
  });

  chrome.contextMenus.create({
    title: "Timestamp to date via console",
    id: "Timestamp to date via console",
    contexts: ["page", "selection", "editable"],
  });

  chrome.contextMenus.create({
    title: "Base64 decode and print to console",
    id: "Base64 decode and print to console",
    contexts: ["page", "selection", "editable"],
  });

  chrome.contextMenus.create({
    title: "Base64 encode and print to console",
    id: "Base64 encode and print to console",
    contexts: ["page", "selection", "editable"],
  });
  chrome.contextMenus.create({
    title: "Generate PESEL (18+)",
    id: "Generate PESEL (18+)",
    contexts: ["page", "selection", "editable"],
  });

  chrome.contextMenus.create({
    title: "Generate IBAN",
    id: "Generate IBAN",
    contexts: ["page", "selection", "editable"],
  });

  chrome.contextMenus.create({
    title: "Generate ID number",
    id: "Generate ID number",
    contexts: ["page", "selection", "editable"],
  });
});

chrome.contextMenus.onClicked.addListener((event, tab) => {
  if (event.menuItemId === "Remove all 'disabled' attributes") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["unlock_disabled.js"],
    });
  }
  if (event.menuItemId === "Generate PESEL (18+)") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["pesel.js"],
    });
  }
  if (event.menuItemId === "Generate IBAN") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["iban.js"],
    });
  }
  if (event.menuItemId === "Generate ID number") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["idnumber.js"],
    });
  }
  if (event.menuItemId === "Highlight elements with same ID") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["same_id.js"],
    });
  }

  if (event.menuItemId === "Highlight  and show all 'display none' elements") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["display_all_none.js"],
    });
  }

  if (event.menuItemId === "Highlight  and show one 'display none' element") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["display_one_none.js"],
    });
  }

  if (event.menuItemId === "JSON prettier via console") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["json_prettier_to_console.js"],
    });
  }
  if (event.menuItemId === "Clear_all_input_restrictions") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["clear_all_input_restrictions.js"],
    });
  }
  if (event.menuItemId === "Timestamp to date via console") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["timestamp_to_date.js"],
    });
  }

  if (event.menuItemId === "Base64 decode and print to console") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["base64_decode.js"],
    });
  }

  if (event.menuItemId === "Base64 encode and print to console") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["base64_encode.js"],
    });
  }
});
