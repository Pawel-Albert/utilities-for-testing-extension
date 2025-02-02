import {generateRoPhone} from './custom_generators_logic/ro/phoneGenerator'
import {setNativeValue} from '../utils/helpers'
;(() => {
  try {
    const formatResponse = prompt(
      'Use international format? (y/n):\n' +
        'y - international format (+407xxxxxxxx)\n' +
        'n - national format (7xxxxxxxx)',
      'n'
    )

    if (!formatResponse) {
      throw new Error('Operation cancelled')
    }

    const response = formatResponse.toLowerCase()
    if (!['y', 'n'].includes(response)) {
      throw new Error('Invalid response. Please enter y or n')
    }

    const internationalFormat = response === 'y'
    const phone = generateRoPhone({internationalFormat})
    console.info(
      `Generated Romanian phone number: ${phone}\n` +
        `Options: ${JSON.stringify({internationalFormat}, null, 2)}`
    )

    const indicatedElement = document.querySelector(':focus') as HTMLElement | null
    if (indicatedElement) {
      setNativeValue(indicatedElement, phone)
      indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
    alert((err as Error).message)
  }
})()
