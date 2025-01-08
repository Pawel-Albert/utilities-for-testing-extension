import {setNativeValue} from '../utils/helpers'
import {generateRegon} from './custom_generators_logic/regon_core'
;(() => {
  try {
    const regon = generateRegon()
    console.info(`REGON: ${regon}`)

    const indicatedElement = document.querySelector(':focus') as HTMLElement | null
    if (indicatedElement) {
      setNativeValue(indicatedElement, regon)
      indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
})()
