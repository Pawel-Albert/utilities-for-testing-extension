import {generateBsn} from './custom_generators_logic/nl/bsnGenerator'
import {setNativeValue} from '../utils/helpers'
;(() => {
  try {
    const sex = prompt('Enter sex (male/female):', 'male')
    if (sex === null) {
      throw new Error('Operation cancelled')
    }
    if (!sex || !['male', 'female'].includes(sex)) {
      throw new Error('Invalid sex value')
    }

    // Note: BSN does not contain date of birth or age information
    // The sex parameter is kept for API consistency but is not used in generation
    const bsn = generateBsn(sex as 'male' | 'female', {})
    console.info(`Custom BSN (${sex}): ${bsn}`)

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

