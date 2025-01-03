import {generatePesel} from './custom_generators_logic/pesel_core'
import {setNativeValue} from '../utilis/helpers'
;(() => {
  try {
    const sex = prompt('Enter sex (male/female):', 'male')
    if (!sex || !['male', 'female'].includes(sex)) {
      throw new Error('Invalid sex value')
    }

    const type = prompt('Enter generation type (age/date):', 'age')
    if (!type || !['age', 'date'].includes(type)) {
      throw new Error('Invalid type')
    }

    let options: {age?: number; birthDate?: string} = {}
    if (type === 'age') {
      const age = parseInt(prompt('Enter age:', '25') || '')
      if (isNaN(age) || age < 0) throw new Error('Invalid age')
      options.age = age
    } else if (type === 'date') {
      const date = prompt('Enter birth date (YYYY-MM-DD):', '1990-01-01')
      if (!date) throw new Error('Invalid date')
      options.birthDate = date
    }

    const pesel = generatePesel(sex as 'male' | 'female', options)
    console.info(
      `Custom PESEL (${sex}): ${pesel}\n` + `Options: ${JSON.stringify(options, null, 2)}`
    )

    const indicatedElement = document.querySelector(':focus') as HTMLElement | null
    if (indicatedElement) {
      setNativeValue(indicatedElement, pesel)
      indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
    alert((err as Error).message)
  }
})()
