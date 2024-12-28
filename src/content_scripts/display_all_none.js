;(() => {
  try {
    const tags = document.getElementsByTagName('*')

    for (const tag of tags) {
      if (tag.style.display == 'none') {
        tag.style.display = 'block'
        tag.style = tag.style + '; border:7px dashed #ae0000;'
      }
    }

    console.info(
      `%c All elements are now visible, but does not look good right?`,
      'font-family:monospace; color:purple;font-size:20px'
    )
  } catch (err) {
    console.error(`Error: ${err.message}`)
  }
})()
