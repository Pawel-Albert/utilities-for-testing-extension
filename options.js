document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(
    {
      userPrefix: 'testLendi',
      emailDomain: 'gmail.com'
    },
    items => {
      document.getElementById('userPrefix').value = items.userPrefix
      document.getElementById('emailDomain').value = items.emailDomain
    }
  )
})

document.getElementById('settingsForm').addEventListener('submit', e => {
  e.preventDefault()

  const userPrefix = document.getElementById('userPrefix').value.trim() || 'testLendi'
  const emailDomain = document.getElementById('emailDomain').value.trim() || 'gmail.com'

  chrome.storage.sync.set(
    {
      userPrefix,
      emailDomain
    },
    () => {
      const status = document.getElementById('status')
      status.textContent = 'Settings saved!'
      status.className = 'status success'
      status.style.display = 'block'

      setTimeout(() => {
        status.style.display = 'none'
      }, 2000)
    }
  )
})
