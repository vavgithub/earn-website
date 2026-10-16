/**
 * Stable key for nav top-level items when CMS `key` is omitted (React keys, analytics).
 */
export function navKeyFromLabel(label: string): string {
  const s = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return s || 'item'
}
