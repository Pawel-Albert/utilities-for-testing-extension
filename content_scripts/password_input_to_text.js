;(function () {
  const inputs = document.querySelectorAll('input[type=password]')

  for (const input of inputs) {
    input.type = 'text'
  }
  console.log(`%c Changed`, 'font-family:monospace; color:firebrick;font-size:25px')
})()
