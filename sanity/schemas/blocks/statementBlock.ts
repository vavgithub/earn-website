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
import { TEXT_COLOR_OPTIONS } from '../../lib/textColorField'
import { legacyPlainTextInput } from '../../components/LegacyPlainTextInput'
import { layoutWidthOptions } from './layoutWidthField'

const space = spaceAroundFields()
const eyebrowStyle = pairFieldset('eyebrowStyle', 'Eyebrow')
const headingStyle = headingFieldset('headingStyle')
const subtitleStyle = {
  name: 'subtitleStyle',
  title: 'Text',
  options: { columns: 3 as const },
}

export default defineType({
  name: 'statementBlock',
  title: 'Statement',
  type: 'object',
  icon: BlockquoteIcon,
  description: 'A short statement.',
  fieldsets: [eyebrowStyle, headingStyle, subtitleStyle, space.fieldset],
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    wordsColorField('eyebrowColor', 'Text color', eyebrowStyle.name),
    wordsSizeField('eyebrowSize', 'Text size', eyebrowStyle.name),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      rows: 3,
    }),
    sectionHeadingLevelField({
      name: 'headingLevel',
      fieldset: headingStyle.name,
      description: '',
    }),
    wordsColorField('headingColor', 'Text color', headingStyle.name),
    wordsSizeField('headingSize', 'Text size', headingStyle.name),
    defineField({
      name: 'subtitle',
      title: 'Text',
      type: 'blockContent',
      components: { input: legacyPlainTextInput('lines') },
    }),
    wordsColorField('subtitleColor', 'Text color', subtitleStyle.name),
    wordsSizeField('subtitleSize', 'Text size', subtitleStyle.name),
    defineField({
      name: 'subtitleLinkColor',
      title: 'Link color',
      type: 'string',
      fieldset: subtitleStyle.name,
      options: { list: [...TEXT_COLOR_OPTIONS], layout: 'dropdown' },
    }),
    backgroundColorField(),
    defineField({
      name: 'layoutWidth',
      title: 'Column width',
      type: 'string',
      description: 'Optional. Content is the default.',
      initialValue: 'content',
      options: {
        list: layoutWidthOptions,
        layout: 'dropdown',
      },
    }),
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
