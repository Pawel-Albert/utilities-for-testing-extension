export const apiMockPanelStyles = `
  :host {
    all: initial;
  }

  * {
    box-sizing: border-box;
  }

  .panel {
    width: 460px;
    max-width: calc(100vw - 24px);
    max-height: calc(100vh - 24px);
    display: flex;
    flex-direction: column;
    font-family: 'Segoe UI', Arial, sans-serif;
    color: #333333;
    background: #ffffff;
    border: 1px solid #bdbdbd;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    overflow: hidden;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: #2196f3;
    color: #ffffff;
    cursor: move;
    user-select: none;
  }

  .header h2 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    flex: 1;
    letter-spacing: 0.2px;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: default;
  }

  .icon-button {
    width: 26px;
    height: 26px;
    border: 0;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.18);
    color: #ffffff;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
  }

  .icon-button:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .switch {
    position: relative;
    width: 38px;
    height: 20px;
    display: inline-block;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.35);
    border-radius: 20px;
    cursor: pointer;
    transition: 0.2s;
  }

  .slider::before {
    content: '';
    position: absolute;
    height: 16px;
    width: 16px;
    left: 2px;
    top: 2px;
    background: #ffffff;
    border-radius: 50%;
    transition: 0.2s;
  }

  .switch input:checked + .slider {
    background: #4caf50;
  }

  .switch input:checked + .slider::before {
    transform: translateX(18px);
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    background: #fafafa;
    overflow: auto;
    min-height: 0;
  }

  .preview-notice {
    background: #cce5ff;
    color: #004085;
    padding: 8px 10px;
    border-radius: 4px;
    border: 1px solid #b8daff;
    font-size: 12px;
    line-height: 1.4;
  }

  .help-text {
    margin: 0;
    font-size: 12px;
    color: #757575;
    line-height: 1.4;
  }

  .section {
    background: #ffffff;
    border: 1px solid #bdbdbd;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }

  .section h3 {
    margin: 0 0 10px;
    color: #2196f3;
    font-size: 14px;
  }

  .row {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
  }

  .row h3 {
    margin: 0;
  }

  .add-button {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: #2196f3;
    color: #ffffff;
    font-size: 26px;
    line-height: 1;
    cursor: pointer;
    flex-shrink: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .add-button:hover {
    background: #1976d2;
  }

  .rules {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 180px;
    overflow: auto;
  }

  .rule {
    display: grid;
    grid-template-columns: auto 1fr auto auto auto;
    gap: 6px;
    align-items: center;
    padding: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background: #fafafa;
    cursor: pointer;
  }

  .rule.active {
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
    background: #ffffff;
  }

  .rule.disabled {
    opacity: 0.55;
  }

  .rule-title {
    font-size: 13px;
    font-weight: 600;
    margin: 0 0 2px;
  }

  .rule-meta {
    font-size: 11px;
    color: #757575;
    word-break: break-all;
  }

  .badge {
    font-size: 11px;
    font-weight: 600;
    color: #1976d2;
    background: rgba(33, 150, 243, 0.12);
    border-radius: 4px;
    padding: 2px 6px;
    white-space: nowrap;
  }

  .hits-badge {
    color: #2e7d32;
    background: rgba(76, 175, 80, 0.16);
    min-width: 1.8em;
    text-align: center;
  }

  .hits-badge.zero {
    color: #9e9e9e;
    background: #f0f0f0;
  }

  .rule-actions {
    display: flex;
    gap: 2px;
    flex-shrink: 0;
  }

  .rule-icon {
    width: 26px;
    height: 26px;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: #757575;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .rule-icon:hover {
    background: rgba(33, 150, 243, 0.12);
    color: #1976d2;
  }

  .rule-icon.danger:hover {
    background: rgba(220, 53, 69, 0.12);
    color: #dc3545;
  }

  .rule-icon svg {
    width: 14px;
    height: 14px;
    display: block;
  }

  .hit-total {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.6em;
    margin-left: 6px;
    padding: 1px 7px;
    border-radius: 10px;
    background: rgba(76, 175, 80, 0.16);
    color: #2e7d32;
    font-size: 12px;
  }

  .hits-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 150px;
    overflow: auto;
  }

  .hits-list.pulse .hit {
    animation: hitFlash 0.45s ease;
  }

  @keyframes hitFlash {
    from {
      background: rgba(76, 175, 80, 0.35);
    }
    to {
      background: rgba(76, 175, 80, 0.12);
    }
  }

  .form-group {
    margin-bottom: 10px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-size: 12px;
    font-weight: 600;
    color: #333333;
  }

  input[type='text'],
  input[type='number'],
  select,
  textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #bdbdbd;
    border-radius: 4px;
    font-size: 13px;
    font-family: inherit;
    background: #ffffff;
    color: #333333;
  }

  textarea {
    min-height: 120px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 12px;
    line-height: 1.45;
    resize: vertical;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }

  .grid-2,
  .grid-3 {
    display: grid;
    gap: 8px;
  }

  .grid-2 {
    grid-template-columns: 1fr 1fr;
  }

  .grid-3 {
    grid-template-columns: 1.2fr 0.8fr 0.8fr;
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  button.action {
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 13px;
    cursor: pointer;
    color: #ffffff;
    background: #2196f3;
  }

  button.action:hover {
    background: #1976d2;
  }

  button.action.secondary {
    background: #ffffff;
    color: #2196f3;
    border: 1px solid #2196f3;
  }

  button.action.secondary:hover {
    background: rgba(33, 150, 243, 0.1);
  }

  button.action.danger {
    background: #dc3545;
  }

  button.action.danger:hover {
    background: #c82333;
  }

  button.action.success {
    background: #4caf50;
  }

  button.action.success:hover {
    background: #388e3c;
  }

  .empty {
    font-size: 12px;
    color: #757575;
    padding: 8px 0;
  }

  .hit {
    font-size: 12px;
    color: #333333;
    background: rgba(76, 175, 80, 0.12);
    border: 1px solid rgba(76, 175, 80, 0.35);
    border-radius: 4px;
    padding: 8px;
    word-break: break-all;
  }

  .hit.empty-hit {
    background: #ffffff;
    border-color: #e0e0e0;
    color: #757575;
  }

  .toast {
    position: absolute;
    left: 50%;
    bottom: 12px;
    transform: translateX(-50%);
    padding: 8px 14px;
    border-radius: 4px;
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    z-index: 2;
  }

  .toast.show {
    opacity: 1;
  }

  .toast.success {
    background: #4caf50;
  }

  .toast.error {
    background: #f44336;
  }

  .panel.minimized .body,
  .panel.minimized .toast {
    display: none;
  }
`
