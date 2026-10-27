import type { CSSProperties } from 'react'
import type { SectionHeadingLevel } from '@/lib/cmsSectionHeadingLevel'
import { textColorStyle, type TextColorValue } from '@/lib/cmsTextColor'

/** IBM Plex Sans section title styles for optional block headings (H1–H3). */
export function sectionHeadingClassName(level: SectionHeadingLevel): string {
  const base = 'm-0 pb-12 text-left font-plex-sans font-normal whitespace-pre-line'

  switch (level) {
    case 'h1':
      return `${base} text-[40px] leading-[44px]`
    case 'h3':
      return `${base} text-2xl leading-8 md:text-[28px] md:leading-9`
    default:
      return `${base} text-[32px] leading-10`
  }
}

export function sectionHeadingStyle(
  color: TextColorValue,
  colorFallback: TextColorValue = 'yellow',
): CSSProperties {
  return textColorStyle(color, colorFallback)
}

export function sectionHeadingTag(level: SectionHeadingLevel): 'h1' | 'h2' | 'h3' {
  return level
}
