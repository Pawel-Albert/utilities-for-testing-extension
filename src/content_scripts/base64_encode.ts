;(() => {
  try {
    const input = prompt(
      'Enter String to be encoded(Base64) and printed in to the console',
      ''
    )
    if (input) {
      console.log(btoa(input))
    }
  } catch (error) {
    alert(`You messed up this time - try again`)
    console.log(
      `%c ${(error as Error).message}`,
      'font-family: monospace; color: firebrick; font-size: 25px'
    )
  }
})()
