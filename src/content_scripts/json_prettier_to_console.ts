;(() => {
  try {
    const input = prompt('Enter JSON to make it pretty in console', '')
    if (input) {
      console.log(JSON.stringify(JSON.parse(input), null, 2))
      alert('The beautified code was displayed in Devtools (F12). Please check.')
    }
  } catch (error) {
    alert('Provided text is not proper JSON - please try again')
    console.error(`Error: ${(error as Error).message}`)
  }
})()
