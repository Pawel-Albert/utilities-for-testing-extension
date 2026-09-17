import {generateBsn} from './custom_generators_logic/nl/bsnGenerator'
import {setNativeValue} from '../utils/helpers'
;(() => {
  try {
    const bsn = generateBsn('female', {minAge: 18})
    console.info(`Generated female BSN (18+): ${bsn}`)

    const indicatedElement = document.querySelector(':focus') as HTMLElement | null
    if (indicatedElement) {
      setNativeValue(indicatedElement, bsn)
      indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
    alert((err as Error).message)
  }
})()

