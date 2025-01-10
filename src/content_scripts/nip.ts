import {setNativeValue} from '../utils/helpers'
import {generateNip} from './custom_generators_logic/nip_core'
;(() => {
  try {
    const nip = generateNip()
    console.info(`NIP: ${nip}`)

    const indicatedElement = document.querySelector(':focus') as HTMLElement | null
    if (indicatedElement) {
      setNativeValue(indicatedElement, nip)
      indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
})()
