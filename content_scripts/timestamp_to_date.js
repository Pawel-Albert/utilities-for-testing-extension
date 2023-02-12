;(() => {
  try {
    const locale = prompt(
      'Provide locale for date formatting. Examples: "en" or "pl"',
      'pl'
    )
    const timeStampToLocaleDate = timeStamp => {
      const options = {
        timeZone: 'Europe/Warsaw',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
      }
      return new Intl.DateTimeFormat(locale, options).format(new Date(timeStamp))
    }
    const timeStamp = Number(
      prompt(
        "Enter timestamp (example: '1669852799000') to display formatted date (for example 'pl' will be Europe/Warsaw timezone)",
        ''
      )
    )
    const formattedDate = timeStampToLocaleDate(timeStamp)
    alert(formattedDate)
  } catch (err) {
    alert(`Input proper data: ${err}`)
  }
})()
