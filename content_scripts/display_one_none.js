;(() => {
  try {
    let tags = document.getElementsByTagName('*')
    let noneTags = []

    if (noneTags.length === 0) {
      for (const tag of tags) {
        if (tag.style.display == 'none') {
          noneTags = [...noneTags, tag]
        }
      }
    }

    let singleTag = noneTags[0]

    if (singleTag && singleTag.style.display == 'none') {
      singleTag.style.display = 'block'
      singleTag.style = singleTag.style + '; border:7px dashed #ae0000;'
    } else {
      console.info('No more hidden elements')
    }
  } catch (err) {
    console.error(`Error: ${err.message}`)
  }
})()
