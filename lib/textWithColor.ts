import { stegaClean } from 'next-sanity'
import { parseTextColor, type TextColorValue } from '@/lib/cmsTextColor'

function cleanText(s: unknown) {
  return stegaClean(typeof s === 'string' ? s : String(s ?? '')).trim()
}

type TextWithColorDoc = { text?: unknown; color?: unknown }

/**
 * Resolves CMS text + color from a grouped object (`{ text, color }`) or legacy flat fields.
 */
export function resolveTextWithColor(
  grouped: unknown,
  legacyColor: unknown,
  defaultColor: TextColorValue,
): { text: string; color: TextColorValue } {
  if (grouped && typeof grouped === 'object' && !Array.isArray(grouped)) {
    const row = grouped as TextWithColorDoc
    return {
      text: cleanText(row.text),
      color: parseTextColor(row.color, defaultColor),
    }
  }

  const text = typeof grouped === 'string' ? cleanText(grouped) : ''
  return {
    text,
    color: parseTextColor(legacyColor, defaultColor),
  }
}
