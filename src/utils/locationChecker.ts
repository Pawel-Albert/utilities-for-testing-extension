interface LocationCheckResult {
  isChromePage: boolean
  currentUrl: string
  matchesPattern?: boolean
  tabId?: number
}

export function checkUrlAgainstPattern(url: string, pattern: string): boolean {
  const patterns = pattern.split('|').map(p => p.trim())
  return patterns.some(pattern => {
    const regex = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/\?/g, '.')
    return new RegExp(regex).test(url)
  })
}

export async function checkLocation(pattern?: string): Promise<LocationCheckResult> {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
  const currentUrl = tab?.url || ''
  const isChromePage =
    currentUrl.startsWith('chrome://') || currentUrl.startsWith('chrome-extension://')

  const result: LocationCheckResult = {
    isChromePage,
    currentUrl,
    tabId: tab?.id
  }

  if (pattern) {
    result.matchesPattern = checkUrlAgainstPattern(currentUrl, pattern)
  }

  return result
}

export async function initializeLocationChecker(
  onLocationUpdate?: (result: LocationCheckResult) => void
) {
  async function updateUI() {
    const result = await checkLocation()
    const warning = document.getElementById('locationWarning')
    const urlDisplay = document.getElementById('currentUrl')

    if (warning && urlDisplay) {
      if (result.isChromePage) {
        warning.style.display = 'block'
        urlDisplay.textContent = result.currentUrl
      } else {
        warning.style.display = 'none'
      }
    }

    if (onLocationUpdate) {
      onLocationUpdate(result)
    }
  }

  await updateUI()
  setInterval(updateUI, 1000)
}
