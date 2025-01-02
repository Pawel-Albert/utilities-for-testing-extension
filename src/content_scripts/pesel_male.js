import {generatePesel} from './custom_generators_logic/pesel_core.js'
import {setNativeValue} from '../utilis/helpers.js'
;(() => {
  try {
    const pesel = generatePesel('male', {minAge: 18, maxAge: 100})
    console.info(`Male PESEL: ${pesel}`)

    const indicatedElement = document.querySelector(':focus')
    setNativeValue(indicatedElement, pesel)
    indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
  } catch (err) {
    console.error(`Error: ${err.message}`)
  }
})()
