;(function () {
  const tagi = document.getElementsByTagName('*')
  for (const tag of tagi) {
    tag.removeAttribute('disabled')
  }
  console.log(`%c Unlocked`, 'font-family:monospace; color:firebrick;font-size:25px')
})()
