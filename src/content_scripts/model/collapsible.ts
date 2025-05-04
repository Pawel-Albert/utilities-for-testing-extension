/**
 * Initializes collapsible sections in the UI
 *
 * @param selector CSS selector for collapsible headers
 * @param startCollapsed Whether all sections should start collapsed
 * @param firstUncollapsed Whether the first section should remain uncollapsed
 */
export function initCollapsibleSections(
  selector = '.collapsible-header:not(.initialized)',
  startCollapsed = true,
  firstUncollapsed = true
): void {
  const collapsibleHeaders = document.querySelectorAll(selector)

  collapsibleHeaders.forEach((header, index) => {
    header.classList.add('initialized')
    const shouldCollapse = startCollapsed && !(firstUncollapsed && index === 0)

    if (shouldCollapse) {
      header.classList.add('collapsed')
      const content = header.nextElementSibling as HTMLElement
      if (content) {
        content.classList.add('collapsed')
      }
    }

    header.addEventListener('click', function (this: HTMLElement) {
      this.classList.toggle('collapsed')
      const content = this.nextElementSibling as HTMLElement
      if (content) {
        content.classList.toggle('collapsed')
      }
    })
  })
}
