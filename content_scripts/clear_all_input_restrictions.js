;(function () {
  Array.prototype.slice
    .call(document.querySelectorAll('input, select'))
    .map(function (element) {
      element.removeAttribute('required')
    })

  Array.prototype.slice.call(document.querySelectorAll('input')).map(function (element) {
    element.removeAttribute('maxlength')
  })

  Array.prototype.slice.call(document.querySelectorAll('input')).map(function (element) {
    element.removeAttribute('minlength')
  })

  let inputs = document.querySelectorAll('input')
  for (let i = 0; i < inputs.length; i++) {
    if (typeof inputs[i].onpaste === 'function') {
      inputs[i].onpaste = new (function () {})()
    }
  }

  console.log(
    `%c removed restrictions: required, maxlength, minlength, onpaste function`,
    'font-family:monospace; color:DarkGreen;font-size:25px'
  )
})()
