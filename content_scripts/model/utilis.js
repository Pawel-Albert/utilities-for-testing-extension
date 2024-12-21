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
      const mouseDownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        view: window
      })
      const mouseUpEvent = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        view: window
      })
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
      element.dispatchEvent(mouseDownEvent)
      element.dispatchEvent(mouseUpEvent)
      element.dispatchEvent(clickEvent)
    }
  },

  checkCheckbox: function (element) {
    if (element && !element.checked) {
      element.click()
    }
  },

  selectOption: function (element, value) {
    if (!element) return;
    
    element.click();

    setTimeout(() => {
      const option = document.querySelector(`[data-test="${value}"]`);
      
      if (option) {
        option.click();
      }
    }, 500);
  }

  // more actions if needed
}
