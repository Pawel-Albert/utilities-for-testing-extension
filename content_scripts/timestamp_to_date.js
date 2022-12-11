;(function () {
  try {
    const timeStampToLocaleDate = timeStamp => {
      return new Date(timeStamp).toLocaleDateString('pl-PL', {
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
            "Enter timestamp (example: '1669852799000') to display date Alert modal (timeZone is Europe/Warsaw)",
            ''
          )
        )
      )
    )
  } catch (err) {
    alert(`Input proper timestamp as this was an: ${err}`)
  }
})()
