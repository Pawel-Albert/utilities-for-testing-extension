import {setNativeValue} from '../utils/helpers'
import {generatePassportNumber} from './custom_generators_logic/passport_number_core'
;(() => {
  try {
    const passportNumber = generatePassportNumber()
    console.info(`Passport num: ${passportNumber}`)

    const indicatedElement = document.querySelector(':focus') as HTMLElement | null
    if (indicatedElement) {
      setNativeValue(indicatedElement, passportNumber)
      indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
})()
