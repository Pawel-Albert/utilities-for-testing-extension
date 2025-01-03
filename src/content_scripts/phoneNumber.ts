import {setNativeValue} from '../utilis/helpers'
import {generatePolishMobile} from './custom_generators_logic/generatePolishMobile'
;(() => {
  try {
    const phoneNumber = generatePolishMobile()
    console.info(`Phone num: ${phoneNumber}`)

    const indicatedElement = document.querySelector(':focus') as HTMLElement | null
    if (indicatedElement) {
      setNativeValue(indicatedElement, phoneNumber)
      indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
})()
