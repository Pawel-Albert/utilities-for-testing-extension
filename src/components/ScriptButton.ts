export function createScriptButton(name: string, code: string, index: number) {
  function addButton() {
    const button = document.createElement('button')
    button.id = `script-button-${name}-${Date.now()}`
    button.textContent = name
    button.style.cssText = `
      position: fixed;
      z-index: 9999;
      bottom: ${20 + index * 50}px;
      right: 20px;
      padding: 8px;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `

    button.addEventListener('click', () => {
      console.log('Executing script:', name)
      try {
        eval(code)
        console.log('Script executed successfully')
      } catch (err) {
        console.error('Script execution error:', err)
      }
    })

    document.body.appendChild(button)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addButton)
  } else {
    addButton()
  }
}
