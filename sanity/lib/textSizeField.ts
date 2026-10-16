import { defineField } from 'sanity'

export const TEXT_SIZE_VALUES = ['lg', 'md', 'sm', 'xs'] as const

export type TextSizeValue = (typeof TEXT_SIZE_VALUES)[number]

export const TEXT_SIZE_OPTIONS = [
  { title: 'Lg (24px)', value: 'lg' },
  { title: 'Med (20px)', value: 'md' },
  { title: 'Small (16px)', value: 'sm' },
  { title: 'XS (12px)', value: 'xs' },
] as const

type TextSizeFieldHidden = boolean | ((context: { parent?: unknown; path?: unknown }) => boolean)

type TextSizeFieldOptions = {
  name: string
  title?: string
  description?: string
  initialValue?: TextSizeValue
  hidden?: TextSizeFieldHidden
  fieldset?: string
}

/** Body copy size dropdown — place after color in body-text fieldset rows. */
export function textSizeField({
  name,
  title = 'Text size',
  description = 'Body text size',
  initialValue = 'md',
  hidden,
  fieldset,
}: TextSizeFieldOptions) {
  return defineField({
    name,
    title,
    type: 'string',
    description,
    options: {
      list: [...TEXT_SIZE_OPTIONS],
      layout: 'dropdown',
    },
    initialValue,
    ...(fieldset ? { fieldset } : {}),
    hidden,
  })
}
