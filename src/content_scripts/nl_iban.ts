import {setNativeValue} from '../utils/helpers'
import {generateNlIban} from './custom_generators_logic/nl/ibanGenerator'
;(() => {
  try {
    const iban = generateNlIban()
    console.info(`Dutch IBAN: ${iban}`)

    const indicatedElement = document.querySelector(':focus') as HTMLElement | null
    if (indicatedElement) {
      setNativeValue(indicatedElement, iban)
      indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
})()

