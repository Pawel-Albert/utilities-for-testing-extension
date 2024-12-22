import {siteData} from './content_scripts/model/siteSelectors.js'

function displaySelectors() {
  const container = document.getElementById('siteSelectors')

  Object.entries(siteData).forEach(([site, selectors]) => {
    const siteGroup = document.createElement('div')
    siteGroup.className = 'site-group'

    siteGroup.innerHTML = `
      <h2>${site}</h2>
      <div class="selector-list">
        ${Object.entries(selectors)
          .map(
            ([name, config]) => `
            <div class="selector-item">
              <h4>${name}</h4>
              <div class="selector-details">
                <div>type: <span class="selector-type">${config.type}</span></div>
                <div>selector: ${config.selector}</div>
                ${
                  config.index !== undefined
                    ? `<div class="selector-note">Uses querySelectorAll with index: ${config.index}</div>`
                    : ''
                }
                ${config.data ? `<div>data: ${config.data}</div>` : ''}
              </div>
            </div>
          `
          )
          .join('')}
      </div>
    `

    container.appendChild(siteGroup)
  })
}

displaySelectors()
