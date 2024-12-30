import {getSettings, saveSettings} from '../../utilis/storage.js'

document.addEventListener('DOMContentLoaded', async () => {
  const settings = await getSettings()
  document.getElementById('userPrefix').value = settings.userPrefix
  document.getElementById('emailDomain').value = settings.emailDomain
  document.getElementById('defaultCounterLength').value = settings.defaultCounterLength
  document.getElementById('defaultLoremLength').value = settings.defaultLoremLength
  document.getElementById('defaultPatternText').value = settings.defaultPatternText
  document.getElementById('defaultPatternLength').value = settings.defaultPatternLength
  document.getElementById('defaultMultiplierText').value = settings.defaultMultiplierText
  document.getElementById('defaultMultiplierLines').value =
    settings.defaultMultiplierLines
  document.getElementById('defaultMultiplierLength').value =
    settings.defaultMultiplierLength
})

document.getElementById('optionsForm').addEventListener('submit', e => {
  e.preventDefault()
  saveSettings({
    userPrefix: document.getElementById('userPrefix').value,
    emailDomain: document.getElementById('emailDomain').value,
    defaultCounterLength: document.getElementById('defaultCounterLength').value,
    defaultLoremLength: document.getElementById('defaultLoremLength').value,
    defaultPatternText: document.getElementById('defaultPatternText').value,
    defaultPatternLength: document.getElementById('defaultPatternLength').value,
    defaultMultiplierText: document.getElementById('defaultMultiplierText').value,
    defaultMultiplierLines: document.getElementById('defaultMultiplierLines').value,
    defaultMultiplierLength: document.getElementById('defaultMultiplierLength').value
  }).then(() => {
    const status = document.getElementById('status')
    status.textContent = 'Options saved.'
    setTimeout(() => {
      status.textContent = ''
    }, 750)
  })
})
