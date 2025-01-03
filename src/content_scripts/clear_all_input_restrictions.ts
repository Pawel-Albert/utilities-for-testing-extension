;(() => {
  try {
    const inputs = document.querySelectorAll('input, select')
    inputs.forEach(input => {
      const element = input as HTMLInputElement | HTMLSelectElement
      element.removeAttribute('required')
      element.removeAttribute('maxlength')
      element.removeAttribute('minlength')
      element.removeAttribute('pattern')
      element.removeAttribute('autocomplete')
      if (typeof element.onpaste === 'function') {
        element.onpaste = null
      }
    })

    console.info(
      '%c Removed input restrictions',
      'font-family: monospace; color: green; font-size: 25px'
    )
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
})()
