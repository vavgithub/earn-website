import { textColorStyle, type TextColorValue } from '@/lib/cmsTextColor'

/** Figma Headlines/Med.Tight — Mokoko 24px / 26px line-height, weight 400 */
export const EYEBROW_TYPOGRAPHY_CLASS = 'font-mokoko text-[24px] font-normal leading-[26px]'

export function eyebrowTextClassName(
  color: TextColorValue,
  options?: { extra?: string },
): string {
  return ['m-0', EYEBROW_TYPOGRAPHY_CLASS, options?.extra].filter(Boolean).join(' ')
}

export function eyebrowTextStyle(color: TextColorValue): { style: ReturnType<typeof textColorStyle> } {
  return { style: textColorStyle(color, color) }
}
