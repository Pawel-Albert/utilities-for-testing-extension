import {generateCui} from './custom_generators_logic/ro/cuiGenerator'
import {setNativeValue} from '../utils/helpers'
;(() => {
  try {
    const vatResponse = prompt(
      'Add RO prefix for VAT payer? (y/n):\n' +
        'y - with RO prefix (ROxxxxxxxx)\n' +
        'n - without prefix (xxxxxxxx)',
      'n'
    )

    if (!vatResponse) {
      throw new Error('Operation cancelled')
    }

    const response = vatResponse.toLowerCase()
    if (!['y', 'n'].includes(response)) {
      throw new Error('Invalid response. Please enter y or n')
    }

    const isVatPayer = response === 'y'
    const cui = generateCui({isVatPayer})
    console.info(
      `Generated CUI: ${cui}\n` + `Options: ${JSON.stringify({isVatPayer}, null, 2)}`
    )

    const indicatedElement = document.querySelector(':focus') as HTMLElement | null
    if (indicatedElement) {
      setNativeValue(indicatedElement, cui)
      indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
    alert((err as Error).message)
  }
})()
