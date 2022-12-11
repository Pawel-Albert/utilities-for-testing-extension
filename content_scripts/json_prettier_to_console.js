try {
  console.log(
    JSON.stringify(
      JSON.parse(prompt('Enter JSON to make it pretty in console', '')),
      null,
      2
    )
  )
  alert(`The beautified code was displayed in Devtools (F12). Please check.`)
} catch (error) {
  alert('Provided text is not proper JSON - please try again')
  console.log(`%c ${error}`, 'font-family:monospace; color:firebrick;font-size:25px')
}
