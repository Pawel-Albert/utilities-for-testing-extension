import {setNativeValue} from '../utilis/helpers'
import {generateRegon} from './custom_generators_logic/regon_core'
;(() => {
  try {
    const regon = generateRegon()
    console.info(`Iban: ${regon}`)

    const indicatedElement = document.querySelector(':focus')
    setNativeValue(indicatedElement, regon)
    indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
  } catch (err) {
    console.error(`Error: ${err.message}`)
  }
})()
