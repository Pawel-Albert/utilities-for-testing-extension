import {setNativeValue} from '../utils/helpers'
import {generateNlDebtorNumber} from './custom_generators_logic/nl/debtorNumberGenerator'
;(() => {
  try {
    const debtorNumber = generateNlDebtorNumber()
    console.info(`Dutch debtor number: ${debtorNumber}`)

    const indicatedElement = document.querySelector(':focus') as HTMLElement | null
    if (indicatedElement) {
      setNativeValue(indicatedElement, debtorNumber)
      indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
})()

