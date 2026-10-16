import {
  TEXT_COLOR_HEX,
  TEXT_COLOR_LABELS,
  TEXT_COLOR_VALUES,
  type TextColorValue,
} from '@/sanity/lib/textColorField'

/** Darker fills — default section copy to off-white. */
const LIGHT_TEXT_BACKGROUNDS = new Set<TextColorValue>([
  'blackGreen',
  'darkGreen',
  'green',
  'darkBeige',
  'coral',
])

function brandColorBackground(value: TextColorValue) {
  const hex = TEXT_COLOR_HEX[value]
  return {
    title: TEXT_COLOR_LABELS[value],
    hex,
    lightText: LIGHT_TEXT_BACKGROUNDS.has(value),
  }
}

const BRAND_COLOR_BACKGROUNDS = Object.fromEntries(
  TEXT_COLOR_VALUES.map((value) => [value, brandColorBackground(value)]),
) as Record<TextColorValue, ReturnType<typeof brandColorBackground>>

/** Brand section backgrounds — shared by Sanity Studio field + site render. */
export const SECTION_BACKGROUND_TOKENS = {
  ...BRAND_COLOR_BACKGROUNDS,
} as const

export type SectionBackgroundValue = keyof typeof SECTION_BACKGROUND_TOKENS

/** Default when the CMS field is unset; replaces legacy “Transparent”. */
export const DEFAULT_SECTION_BACKGROUND: SectionBackgroundValue = 'offWhite'

export function sectionBackgroundOptionLabel(value: SectionBackgroundValue): string {
  const token = SECTION_BACKGROUND_TOKENS[value]
  return token.hex ? `${token.title} (${token.hex})` : token.title
}

/** Off-white first — default section band color. */
const SECTION_BACKGROUND_STUDIO_ORDER: SectionBackgroundValue[] = [
  'offWhite',
  ...TEXT_COLOR_VALUES.filter((value) => value !== 'offWhite'),
]

export const SECTION_BACKGROUND_STUDIO_OPTIONS = SECTION_BACKGROUND_STUDIO_ORDER.map((value) => ({
  title: sectionBackgroundOptionLabel(value),
  value,
}))
