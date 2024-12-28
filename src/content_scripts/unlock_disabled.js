;(() => {
  try {
    const tags = [...document.getElementsByTagName('*')]
    tags.forEach(tag => {
      if (tag.hasAttribute('disabled')) {
        tag.removeAttribute('disabled')
        tag.style.border = '2px dashed red'
      }
      if (tag.classList.contains('disabled')) {
        tag.classList.remove('disabled')
        tag.classList.add('bordered')
      }
    })
    console.log('%c Unlocked', 'font-family:monospace; color:firebrick;font-size:25px')
  } catch (err) {
    console.error(`Error: ${err.message}`)
  }
})()
