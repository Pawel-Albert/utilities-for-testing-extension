;(function () {
  const tagi = document.getElementsByTagName('*')
  for (const tag of tagi) {
    if (tag.hasAttribute('disabled')) {
      tag.removeAttribute('disabled')
      tag.style = tag.style + '; border:2px dashed red;'
    }
    if (tag.classList.contains('disabled')) {
      tag.classList.remove('disabled')
      tag.style = tag.style + '; border:4px dashed purple;'
    }
  }
  console.log(`%c Unlocked`, 'font-family:monospace; color:firebrick;font-size:25px')
})()
