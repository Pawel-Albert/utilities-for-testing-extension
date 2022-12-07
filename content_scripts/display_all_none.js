;(function () {
  const tagi = document.getElementsByTagName('*')

  for (const tag of tagi) {
    if (tag.style.display == 'none') {
      tag.style.display = 'block'
      tag.style = tag.style + '; border:7px dashed #ae0000;'
    }
  }
  console.log(
    `%c All elements are now visible, but does not look good right?`,
    'font-family:monospace; color:purple;font-size:20px'
  )
})()
