type ModalConfig = {
  modalId: string
  messageId: string
  confirmId: string
  cancelId: string
}

type ShowOptions = {
  confirmText?: string
  cancelText?: string
  content?: string
  confirmClass?: string
}

export function createModal(config: ModalConfig) {
  const modal = document.getElementById(config.modalId)
  const message = document.getElementById(config.messageId)

  function show(text: string, options: ShowOptions = {}): Promise<boolean> {
    return new Promise(resolve => {
      if (!modal || !message) {
        resolve(false)
        return
      }

      message.textContent = text
      if (options.content) {
        message.innerHTML = text + options.content
      }
      modal.style.display = 'block'

      const confirmBtn = document.getElementById(config.confirmId)
      const cancelBtn = document.getElementById(config.cancelId)

      if (confirmBtn) {
        if (options.confirmText) {
          confirmBtn.textContent = options.confirmText
        }
        if (options.confirmClass) {
          confirmBtn.className = options.confirmClass
        }
        confirmBtn.onclick = () => {
          if (modal) modal.style.display = 'none'
          resolve(true)
        }
      }

      if (cancelBtn) {
        if (options.cancelText) {
          cancelBtn.textContent = options.cancelText
        }
        cancelBtn.onclick = () => {
          if (modal) modal.style.display = 'none'
          resolve(false)
        }
      }
    })
  }

  return {show}
}
