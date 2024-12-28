;(() => {
  try {
    const inputs = document.querySelectorAll('input, select')
    inputs.forEach(input => {
      input.removeAttribute('required')
      input.removeAttribute('maxlength')
      input.removeAttribute('minlength')
      input.removeAttribute('pattern')
      input.removeAttribute('autocomplete')
      if (typeof input.onpaste === 'function') {
        input.onpaste = () => {}
      }
    })

    console.info(
      '%c Removed input restrictions',
      'font-family: monospace; color: green; font-size: 25px'
    )
  } catch (err) {
    console.error(`Error: ${err.message}`)
  }
})()
