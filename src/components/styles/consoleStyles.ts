export const consoleStyles = `
  .console-container {
    height: var(--console-height);
    min-height: var(--console-height);
    flex-shrink: 0;
    background: #242424;
    color: #fff;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 12px;
    border-top: 1px solid #444;
    display: flex;
    flex-direction: column;
  }

  .console-header {
    padding: 8px 12px;
    background: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #444;
  }

  .console-title {
    font-weight: bold;
    color: #e0e0e0;
  }

  .console-actions {
    display: flex;
    gap: 8px;
  }

  .console-action {
    background: none;
    border: none;
    color: #e0e0e0;
    cursor: pointer;
    padding: 2px 6px;
    font-size: 11px;
    border-radius: 3px;
  }

  .console-action:hover {
    background: #444;
  }

  .console-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    padding: 8px 0;
  }

  .console-message {
    padding: 4px 12px;
    border-bottom: 1px solid #333;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .console-message:last-child {
    border-bottom: none;
  }

  .console-message.log {
    color: #fff;
  }

  .console-message.info {
    color: #64b5f6;
  }

  .console-message.warn {
    color: #ffb74d;
  }

  .console-message.error {
    color: #ef5350;
  }

  .console-content::-webkit-scrollbar {
    width: 8px;
  }

  .console-content::-webkit-scrollbar-track {
    background: #333;
  }

  .console-content::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 4px;
  }

  .console-content::-webkit-scrollbar-thumb:hover {
    background: #888;
  }
`
