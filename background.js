chrome.runtime.onInstalled.addListener((_) => {
  chrome.contextMenus.create({
    title: "Remove disabled attribute",
    id: "Remove disabled attribute",
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
    title: "Pesel_Adult",
    id: "Pesel_Adult",
    contexts: ["page", "selection", "editable"],
  });

  chrome.contextMenus.create({
    title: "Iban",
    id: "Iban",
    contexts: ["page", "selection", "editable"],
  });

  chrome.contextMenus.create({
    title: "IdNumber",
    id: "IdNumber",
    contexts: ["page", "selection", "editable"],
  });
});

chrome.contextMenus.onClicked.addListener((event, tab) => {
  if (event.menuItemId === "Remove disabled attribute") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["unlock_disabled.js"],
    });
  }
  if (event.menuItemId === "Pesel_Adult") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["pesel.js"],
    });
  }
  if (event.menuItemId === "Iban") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["iban.js"],
    });
  }
  if (event.menuItemId === "IdNumber") {
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
});
