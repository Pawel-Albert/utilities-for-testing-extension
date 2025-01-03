;(() => {
  try {
    const tags = document.getElementsByTagName('*')
    let noneTags: HTMLElement[] = []

    if (noneTags.length === 0) {
      for (const tag of tags) {
        if ((tag as HTMLElement).style.display === 'none') {
          noneTags = [...noneTags, tag as HTMLElement]
        }
      }
    }

    const singleTag = noneTags[0]

    if (singleTag && singleTag.style.display === 'none') {
      singleTag.style.display = 'block'
      singleTag.style.cssText = singleTag.style.cssText + '; border:7px dashed #ae0000;'
    } else {
      console.info('No more hidden elements')
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
})()
