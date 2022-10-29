chrome.runtime.onInstalled.addListener((_) => {
  chrome.contextMenus.create({
    title: "Unlock_disabled",
    id: "Unlock_disabled",
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
  if (event.menuItemId === "Unlock_disabled") {
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
});
