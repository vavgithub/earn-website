import { defineField } from 'sanity'

type SectionHeadingFieldHidden = boolean | ((context: { parent?: unknown; path?: unknown }) => boolean)

type SectionHeadingLevelFieldOptions = {
  name?: string
  fieldset?: string
  hidden?: SectionHeadingFieldHidden
  initialValue?: 'h1' | 'h2' | 'h3'
  description?: string
}

/** H1 / H2 / H3 for optional section titles (IBM Plex Sans heading above a block). */
export function sectionHeadingLevelField({
  name = 'sectionHeadingLevel',
  fieldset,
  hidden,
  initialValue = 'h2',
  description = 'Heading tag',
}: SectionHeadingLevelFieldOptions = {}) {
  return defineField({
    name,
    title: 'Heading tag',
    type: 'string',
    ...(description ? { description } : {}),
    fieldset,
    hidden,
    options: {
      list: [
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
      ],
      layout: 'dropdown',
    },
    initialValue,
  })
}
