import {setNativeValue} from '../utilis/helpers.js'
import {defaultSettings} from './config/defaults.js'
;(() => {
  const reverseString = str => str.split('').reverse().join('')

  const getCounterString = count => {
    let counterString = ''
    count = parseInt(count)

    while (count > 0) {
      const appendThis = '*' + reverseString(count.toString())

      if (appendThis.length > count) {
        counterString += appendThis.substring(0, count)
      } else {
        counterString += appendThis
      }

      count -= appendThis.length
    }

    return reverseString(counterString)
  }

  chrome.storage.sync.get(
    {defaultCounterLength: defaultSettings.defaultCounterLength},
    items => {
      const count = prompt('Enter Counter String length:', items.defaultCounterLength)
      if (count) {
        const result = getCounterString(count)
        console.log(
          '%c Counter String Generator',
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

        const indicatedElement = document.querySelector(':focus')
        if (indicatedElement) {
          setNativeValue(indicatedElement, result)
          indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
        }
      }
    }
  )
})()
