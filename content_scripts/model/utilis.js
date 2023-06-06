import {setNativeValue} from '../../utilis/helpers'

export const action = {
  inputFiller: function (element, data) {
    setNativeValue(element, data)
    element.dispatchEvent(new Event('input', {bubbles: true}))
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
  }
  // more actions if needed
}
