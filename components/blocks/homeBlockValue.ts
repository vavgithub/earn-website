import type { CSSProperties } from 'react'
import { stegaClean } from 'next-sanity'
import { parseBlockPadding } from '@/lib/blockPadding'
import { TEXT_COLOR_HEX, parseTextColor } from '@/lib/cmsTextColor'
import { sectionBackgroundStyle } from '@/lib/sectionBackground'
import { urlForImage } from '@/sanity/lib/image'

const SPACE: Record<string, string> = {
  none: '0px',
  xs: '12px',
  sm: '24px',
  md: '48px',
  lg: '80px',
  xl: '160px',
  xxl: '200px',
}

const TEXT_SIZE: Record<string, string> = {
  lg: '1.5rem',
  md: '1.25rem',
  sm: '1rem',
  xs: '0.75rem',
}

export function clean(value: unknown) {
  return stegaClean(typeof value === 'string' ? value : '').trim()
}

export function imageUrl(value: unknown, width = 1600) {
  const image = value as { asset?: { _ref?: string } } | undefined
  if (!image?.asset) return undefined
  const builder = urlForImage(image)
  if (!builder) return undefined
  const ref = image.asset._ref ?? ''
  if (ref.endsWith('-svg')) return builder.url()
  return builder.width(width).quality(70).url()
}

export function colorOf(value: unknown) {
  const key = clean(value)
  if (!key) return undefined
  return TEXT_COLOR_HEX[parseTextColor(key, 'offWhite')]
}

export function sizeOf(value: unknown) {
  return TEXT_SIZE[clean(value)]
}

export function textStyle(color: unknown, size: unknown): CSSProperties | undefined {
  const style: CSSProperties = {}
  const paint = colorOf(color)
  const fontSize = sizeOf(size)
  if (paint) style.color = paint
  if (fontSize) style.fontSize = fontSize
  return Object.keys(style).length > 0 ? style : undefined
}

export function areaStyle(
  block: Record<string, unknown>,
  colorField = 'textColor',
  paintWords = true,
): CSSProperties | undefined {
  const style: CSSProperties & Record<string, string> = {}
  if (clean(block.sectionBackground)) Object.assign(style, sectionBackgroundStyle(block.sectionBackground))
  const top = parseBlockPadding(block.paddingTop)
  const bottom = parseBlockPadding(block.paddingBottom)
  if (top) style.paddingTop = SPACE[top]
  if (bottom) style.paddingBottom = SPACE[bottom]
  if (paintWords) {
    const paint = colorOf(block[colorField])
    const fontSize = sizeOf(block.textSize)
    if (paint) style.color = paint
    if (fontSize) style.fontSize = fontSize
  }
  return Object.keys(style).length > 0 ? style : undefined
}

/** Adds CSS variables only when a value is set, so an empty field keeps the current look. */
export function paintVars(
  base: CSSProperties | undefined,
  vars: Record<string, string | undefined>,
): CSSProperties | undefined {
  const style: CSSProperties = { ...(base ?? {}) }
  const custom = style as CSSProperties & Record<string, string>
  for (const [key, value] of Object.entries(vars)) {
    if (value) custom[key] = value
  }
  return Object.keys(style).length > 0 ? style : undefined
}

export function paragraphs(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}
