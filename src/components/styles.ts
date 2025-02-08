export const groupStyles = `
  .group-filter {
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
  }

  .filter-header {
    padding: 10px 15px;
    background: #f5f5f5;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .filter-header:hover {
    background: #eeeeee;
  }

  .filter-title {
    font-weight: 500;
    color: #333;
  }

  .filter-toggle {
    color: #666;
    font-weight: bold;
    transition: transform 0.2s;
  }

  .filter-toggle.collapsed {
    transform: rotate(-90deg);
  }

  .filter-content {
    padding: 10px;
    background: white;
    display: none;
  }

  .filter-content.expanded {
    display: block;
  }

  .group-filter-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
    max-height: 200px;
    overflow-y: auto;
  }

  .group-pill {
    padding: 6px 12px;
    border-radius: 16px;
    background: #f0f0f0;
    border: 1px solid var(--border);
    cursor: pointer;
    font-size: 13px;
    user-select: none;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .group-pill:hover {
    background: #e8e8e8;
  }

  .group-pill.selected {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }

  .filter-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    border-top: 1px solid var(--border);
    padding-top: 10px;
  }

  .filter-button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    background: var(--primary);
    color: white;
    cursor: pointer;
    font-size: 12px;
    transition: opacity 0.2s;
  }

  .filter-button:hover {
    opacity: 0.9;
  }

  .filter-button.debug {
    background: #9e9e9e;
  }

  .group-container {
    margin-bottom: 10px;
  }

  .group-header {
    display: flex;
    align-items: center;
    padding: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
  }

  .group-toggle {
    background: none;
    border: none;
    padding: 0 8px;
    cursor: pointer;
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }

  .group-content {
    padding-left: 15px;
  }
`
