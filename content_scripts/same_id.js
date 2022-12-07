;(function () {
  let ids = {}
  const colection = document.getElementsByTagName('*')
  for (let i = 0, length = colection.length; i < length; i++) {
    let id = colection[i].id
    if (id) {
      if (ids[id]) {
        colection[i].style = colection[i].style + '; border:7px dashed #ae0000;'
        document.getElementById(id).style =
          document.getElementById(id).style + '; border:7px dashed #ae0000;'
      } else {
        ids[id] = 1
      }
    }
  }
})()
