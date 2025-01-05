const openOptionsButton = document.getElementById('openOptions')
if (openOptionsButton) {
  openOptionsButton.onclick = () => {
    chrome.runtime.openOptionsPage()
  }
}

const openSelectorsButton = document.getElementById('openSelectors')
if (openSelectorsButton) {
  openSelectorsButton.onclick = () => {
    chrome.tabs.create({url: chrome.runtime.getURL('src/pages/selectors/selectors.html')})
  }
}

const openScriptsButton = document.getElementById('openScripts')
if (openScriptsButton) {
  openScriptsButton.onclick = () => {
    chrome.tabs.create({url: chrome.runtime.getURL('src/pages/scripts/scripts.html')})
  }
}

document.getElementById('openSidePanel')?.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
    if (!tab?.windowId) return

    await chrome.sidePanel.setOptions({
      enabled: true,
      path: 'src/pages/user-scripts/panel.html'
    })
    await chrome.sidePanel.open({windowId: tab.windowId})
  } catch (error) {
    console.error('Failed to open side panel:', error)
  }
})
