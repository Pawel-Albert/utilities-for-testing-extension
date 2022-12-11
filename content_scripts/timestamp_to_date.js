;(function () {
  try {
    const locale = prompt(
      'Provide locale for date formating. Examples "en" or "pl"',
      'pl'
    )
    const timeStampToLocaleDate = timeStamp => {
      return new Date(timeStamp).toLocaleDateString(locale, {
        timeZone: 'Europe/Warsaw',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
      })
    }
    alert(
      timeStampToLocaleDate(
        Number(
          prompt(
            "Enter timestamp (example: '1669852799000') to display date Alert modal (for example 'pl' will be Europe/Warsaw timezone)",
            ''
          )
        )
      )
    )
  } catch (err) {
    alert(`Input proper data: ${err}`)
  }
})()
