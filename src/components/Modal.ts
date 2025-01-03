type ModalConfig = {
  modalId: string
  messageId: string
  confirmId: string
  cancelId: string
}

export function createModal(config: ModalConfig) {
  const modal = document.getElementById(config.modalId)
  const message = document.getElementById(config.messageId)

  function show(text: string): Promise<boolean> {
    return new Promise(resolve => {
      if (!modal || !message) {
        resolve(false)
        return
      }

      message.textContent = text
      modal.style.display = 'block'

      const confirmBtn = document.getElementById(config.confirmId)
      const cancelBtn = document.getElementById(config.cancelId)

      if (confirmBtn) {
        confirmBtn.onclick = () => {
          if (modal) modal.style.display = 'none'
          resolve(true)
        }
      }

      if (cancelBtn) {
        cancelBtn.onclick = () => {
          if (modal) modal.style.display = 'none'
          resolve(false)
        }
      }
    })
  }

  return {show}
}
