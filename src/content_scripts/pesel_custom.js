import {generatePesel} from './custom_generators_logic/pesel_core.js'
import {setNativeValue} from '../utilis/helpers.ts'
;(() => {
  try {
    const sex = prompt('Enter sex (male/female):', 'male')
    const type = prompt('Enter generation type (age/date):', 'age')

    let options = {}
    if (type === 'age') {
      const age = parseInt(prompt('Enter age:', '25'))
      if (isNaN(age) || age < 0) throw new Error('Invalid age')
      options.age = age
    } else if (type === 'date') {
      const date = prompt('Enter birth date (YYYY-MM-DD):', '1990-01-01')
      options.birthDate = date
    } else {
      throw new Error('Invalid type')
    }

    const pesel = generatePesel(sex, options)
    console.info(
      `Custom PESEL (${sex}): ${pesel}\n` + `Options: ${JSON.stringify(options, null, 2)}`
    )

    const indicatedElement = document.querySelector(':focus')
    setNativeValue(indicatedElement, pesel)
    indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
  } catch (err) {
    console.error(`Error: ${err.message}`)
    alert(err.message)
  }
})()
