import { stegaClean } from 'next-sanity'

export type BlockContentAlignment = 'left' | 'center'

export function parseBlockContentAlignment(raw: unknown): BlockContentAlignment {
  const value = stegaClean(typeof raw === 'string' ? raw : String(raw ?? '')).trim()
  return value === 'center' ? 'center' : 'left'
}

/** Text alignment inside the `PageBlockLayout` width column. */
export function blockContentAlignmentClass(raw: unknown): string {
  return parseBlockContentAlignment(raw) === 'center' ? 'text-center' : 'text-left'
}
