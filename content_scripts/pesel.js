import {generatePesel, sex} from './custom_generators_logic/pesel_core.js'
import {setNativeValue} from '../utylis/helpers.js'
;(() => {
  try {
    const pesel = generatePesel(sex)
    console.info(`Pesel: ${pesel}`)

    const indicatedElement = document.querySelector(':focus')
    setNativeValue(indicatedElement, pesel)
    indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
  } catch (err) {
    console.error(`Error: ${err.message}`)
  }
})()
