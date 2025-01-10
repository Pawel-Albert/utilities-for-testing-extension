import {setNativeValue} from '../utils/helpers'
import {defaultSettings} from './config/defaults'
;(() => {
  const reverseString = (str: string): string => str.split('').reverse().join('')

  const getCounterString = (count: number): string => {
    let counterString = ''

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
      const countInput = prompt(
        'Enter Counter String length:',
        items.defaultCounterLength?.toString()
      )
      const count = countInput ? parseInt(countInput) : null

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

        const indicatedElement = document.querySelector(':focus') as HTMLElement | null
        if (indicatedElement) {
          setNativeValue(indicatedElement, result)
          indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
        }
      }
    }
  )
})()
