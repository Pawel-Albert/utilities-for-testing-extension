import {setNativeValue} from '../../utilis/helpers'
import {ActionFunctions} from '../../types/formFiller'

export const action: ActionFunctions = {
  inputFiller: function (element: HTMLElement, data: string | number) {
    setNativeValue(element, data.toString())
    element.dispatchEvent(new Event('input', {bubbles: true}))
  },

  inputFillerShadow: function (element: HTMLElement, data: string | number) {
    if (element instanceof HTMLInputElement) {
      element.value = data.toString()
      element.dispatchEvent(new Event('input', {bubbles: true}))
      element.dispatchEvent(new Event('change', {bubbles: true}))
    }
  },

  simpleClick: function (element: HTMLElement) {
    if (element) {
      element.click()
    }
  },

  dispatchedClick: function (element: HTMLElement) {
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

  checkCheckbox: function (element: HTMLInputElement) {
    if (element && !element.checked) {
      element.click()
    }
  }
}
