document.getElementById('openOptions').onclick = () => {
  chrome.runtime.openOptionsPage()
}

document.getElementById('openSelectors').onclick = () => {
  chrome.tabs.create({url: 'src/pages/selectors/selectors.html'})
}
