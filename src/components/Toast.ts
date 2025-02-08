export const createToast = (elementId: string, duration: number = 3000) => {
  const toastElement = document.getElementById(elementId)

  if (!toastElement) {
    console.error('Toast element not found')
    return {
      show: () => {}
    }
  }

  let timeoutId: number

  const show = (message: string, type: 'success' | 'error' = 'success') => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    toastElement.textContent = message
    toastElement.className = `toast ${type} show`

    timeoutId = window.setTimeout(() => {
      toastElement.className = 'toast'
    }, duration)
  }

  return {show}
}
