import {setNativeValue} from '../utils/helpers'
import {generateIban} from './custom_generators_logic/iban_core'
;(() => {
  try {
    const iban = generateIban()
    console.info(`Iban: ${iban}`)

    const indicatedElement = document.querySelector(':focus') as HTMLElement | null
    if (indicatedElement) {
      setNativeValue(indicatedElement, iban)
      indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
})()
