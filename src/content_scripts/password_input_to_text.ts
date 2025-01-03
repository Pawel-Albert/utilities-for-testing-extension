;(() => {
  try {
    const inputs = document.querySelectorAll('input[type=password]')
    inputs.forEach(input => {
      ;(input as HTMLInputElement).type = 'text'
    })

    console.info('Changed')
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
})()
