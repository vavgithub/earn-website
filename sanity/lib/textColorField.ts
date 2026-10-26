import { defineField } from 'sanity'

/** Font colors from the Earn Figma list. */
export const TEXT_COLOR_VALUES = [
  'darkSlate',
  'medSlate',
  'slate',
  'graySlate',
  'offBlack',
  'darkGray',
  'medWarmGray',
  'medCoolGrey',
  'grey',
  'lightGrey',
  'offWhite',
  'brightYellow',
  'yellow',
] as const

export type TextColorValue = (typeof TEXT_COLOR_VALUES)[number]

/** Brand hex values — single source for Studio labels and frontend. */
export const TEXT_COLOR_HEX: Record<TextColorValue, `#${string}`> = {
  darkSlate: '#141924',
  medSlate: '#171E30',
  slate: '#1F2942',
  graySlate: '#2C3242',
  offBlack: '#0F0F0F',
  darkGray: '#1C1E24',
  medWarmGray: '#202124',
  medCoolGrey: '#252930',
  grey: '#606060',
  lightGrey: '#B3B3B3',
  offWhite: '#FCFCFA',
  brightYellow: '#EDA51C',
  yellow: '#F6BF8A',
}

export const TEXT_COLOR_LABELS: Record<TextColorValue, string> = {
  darkSlate: 'Dark Slate',
  medSlate: 'Med Slate',
  slate: 'Slate',
  graySlate: 'Gray Slate',
  offBlack: 'Off Black',
  darkGray: 'Dark Gray',
  medWarmGray: 'Med Warm Gray',
  medCoolGrey: 'Med Cool Grey',
  grey: 'Grey',
  lightGrey: 'Light Grey',
  offWhite: 'Off White',
  brightYellow: 'Bright Yellow',
  yellow: 'Yellow',
}

/** Pre-rebrand Sanity values still stored in documents. */
export const TEXT_COLOR_LEGACY_ALIASES: Record<string, TextColorValue> = {
  blackGreen: 'darkSlate',
  darkGreen: 'medSlate',
  green: 'brightYellow',
  lightGreen: 'yellow',
  darkBeige: 'grey',
  beige: 'lightGrey',
  lightBeige: 'lightGrey',
  cream: 'offWhite',
  coral: 'yellow',
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
  initialValue = 'brightYellow',
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
  initialValue = 'darkSlate',
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
  initialValue = 'darkSlate',
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
