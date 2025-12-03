import {setNativeValue} from '../utils/helpers'
import {generateNlPassportNumber} from './custom_generators_logic/nl/passportGenerator'
;(() => {
  try {
    const passportNumber = generateNlPassportNumber()
    console.info(`Dutch passport number: ${passportNumber}`)

    const indicatedElement = document.querySelector(':focus') as HTMLElement | null
    if (indicatedElement) {
      setNativeValue(indicatedElement, passportNumber)
      indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
})()

