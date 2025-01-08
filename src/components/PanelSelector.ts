type PanelType = 'userScripts' | 'executionScripts'

type PanelConfig = {
  [K in PanelType]: {
    path: string
    label: string
  }
}

export const PANELS: PanelConfig = {
  userScripts: {
    path: 'src/pages/user-scripts/userScriptsPanel.html',
    label: 'User Scripts'
  },
  executionScripts: {
    path: 'src/pages/execution-scripts-panel/executionScriptsPanel.html',
    label: 'Execution Scripts'
  }
  // more panels can be added here
}

export function createPanelSelector(container: HTMLElement) {
  console.log('Initializing PanelSelector')
  const wrapper = document.createElement('div')
  wrapper.className = 'panel-selector'

  const currentPath = window.location.pathname
  console.log('Current path:', currentPath)

  const currentPanel =
    Object.entries(PANELS).find(([_, config]) => {
      const baseName = config.path.split('/').pop()?.split('.')[0]
      return currentPath.includes(baseName || '')
    })?.[0] || 'userScripts'
  console.log('Current panel:', currentPanel)

  wrapper.innerHTML = `
    <select id="panelSelect">
      ${Object.entries(PANELS)
        .map(
          ([key, {label}]) =>
            `<option value="${key}" ${
              key === currentPanel ? 'selected' : ''
            }>${label}</option>`
        )
        .join('')}
    </select>
  `

  const style = document.createElement('style')
  style.textContent = `
    .panel-selector {
      position: sticky;
      top: 0;
      background: white;
      padding: 10px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 15px;
      z-index: 100;
    }

    #panelSelect {
      width: 100%;
      padding: 8px;
      border: 1px solid var(--border);
      border-radius: 4px;
      font-size: 14px;
    }
  `

  document.head.appendChild(style)
  container.insertBefore(wrapper, container.firstChild)

  const select = wrapper.querySelector('#panelSelect')
  select?.addEventListener('change', async e => {
    const target = e.target as HTMLSelectElement
    const selected = target.value as PanelType
    console.log('Selected panel:', selected)

    try {
      window.location.href = chrome.runtime.getURL(PANELS[selected].path)

      await chrome.sidePanel.setOptions({
        enabled: true,
        path: PANELS[selected].path
      })
    } catch (error) {
      console.error('Failed to handle panel selection:', error)
    }
  })

  console.log('PanelSelector initialized')
}
