import type { CSSProperties } from 'react'
import { stegaClean } from 'next-sanity'
import {
  TEXT_COLOR_HEX,
  TEXT_COLOR_LEGACY_ALIASES,
  TEXT_COLOR_VALUES,
  type TextColorValue,
} from '@/sanity/lib/textColorField'

export { TEXT_COLOR_HEX }

export type { TextColorValue }

export const TEXT_COLOR_CLASS: Record<TextColorValue, string> = {
  darkSlate: 'text-[#141924]',
  medSlate: 'text-[#171E30]',
  slate: 'text-[#1F2942]',
  graySlate: 'text-[#2C3242]',
  offBlack: 'text-[#0F0F0F]',
  darkGray: 'text-[#1C1E24]',
  medWarmGray: 'text-[#202124]',
  medCoolGrey: 'text-[#252930]',
  grey: 'text-[#606060]',
  lightGrey: 'text-[#B3B3B3]',
  offWhite: 'text-[#FCFCFA]',
  brightYellow: 'text-[#EDA51C]',
  yellow: 'text-[#F6BF8A]',
}

/** Inline color from CMS palette (do not rely on Tailwind for runtime token picks). */
export function textColorStyle(
  raw: unknown,
  fallback: TextColorValue = 'darkSlate',
): CSSProperties {
  const token = parseTextColor(raw, fallback)
  return { color: TEXT_COLOR_HEX[token] }
}

/** Portable-text link — inline color + underline (Tailwind cannot purge palette hex classes from `lib/`). */
export function linkMarkProps(color: TextColorValue): { className: string; style: CSSProperties } {
  const token = parseTextColor(color, color)
  const hex = TEXT_COLOR_HEX[token]
  return {
    className: 'underline underline-offset-2',
    style: { color: hex, textDecorationColor: hex },
  }
}

/** @deprecated Prefer `linkMarkProps` for rendered links. */
export function linkColorClasses(color: TextColorValue): string {
  return linkMarkProps(color).className
}

export function parseTextColor(raw: unknown, fallback: TextColorValue): TextColorValue {
  const s = stegaClean(typeof raw === 'string' ? raw : String(raw ?? '')).trim()
  if (s in TEXT_COLOR_LEGACY_ALIASES) {
    return TEXT_COLOR_LEGACY_ALIASES[s]
  }
  if ((TEXT_COLOR_VALUES as readonly string[]).includes(s)) {
    return s as TextColorValue
  }
  return fallback
}

export function textColorClass(raw: unknown, fallback: TextColorValue = 'darkSlate'): string {
  return TEXT_COLOR_CLASS[parseTextColor(raw, fallback)]
}
