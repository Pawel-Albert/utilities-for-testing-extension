import {setNativeValue} from '../utilis/helpers'
import {generateNip} from './custom_generators_logic/nip_core'
;(() => {
  try {
    const nip = generateNip()
    console.info(`Iban: ${nip}`)

    const indicatedElement = document.querySelector(':focus')
    setNativeValue(indicatedElement, nip)
    indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
  } catch (err) {
    console.error(`Error: ${err.message}`)
  }
})()
