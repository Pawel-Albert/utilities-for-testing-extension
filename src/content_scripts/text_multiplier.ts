import {setNativeValue} from '../utilis/helpers'
import {defaultSettings} from './config/defaults'
;(() => {
  chrome.storage.sync.get(
    {
      defaultMultiplierText: defaultSettings.defaultMultiplierText,
      defaultMultiplierLines: defaultSettings.defaultMultiplierLines,
      defaultMultiplierLength: defaultSettings.defaultMultiplierLength
    },
    items => {
      const text = prompt(
        'Enter text to multiply:',
        items.defaultMultiplierText?.toString()
      )
      if (!text) return

      const linesInput = prompt(
        'Enter number of lines:',
        items.defaultMultiplierLines?.toString()
      )
      const lines = linesInput ? parseInt(linesInput) : null
      if (!lines) return

      const lineLengthInput = prompt(
        'Enter line length:',
        items.defaultMultiplierLength?.toString()
      )
      const lineLength = lineLengthInput ? parseInt(lineLengthInput) : null
      if (!lineLength) return

      const result = Array(lines)
        .fill(text)
        .map(line => {
          let result = ''
          while (result.length < lineLength) {
            result += line + ' '
          }
          return result.substring(0, lineLength)
        })
        .join('\n')

      console.log(
        '%c Text Multiplier',
        'font-family:monospace; color:#2ecc71; font-size:16px; font-weight:bold;'
      )
      console.log(
        `%c Lines: ${lines}, Line length: ${lineLength}`,
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
  )
})()
