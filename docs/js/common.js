/**
 * Common JavaScript functions for the test pages
 */

// Initialize all pages with common header navigation
document.addEventListener('DOMContentLoaded', initializeNavigation)

/**
 * Initialize the common header navigation on each page
 */
function initializeNavigation() {
  if (!document.querySelector('.header-navigation')) {
    const header = document.createElement('div')
    header.className = 'header-navigation'

    const navigation = `
      <a href="index.html" ${isCurrentPage('index.html') ? 'class="active"' : ''}>Home</a>
      <a href="data-testid-form.html" ${
        isCurrentPage('data-testid-form.html') ? 'class="active"' : ''
      }>Data TestID</a>
      <a href="aria-form.html" ${
        isCurrentPage('aria-form.html') ? 'class="active"' : ''
      }>ARIA Roles</a>
      <a href="label-form.html" ${
        isCurrentPage('label-form.html') ? 'class="active"' : ''
      }>Labels</a>
      <a href="text-form.html" ${
        isCurrentPage('text-form.html') ? 'class="active"' : ''
      }>Text Content</a>
      <a href="shadow-dom-form.html" ${
        isCurrentPage('shadow-dom-form.html') ? 'class="active"' : ''
      }>Shadow DOM</a>
      <a href="multistep-form.html" ${
        isCurrentPage('multistep-form.html') ? 'class="active"' : ''
      }>Multi-step</a>
      <a href="complex-form.html" ${
        isCurrentPage('complex-form.html') ? 'class="active"' : ''
      }>Complex</a>
    `

    header.innerHTML = navigation
    document.body.insertBefore(header, document.body.firstChild)
  }

  const copyButtons = document.querySelectorAll('.copy-button')
  copyButtons.forEach(btn => {
    btn.addEventListener('click', handleCopyClick)
  })
}

/**
 * Determine if a given file is the current page
 * @param {string} filename - The file name to check
 * @returns {boolean} True if it's the current page
 */
function isCurrentPage(filename) {
  const currentPath = window.location.pathname
  return currentPath.endsWith(filename)
}

/**
 * Handle click on copy button
 * @param {Event} event - The click event
 */
function handleCopyClick(event) {
  const btn = event.target
  const preElement = btn.previousElementSibling

  if (preElement && preElement.tagName === 'PRE') {
    const textToCopy = preElement.textContent

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        const originalText = btn.textContent
        btn.textContent = 'Copied!'

        setTimeout(() => {
          btn.textContent = originalText
        }, 2000)
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
        alert('Failed to copy to clipboard')
      })
  }
}

/**
 * Highlight data-testid attributes in the HTML
 * @param {string} selector - The selector to find elements to highlight
 */
function highlightTestIds(selector = '[data-testid]') {
  const elements = document.querySelectorAll(selector)
  elements.forEach(el => {
    const testId = el.getAttribute('data-testid')
    if (testId) {
      const label = document.createElement('span')
      label.className = 'testid-highlight'
      label.textContent = `data-testid="${testId}"`

      if (
        el.tagName === 'INPUT' ||
        el.tagName === 'SELECT' ||
        el.tagName === 'TEXTAREA'
      ) {
        const parent = el.parentElement
        if (parent && parent.tagName !== 'LABEL') {
          parent.appendChild(document.createElement('br'))
          parent.appendChild(label)
        }
      } else {
        el.setAttribute('title', `data-testid="${testId}"`)

        if (
          el.children.length > 0 &&
          !['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)
        ) {
          el.appendChild(document.createElement('br'))
          el.appendChild(label)
        }
      }
    }
  })
}

/**
 * Create and add a form submission handler that prevents actual submission
 * and shows the submitted data
 * @param {string} formId - The ID of the form to handle
 */
function setupFormSubmitHandler(formId = 'test-form') {
  const form = document.getElementById(formId)
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault()

      const formData = new FormData(form)
      const data = {}

      for (let [key, value] of formData.entries()) {
        data[key] = value
      }

      const resultElement = document.getElementById('form-result')
      if (resultElement) {
        resultElement.innerHTML = `
          <h3>Form Submitted Data:</h3>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        `
        resultElement.style.display = 'block'
      }

      return false
    })
  }
}
