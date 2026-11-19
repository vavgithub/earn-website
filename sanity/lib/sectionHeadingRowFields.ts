import { defineField } from 'sanity'
import { textColorField } from './textColorField'
import { sectionHeadingLevelField } from './sectionHeadingLevelField'

type SectionHeadingRowFieldsHidden =
  | boolean
  | ((context: { parent?: unknown; path?: unknown }) => boolean)

/** Studio fieldset: heading full width; tag + color 50/50 below — see `studioFieldsetLayout.ts`. */
export function sectionHeadingRowFieldset(name = 'sectionHeadingRow', title = 'Section heading') {
  return {
    name,
    title,
    options: { columns: 2 as const },
  }
}

type SectionHeadingRowFieldsOptions = {
  hidden?: SectionHeadingRowFieldsHidden
  fieldset?: string
  headingDescription?: string
}

/** Section heading row: textarea heading, H1–H3 tag, color. */
export function sectionHeadingRowFields({
  hidden,
  fieldset = 'sectionHeadingRow',
  headingDescription = 'Section title',
}: SectionHeadingRowFieldsOptions = {}) {
  return [
    defineField({
      name: 'sectionHeading',
      title: 'Heading',
      type: 'text',
      rows: 3,
      description: headingDescription,
      fieldset,
      hidden,
    }),
    sectionHeadingLevelField({ fieldset, hidden }),
    textColorField({
      name: 'sectionHeadingColor',
      title: 'Color',
      description: 'Text color',
      initialValue: 'yellow',
      fieldset,
      hidden,
    }),
  ]
}
