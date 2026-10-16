import { stegaClean } from 'next-sanity'
import {
  TEXT_SIZE_VALUES,
  type TextSizeValue,
} from '@/sanity/lib/textSizeField'

export type { TextSizeValue }

/** Body paragraph / list size — headings use separate typography. */
export const TEXT_SIZE_BODY_CLASS: Record<TextSizeValue, string> = {
  lg: 'text-[24px] leading-[32px]',
  md: 'text-[20px] leading-[28px]',
  sm: 'text-[16px] leading-[24px]',
  xs: 'text-[12px] leading-[12px]',
}

export function parseTextSize(raw: unknown, fallback: TextSizeValue = 'md'): TextSizeValue {
  const s = stegaClean(typeof raw === 'string' ? raw : String(raw ?? '')).trim()
  if ((TEXT_SIZE_VALUES as readonly string[]).includes(s)) {
    return s as TextSizeValue
  }
  return fallback
}

export function textSizeBodyClass(raw: unknown, fallback: TextSizeValue = 'md'): string {
  return TEXT_SIZE_BODY_CLASS[parseTextSize(raw, fallback)]
}
