import { defineField, defineType } from 'sanity'
import { BlockquoteIcon } from '@sanity/icons'
import {
  backgroundColorField,
  spaceAroundFields,
  wordsColorField,
  wordsSizeField,
} from '../../lib/homeBlockFields'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'

const space = spaceAroundFields()

export default defineType({
  name: 'statementBlock',
  title: 'Statement',
  type: 'object',
  icon: BlockquoteIcon,
  description: 'A short statement.',
  fieldsets: [space.fieldset],
  fields: [
    defineField({ name: 'eyebrow', title: 'Text above the title', type: 'string' }),
    wordsColorField('eyebrowColor', 'Text color'),
    wordsSizeField('eyebrowSize', 'Text size'),
    defineField({
      name: 'heading',
      title: 'Title',
      type: 'text',
      rows: 3,
      description: 'Put each line of the title on its own row.',
    }),
    wordsColorField('headingColor', 'Title color'),
    wordsSizeField('headingSize', 'Title size'),
    defineField({ name: 'subtitle', title: 'Text under the title', type: 'text', rows: 3 }),
    wordsColorField('subtitleColor', 'Text color'),
    wordsSizeField('subtitleSize', 'Text size'),
    backgroundColorField(),
    ...space.fields,
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      const first = typeof heading === 'string' ? heading.split('\n')[0] : ''
      return pageBuilderBlockPreview('statementBlock', first, 'Statement')
    },
  },
})
