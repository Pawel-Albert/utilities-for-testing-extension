;(() => {
  try {
    const ids: Record<string, number> = {}
    const collection = document.getElementsByTagName('*')
    for (let i = 0, length = collection.length; i < length; i++) {
      const element = collection[i] as HTMLElement
      const id = element.id
      if (id) {
        if (ids[id]) {
          element.style.cssText = `${element.style.cssText}; border:7px dashed #ae0000;`
          const originalElement = document.getElementById(id)
          if (originalElement) {
            originalElement.style.cssText = `${originalElement.style.cssText}; border:7px dashed #ae0000;`
          }
          ids[id]++
        } else {
          ids[id] = 1
        }
      }
    }

    const duplicates = Object.entries(ids).filter(([_, count]) => count > 1)
    if (duplicates.length > 0) {
      console.log(
        '%c Found duplicated IDs:',
        'font-family: monospace; color: #e74c3c; font-size: 16px; font-weight: bold;'
      )
      duplicates.forEach(([id, count]) => {
        console.log(`ID: "${id}" appears ${count} times`)
      })
    } else {
      console.log(
        '%c No duplicated IDs found',
        'font-family: monospace; color: #2ecc71; font-size: 16px; font-weight: bold;'
      )
    }
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`)
  }
})()
