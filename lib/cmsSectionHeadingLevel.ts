export type SectionHeadingLevel = 'h1' | 'h2' | 'h3'

const LEVELS: SectionHeadingLevel[] = ['h1', 'h2', 'h3']

export function parseSectionHeadingLevel(
  value: unknown,
  fallback: SectionHeadingLevel = 'h2',
): SectionHeadingLevel {
  const raw = typeof value === 'string' ? value.trim().toLowerCase() : ''
  return LEVELS.includes(raw as SectionHeadingLevel) ? (raw as SectionHeadingLevel) : fallback
}
