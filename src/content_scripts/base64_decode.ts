;(() => {
  try {
    const input = prompt(
      'Enter String to be decoded(Base64) and printed in to the console',
      ''
    )
    if (input) {
      console.log(atob(input))
    }
  } catch (error) {
    alert(`You messed up this time - try again`)
    console.log(
      `%c ${(error as Error).message}`,
      'font-family: monospace; color: firebrick; font-size: 25px'
    )
  }
})()
