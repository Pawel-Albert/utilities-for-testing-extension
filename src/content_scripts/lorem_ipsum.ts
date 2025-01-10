import {setNativeValue} from '../utils/helpers'
import {defaultSettings} from './config/defaults'
;(() => {
  const loremText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

  const generateLorem = (length: number): string => {
    let result = ''
    while (result.length < length) {
      result += loremText + ' '
    }
    return result.substring(0, length)
  }

  chrome.storage.sync.get(
    {defaultLoremLength: defaultSettings.defaultLoremLength},
    items => {
      const lengthInput = prompt(
        'Enter Lorem Ipsum length:',
        items.defaultLoremLength?.toString()
      )
      const length = lengthInput ? parseInt(lengthInput) : null

      if (length) {
        const result = generateLorem(length)
        console.log(
          '%c Lorem Ipsum Generator',
          'font-family:monospace; color:#2ecc71; font-size:16px; font-weight:bold;'
        )
        console.log(
          `%c Length: ${result.length}`,
          'font-family:monospace; color:#3498db; font-size:14px;'
        )
        console.log(
          '%c Result:',
          'font-family:monospace; color:#e74c3c; font-size:14px;',
          result
        )

        const indicatedElement = document.querySelector(':focus') as HTMLElement | null
        if (indicatedElement) {
          setNativeValue(indicatedElement, result)
          indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
        }
      }
    }
  )
})()
