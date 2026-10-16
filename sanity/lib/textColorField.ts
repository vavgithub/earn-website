import { defineField } from 'sanity'

export const TEXT_COLOR_VALUES = [
  'blackGreen',
  'darkGreen',
  'green',
  'lightGreen',
  'darkBeige',
  'beige',
  'lightBeige',
  'cream',
  'offWhite',
  'coral',
] as const

export type TextColorValue = (typeof TEXT_COLOR_VALUES)[number]

/** Brand hex values — single source for Studio labels and frontend. */
export const TEXT_COLOR_HEX: Record<TextColorValue, `#${string}`> = {
  blackGreen: '#141D19',
  darkGreen: '#142D21',
  green: '#378457',
  lightGreen: '#A4DEC2',
  darkBeige: '#5B5F53',
  beige: '#A0A691',
  lightBeige: '#E9E9D7',
  cream: '#F7FBEB',
  offWhite: '#FDFDFB',
  coral: '#E66547',
}

export const TEXT_COLOR_LABELS: Record<TextColorValue, string> = {
  blackGreen: 'Black-green',
  darkGreen: 'Dark green',
  green: 'Green',
  lightGreen: 'Light green',
  darkBeige: 'Dark beige',
  beige: 'Beige',
  lightBeige: 'Light beige',
  cream: 'Cream',
  offWhite: 'Off-white',
  coral: 'Coral',
}

/** Pre-rename Sanity values still stored in documents. */
export const TEXT_COLOR_LEGACY_ALIASES: Record<string, TextColorValue> = {
  offBlack: 'blackGreen',
  stoneGray: 'darkBeige',
  softBeige: 'lightBeige',
  mintCream: 'cream',
}

export const TEXT_COLOR_OPTIONS = TEXT_COLOR_VALUES.map((value) => ({
  title: `${TEXT_COLOR_LABELS[value]} (${TEXT_COLOR_HEX[value]})`,
  value,
}))

type TextColorFieldHidden = boolean | ((context: { parent?: unknown; path?: unknown }) => boolean)

type TextColorFieldOptions = {
  name: string
  title?: string
  description?: string
  initialValue?: TextColorValue
  hidden?: TextColorFieldHidden
  fieldset?: string
}

/**
 * When enabled, every inline link in this rich text field opens in a new tab.
 * Only add on `bodyRichTextFieldset` / `nestedRichTextRowFields` rows (editor + size + colors + this toggle).
 */
export function linksOpenInNewTabField({
  name,
  fieldset,
  title = 'Open links in new tab',
  description = 'When enabled, every link in this text opens in a new browser tab.',
  hidden,
}: {
  name: string
  fieldset?: string
  title?: string
  description?: string
  hidden?: TextColorFieldHidden
}) {
  return defineField({
    name,
    title,
    type: 'boolean',
    description,
    initialValue: false,
    ...(fieldset ? { fieldset } : {}),
    hidden,
  })
}

/** Link color for rich text (`blockContent`) rows — same palette as text color. */
export function linkColorField({
  name,
  title = 'Link color',
  description = 'Links in this content.',
  initialValue = 'green',
  hidden,
  fieldset,
}: Omit<TextColorFieldOptions, 'initialValue'> & {
  initialValue?: TextColorValue
}) {
  return textColorField({
    name,
    title,
    description,
    initialValue,
    hidden,
    fieldset,
  })
}

/** Body text color on rich-text rows (below the editor). */
export function bodyTextColorField({
  name,
  initialValue = 'blackGreen',
  hidden,
  fieldset,
}: Omit<TextColorFieldOptions, 'title' | 'description'>) {
  return textColorField({
    name,
    title: 'Text color',
    description: 'Body text color',
    initialValue,
    hidden,
    fieldset,
  })
}

/** Compact color dropdown for text+color fieldset rows. */
export function textColorField({
  name,
  title = 'Color',
  description = 'Text color',
  initialValue = 'blackGreen',
  hidden,
  fieldset,
}: TextColorFieldOptions) {
  return defineField({
    name,
    title,
    type: 'string',
    description,
    options: {
      list: [...TEXT_COLOR_OPTIONS],
      layout: 'dropdown',
    },
    ...(initialValue !== undefined ? { initialValue } : {}),
    ...(fieldset ? { fieldset } : {}),
    hidden,
  })
}
