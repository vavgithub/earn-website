import type { CSSProperties } from 'react'
import { stegaClean } from 'next-sanity'
import {
  DEFAULT_SECTION_BACKGROUND,
  SECTION_BACKGROUND_TOKENS,
  type SectionBackgroundValue,
} from '@/lib/sectionBackgroundTokens'

export type { SectionBackgroundValue }
export { DEFAULT_SECTION_BACKGROUND } from '@/lib/sectionBackgroundTokens'

const LEGACY_ALIASES: Record<string, SectionBackgroundValue> = {
  transparent: 'offWhite',
  warmStone: 'whiteGrey',
  offBlack: 'darkSlate',
  stoneGray: 'grey',
  softBeige: 'whiteGrey',
  mintCream: 'cream',
  blackGreen: 'darkSlate',
  darkGreen: 'medSlate',
  green: 'yellow',
  lightGreen: 'yellow',
  darkBeige: 'grey',
  beige: 'lightGrey',
  lightBeige: 'whiteGrey',
  coral: 'yellow',
}

export function parseSectionBackground(value: unknown): SectionBackgroundValue {
  const v = stegaClean(typeof value === 'string' ? value : String(value ?? '')).trim()
  if (v in LEGACY_ALIASES) return LEGACY_ALIASES[v]
  if (v in SECTION_BACKGROUND_TOKENS) return v as SectionBackgroundValue
  return DEFAULT_SECTION_BACKGROUND
}

/** CMS value with per-block default when the field is unset (legacy documents). */
export function resolveSectionBackground(
  value: unknown,
  blockDefault: SectionBackgroundValue = DEFAULT_SECTION_BACKGROUND,
): SectionBackgroundValue {
  const raw = stegaClean(typeof value === 'string' ? value : String(value ?? '')).trim()
  if (!raw) return blockDefault
  return parseSectionBackground(raw)
}

function resolveBackgroundKey(
  value: unknown,
  blockDefault?: SectionBackgroundValue,
): SectionBackgroundValue {
  return blockDefault ? resolveSectionBackground(value, blockDefault) : parseSectionBackground(value)
}

/** Reserved for layout hooks; section fills use `sectionBackgroundStyle`. */
export function sectionBackgroundClassName(
  _value: unknown,
  _blockDefault?: SectionBackgroundValue,
): string {
  return ''
}

/** Inline background from CMS palette hex (Tailwind cannot purge dynamic `bg-[#…]`). */
export function sectionBackgroundStyle(
  value: unknown,
  blockDefault?: SectionBackgroundValue,
): CSSProperties {
  const key = resolveBackgroundKey(value, blockDefault)
  const hex = SECTION_BACKGROUND_TOKENS[key].hex
  return hex ? { backgroundColor: hex } : {}
}

export function sectionBackgroundTextClassName(
  value: unknown,
  blockDefault?: SectionBackgroundValue,
): string {
  const key = resolveBackgroundKey(value, blockDefault)
  return SECTION_BACKGROUND_TOKENS[key].lightText ? 'text-[#FCFCFA]' : 'text-[#141924]'
}

export function isSectionBackgroundDark(
  value: unknown,
  blockDefault?: SectionBackgroundValue,
): boolean {
  const key = resolveBackgroundKey(value, blockDefault)
  return SECTION_BACKGROUND_TOKENS[key].lightText
}
