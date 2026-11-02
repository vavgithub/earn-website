import { defineField } from 'sanity'

export const TEXT_SIZE_VALUES = ['48', '40', '36', '32', '28', 'lg', 'md', 'sm', '14', 'xs'] as const

export type TextSizeValue = (typeof TEXT_SIZE_VALUES)[number]

export const TEXT_SIZE_OPTIONS = [
  { title: '48px', value: '48' },
  { title: '40px', value: '40' },
  { title: '36px', value: '36' },
  { title: '32px', value: '32' },
  { title: '28px', value: '28' },
  { title: '24px', value: 'lg' },
  { title: '20px', value: 'md' },
  { title: '16px', value: 'sm' },
  { title: '14px', value: '14' },
  { title: '12px', value: 'xs' },
] as const

export function textSizeOptions(leading: readonly { title: string; value: string }[] = []) {
  return [...leading, ...TEXT_SIZE_OPTIONS]
}

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
