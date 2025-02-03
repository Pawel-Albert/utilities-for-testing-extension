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

export const createModal = ({modalId, messageId, confirmId, cancelId}: ModalConfig) => {
  const modalElement = document.getElementById(modalId) as HTMLElement
  const messageElement = document.getElementById(messageId) as HTMLElement
  const confirmButton = document.getElementById(confirmId) as HTMLButtonElement
  const cancelButton = document.getElementById(cancelId) as HTMLButtonElement

  const close = () => {
    modalElement.style.display = 'none'
  }

  const show = async (text: string, options: ShowOptions = {}): Promise<boolean> => {
    return new Promise(resolve => {
      messageElement.innerHTML = options.content || text

      confirmButton.textContent = options.confirmText || 'Confirm'
      confirmButton.className = options.confirmClass || 'btn-success'

      if (options.cancelText === '') {
        cancelButton.style.display = 'none'
      } else {
        cancelButton.style.display = ''
        cancelButton.textContent = options.cancelText || 'Cancel'
      }

      modalElement.style.display = 'block'

      const handleConfirm = () => {
        modalElement.style.display = 'none'
        cleanup()
        resolve(true)
      }

      const handleCancel = () => {
        modalElement.style.display = 'none'
        cleanup()
        resolve(false)
      }

      const cleanup = () => {
        confirmButton.removeEventListener('click', handleConfirm)
        cancelButton.removeEventListener('click', handleCancel)
      }

      confirmButton.addEventListener('click', handleConfirm)
      cancelButton.addEventListener('click', handleCancel)
    })
  }

  return {
    show,
    close
  }
}
