import {siteData} from '../../content_scripts/model/siteSelectors'
import {SelectorType} from '../../types/formFiller'

const DEFAULT_TIMEOUT = 1000

function displaySelectors(): void {
  const container = document.getElementById('siteSelectors')
  if (!container) return

  Object.entries(siteData).forEach(([site, selectors]) => {
    const siteGroup = document.createElement('div')
    siteGroup.className = 'site-group'

    siteGroup.innerHTML = `
      <h2>${site}</h2>
      <div class="selector-list">
        ${Object.entries(selectors)
          .map(
            ([name, config]: [string, SelectorType]) => `
            <div class="selector-item">
              <h4>${name}</h4>
              <div class="selector-details">
                <div>type: <span class="selector-type">${config.type}</span></div>
                ${
                  config.type === 'multiStep'
                    ? `
                    <div class="multi-step-details">
                      <div>timeout: ${config.timeout || DEFAULT_TIMEOUT}ms ${
                        !config.timeout
                          ? '<span class="default-note">(default)</span>'
                          : ''
                      }</div>
                      <div class="steps">
                        ${config.steps
                          ?.map(
                            (step, index) => `
                          <div class="step">
                            <div>Step ${index + 1}:</div>
                            <div>selector: ${step.selector}</div>
                            <div>type: ${step.type}</div>
                            ${step.data ? `<div>data: ${step.data}</div>` : ''}
                            ${
                              typeof step.index !== 'undefined'
                                ? `<div class="selector-note">Uses querySelectorAll with index: ${step.index}</div>`
                                : ''
                            }
                          </div>
                        `
                          )
                          .join('')}
                      </div>
                    </div>
                    `
                    : `
                    <div>selector: ${config.selector}</div>
                    ${config.data ? `<div>data: ${config.data}</div>` : ''}
                    ${
                      typeof config.index !== 'undefined'
                        ? `<div class="selector-note">Uses querySelectorAll with index: ${config.index}</div>`
                        : ''
                    }
                    `
                }
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
