import {setNativeValue} from '../utylis/helpers'
import {generateIdNumber} from './custom_generators_logic/idnumber_core'

;(function () {
  let idNumber = generateIdNumber()
  console.log(
    `%c Id num: ${idNumber}`,
    'font-family:monospace; color:DarkGreen;font-size:25px'
  )
  const indicatedElement = document.activeElement

  setNativeValue(indicatedElement, idNumber)
  indicatedElement.dispatchEvent(new Event('input', {bubbles: true}))
})()
