import {generateNlPhone} from './custom_generators_logic/nl/phoneGenerator'
import {setNativeValue} from '../utils/helpers'
;(() => {
  try {
    const formatResponse = prompt(
      'Use international format? (y/n):\n' +
        'y - international format (+316xxxxxxxx or +3120xxxxxxxx)\n' +
        'n - national format (06xxxxxxxx or 020xxxxxxxx)',
      'n'
    )

    if (!formatResponse) {
      throw new Error('Operation cancelled')
    }

    const response = formatResponse.toLowerCase()
    if (!['y', 'n'].includes(response)) {
      throw new Error('Invalid response. Please enter y or n')
    }

    const phoneTypeResponse = prompt(
      'Phone type? (mobile/landline):\n' +
        'mobile - mobile number (06xxxxxxxx)\n' +
        'landline - landline number (area code + number)',
      'mobile'
    )

    if (!phoneTypeResponse) {
      throw new Error('Operation cancelled')
    }

    const phoneTypeResponseLower = phoneTypeResponse.toLowerCase()
    if (!['mobile', 'landline'].includes(phoneTypeResponseLower)) {
      throw new Error('Invalid phone type. Please enter mobile or landline')
    }

    const internationalFormat = response === 'y'
    const phoneType = phoneTypeResponseLower === 'mobile' ? 'mobile' : 'landline'
    const phone = generateNlPhone({internationalFormat, phoneType})
    console.info(
      `Generated Dutch phone number: ${phone}\n` +
        `Options: ${JSON.stringify({internationalFormat, phoneType}, null, 2)}`
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

