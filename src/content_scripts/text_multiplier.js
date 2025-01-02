import {setNativeValue} from '../utilis/helpers.ts'
import {defaultSettings} from './config/defaults.ts'
;(() => {
  const multiplyText = (text, lines, lineLength) => {
    const result = []
    const fillChar = '.'

    for (let i = 0; i < lines; i++) {
      let line = ''
      while (line.length < lineLength) {
        const nextPart = line.length === 0 ? text : ` ${text}`
        if (line.length + nextPart.length > lineLength) {
          const remaining = lineLength - line.length
          line += fillChar.repeat(remaining)
          break
        }
        line += nextPart
      }
      result.push(line)
    }
    return result.join('\n')
  }

  chrome.storage.sync.get(
    {
      defaultMultiplierText: defaultSettings.defaultMultiplierText,
      defaultMultiplierLines: defaultSettings.defaultMultiplierLines,
      defaultMultiplierLength: defaultSettings.defaultMultiplierLength
    },
    items => {
      const text = prompt('Enter text to multiply:', items.defaultMultiplierText)
      if (text) {
        const lines = parseInt(prompt('Number of lines:', items.defaultMultiplierLines))
        const lineLength = parseInt(
          prompt('Length of each line:', items.defaultMultiplierLength)
        )

        if (lines && lineLength) {
          const result = multiplyText(text, lines, lineLength)
          console.log(
            '%c Text Multiplier',
            'font-family:monospace; color:#f1c40f; font-size:16px; font-weight:bold;'
          )
          console.log(
            `%c Configuration: ${lines} lines, ${lineLength} chars per line`,
            'font-family:monospace; color:#3498db; font-size:14px;'
          )
          console.log(
            '%c Total length:',
            'font-family:monospace; color:#e74c3c; font-size:14px;',
            result.length
          )
          console.log(
            '%c Sample (first line):',
            'font-family:monospace; color:#2ecc71; font-size:14px;',
            result.split('\n')[0]
          )

          const indicatedElement = document.querySelector(':focus')
          if (indicatedElement) {
            setNativeValue(indicatedElement, result)
            indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
          }
        }
      }
    }
  )
})()
