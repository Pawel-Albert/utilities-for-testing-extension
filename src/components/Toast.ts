export function createToast(elementId: string) {
  const element = document.getElementById(elementId)

  function show(message: string, type = 'success'): void {
    if (!element) return

    element.textContent = message
    element.className = `toast ${type}`

    void element.offsetWidth

    element.classList.add('show')
    setTimeout(() => {
      element.classList.remove('show')
    }, 2000)
  }

  return {
    show
  }
}
