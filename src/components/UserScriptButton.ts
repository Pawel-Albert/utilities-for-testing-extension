interface UserScriptConfig {
  name: string
  code: string
  index: number
}

export function getUserScriptButtonCode(config: UserScriptConfig): string {
  return `
    (function() {
      const button = document.createElement('button');
      button.id = 'script-button-${config.name}-${Date.now()}';
      button.textContent = ${JSON.stringify(config.name)};
      button.style.cssText = 'position: fixed; z-index: 9999; bottom: ${
        20 + config.index * 50
      }px; right: 20px; padding: 8px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer;';
      
      button.addEventListener('click', () => {
        console.log('Executing script:', ${JSON.stringify(config.name)});
        try {
          ${config.code}
          console.log('Script executed successfully');
        } catch (err) {
          console.error('Script execution error:', err);
        }
      });

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => document.body.appendChild(button));
      } else {
        document.body.appendChild(button);
      }
    })();
  `
}
