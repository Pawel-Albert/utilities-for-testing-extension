;(() => {
  try {
    const inputs = document.querySelectorAll('input[type=password]')

    inputs.forEach(input => {
      input.type = 'text'
    })

    console.info('Changed')
  } catch (err) {
    console.error(`Error: ${err.message}`)
  }
})()
