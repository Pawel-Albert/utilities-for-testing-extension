import {generateCnp} from './custom_generators_logic/ro/cnpGenerator'
import {setNativeValue} from '../utils/helpers'
;(() => {
  try {
    const cnp = generateCnp('male', {minAge: 18})
    console.info(`Generated male CNP (18+): ${cnp}`)

    const indicatedElement = document.querySelector(':focus') as HTMLElement | null
    if (indicatedElement) {
      setNativeValue(indicatedElement, cnp)
      indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
    alert((err as Error).message)
  }
})()
