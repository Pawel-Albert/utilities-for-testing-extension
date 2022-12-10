;(function () {
  const tagi = document.getElementsByTagName('*')
  for (const tag of tagi) {
    tag.removeAttribute('disabled')
    if (tag.classList.contains('disabled')) {
      tag.classList.remove('disabled')
      tag.style = tag.style + '; border:7px dashed purple;'
    }
  }
  console.log(`%c Unlocked`, 'font-family:monospace; color:firebrick;font-size:25px')
})()
