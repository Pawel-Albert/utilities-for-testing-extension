import {setNativeValue} from '../utilis/helpers'
import {generateIdNumber} from './custom_generators_logic/idnumber_core'
;(() => {
  try {
    const idNumber = generateIdNumber()
    console.info(`Id num: ${idNumber}`)

    const indicatedElement = document.querySelector(':focus') as HTMLElement | null
    if (indicatedElement) {
      setNativeValue(indicatedElement, idNumber)
      indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
})()
