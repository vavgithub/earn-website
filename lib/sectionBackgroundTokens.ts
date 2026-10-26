/** Background colors from the Earn Figma list. Separate from the font list. */
export const SECTION_BACKGROUND_VALUES = [
  'darkSlate',
  'medSlate',
  'slate',
  'graySlate',
  'darkGray',
  'medWarmGray',
  'medCoolGrey',
  'grey',
  'lightGrey',
  'whiteGrey',
  'offWhite',
  'yellow',
  'cream',
] as const

export type SectionBackgroundValue = (typeof SECTION_BACKGROUND_VALUES)[number]

export const SECTION_BACKGROUND_TOKENS: Record<
  SectionBackgroundValue,
  { title: string; hex: `#${string}`; lightText: boolean }
> = {
  darkSlate: { title: 'Dark Slate', hex: '#141924', lightText: true },
  medSlate: { title: 'Med Slate', hex: '#171E30', lightText: true },
  slate: { title: 'Slate', hex: '#1F2942', lightText: true },
  graySlate: { title: 'Gray Slate', hex: '#2C3242', lightText: true },
  darkGray: { title: 'Dark Gray', hex: '#1C1E24', lightText: true },
  medWarmGray: { title: 'Med Warm Gray', hex: '#202124', lightText: true },
  medCoolGrey: { title: 'Med Cool Grey', hex: '#252930', lightText: true },
  grey: { title: 'Grey', hex: '#606060', lightText: true },
  lightGrey: { title: 'Light Grey', hex: '#B3B3B3', lightText: false },
  whiteGrey: { title: 'White Grey', hex: '#F7F7F5', lightText: false },
  offWhite: { title: 'Off-white', hex: '#FCFCFA', lightText: false },
  yellow: { title: 'Yellow', hex: '#F6BF8A', lightText: false },
  cream: { title: 'Cream', hex: '#F6ECE2', lightText: false },
}

/** Default when the CMS field is unset. */
export const DEFAULT_SECTION_BACKGROUND: SectionBackgroundValue = 'offWhite'

export function sectionBackgroundOptionLabel(value: SectionBackgroundValue): string {
  const token = SECTION_BACKGROUND_TOKENS[value]
  return `${token.title} (${token.hex})`
}

export const SECTION_BACKGROUND_STUDIO_OPTIONS = SECTION_BACKGROUND_VALUES.map((value) => ({
  title: sectionBackgroundOptionLabel(value),
  value,
}))
