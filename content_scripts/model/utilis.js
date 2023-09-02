import {setNativeValue} from '../../utilis/helpers'

export const action = {
  inputFiller: function (element, data) {
    setNativeValue(element, data)
    element.dispatchEvent(new Event('input', {bubbles: true}))
  },

  inputFillerShadow: function (element, data) {
    element.value = data
    element.dispatchEvent(new Event('input', {bubbles: true}))
    element.dispatchEvent(new Event('change', {bubbles: true}))
  },

  simpleClick: function (element) {
    if (element) {
      element.click()
    }
  },

  dispatchedClick: function (element) {
    if (element) {
      element.dispatchEvent(new Event('click', {bubbles: true}))
    }
  },
  checkCheckbox: function (element) {
    if (element && !element.checked) {
      element.click()
    }
  }
  // more actions if needed
}
