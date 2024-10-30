;(() => {
  try {
    const targetDomain = 'finance.imobiliare.ro'
    const defaultDomain = 'PL'

    const showTempNotificationAndReload = message => {
      const notification = document.createElement('div')
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 25px;
        background: #333;
        color: white;
        border-radius: 5px;
        z-index: 9999;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        text-align: center;
        min-width: 300px;
      `
      notification.textContent = message
      document.body.appendChild(notification)

      setTimeout(() => {
        location.reload()
      }, 1500)
    }

    if (sessionStorage.getItem('__DOMAIN__') === targetDomain) {
      sessionStorage.removeItem('__DOMAIN__')
      console.info(
        `%c Domain switched back to default (${defaultDomain})`,
        'background: #ff6b6b; color: white; font-size: 14px; padding: 5px; border-radius: 5px;'
      )
      showTempNotificationAndReload(
        `Domain switched back to default (${defaultDomain}). Reloading...`
      )
    } else {
      sessionStorage.setItem('__DOMAIN__', targetDomain)
      console.info(
        `%c Domain switched to: ${targetDomain}`,
        'background: #4CAF50; color: white; font-size: 14px; padding: 5px; border-radius: 5px;'
      )
      showTempNotificationAndReload(`Domain switched to: ${targetDomain}. Reloading...`)
    }

    const currentDomain =
      sessionStorage.getItem('__DOMAIN__') || `Not set (using default: ${defaultDomain})`
    console.info(
      `%c Current __DOMAIN__ value: ${currentDomain}`,
      'font-family: monospace; color: #9c27b0; font-size: 16px; font-weight: bold;'
    )
  } catch (err) {
    console.error(`Error: ${err.message}`)
  }
})()
