import {setNativeValue} from '../utils/helpers'
import {generateNlIdCardNumber} from './custom_generators_logic/nl/idCardGenerator'
;(() => {
  try {
    const idNumber = generateNlIdCardNumber()
    console.info(`Dutch ID card number: ${idNumber}`)

    const indicatedElement = document.querySelector(':focus') as HTMLElement | null
    if (indicatedElement) {
      setNativeValue(indicatedElement, idNumber)
      indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
})()

