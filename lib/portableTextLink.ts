/** When true, all inline links in a rich text field open in a new tab. */
export function parseLinksOpenInNewTab(value: unknown): boolean {
  return value === true
}

export function portableTextLinkTargetAttrs(
  linksOpenInNewTab?: boolean | null,
): { target?: '_blank'; rel?: string } {
  if (!linksOpenInNewTab) return {}
  return { target: '_blank', rel: 'noopener noreferrer' }
}
