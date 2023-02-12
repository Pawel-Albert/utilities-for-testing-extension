import {setNativeValue} from '../utylis/helpers'
import {generateIban} from './custom_generators_logic/iban_core'
;(() => {
  try {
    const iban = generateIban()
    console.info(`Iban: ${iban}`)

    const indicatedElement = document.querySelector(':focus')
    setNativeValue(indicatedElement, iban)
    indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
  } catch (err) {
    console.error(`Error: ${err.message}`)
  }
})()
