import {generatePesel} from './custom_generators_logic/pesel_core'
import {setNativeValue} from '../utils/helpers'
;(() => {
  try {
    const pesel = generatePesel('female', {minAge: 18, maxAge: 100})
    console.info(`Female PESEL: ${pesel}`)

    const indicatedElement = document.querySelector(':focus') as HTMLElement | null
    if (indicatedElement) {
      setNativeValue(indicatedElement, pesel)
      indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
})()
