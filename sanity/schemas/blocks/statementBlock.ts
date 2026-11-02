import { defineField, defineType } from 'sanity'
import { BlockquoteIcon } from '@sanity/icons'
import {
  backgroundColorField,
  headingFieldset,
  pairFieldset,
  spaceAroundFields,
  wordsColorField,
  wordsSizeField,
} from '../../lib/homeBlockFields'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'
import { sectionHeadingLevelField } from '../../lib/sectionHeadingLevelField'

const space = spaceAroundFields()
const eyebrowStyle = pairFieldset('eyebrowStyle', 'Text above the title')
const headingStyle = headingFieldset('headingStyle')
const subtitleStyle = pairFieldset('subtitleStyle', 'Text under the title')

export default defineType({
  name: 'statementBlock',
  title: 'Statement',
  type: 'object',
  icon: BlockquoteIcon,
  description: 'A short statement.',
  fieldsets: [eyebrowStyle, headingStyle, subtitleStyle, space.fieldset],
  fields: [
    defineField({ name: 'eyebrow', title: 'Text above the title', type: 'string' }),
    wordsColorField('eyebrowColor', 'Text color', eyebrowStyle.name),
    wordsSizeField('eyebrowSize', 'Text size', eyebrowStyle.name),
    defineField({
      name: 'heading',
      title: 'Title',
      type: 'text',
      rows: 3,
      description: 'Put each line of the title on its own row.',
    }),
    sectionHeadingLevelField({
      name: 'headingLevel',
      fieldset: headingStyle.name,
      description: '',
    }),
    wordsColorField('headingColor', 'Title color', headingStyle.name),
    wordsSizeField('headingSize', 'Title size', headingStyle.name),
    defineField({ name: 'subtitle', title: 'Text under the title', type: 'text', rows: 3 }),
    wordsColorField('subtitleColor', 'Text color', subtitleStyle.name),
    wordsSizeField('subtitleSize', 'Text size', subtitleStyle.name),
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
