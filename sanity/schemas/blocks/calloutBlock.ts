import { defineField, defineType } from 'sanity'
import { BoltIcon } from '@sanity/icons'
import {
  backgroundColorField,
  openInNewTabField,
  spaceAroundFields,
  wordsColorField,
  wordsSizeField,
} from '../../lib/homeBlockFields'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'

const space = spaceAroundFields()

export default defineType({
  name: 'calloutBlock',
  title: 'Callout',
  type: 'object',
  icon: BoltIcon,
  description: 'A closing callout with a button. This is separate from Call to action.',
  fieldsets: [space.fieldset],
  fields: [
    defineField({ name: 'eyebrow', title: 'Text above the title', type: 'string' }),
    defineField({ name: 'heading', title: 'Title', type: 'string' }),
    defineField({ name: 'intro', title: 'Text beside the title', type: 'text', rows: 3 }),
    defineField({ name: 'panelTitle', title: 'Box title', type: 'string' }),
    defineField({
      name: 'panelBody',
      title: 'Box text',
      type: 'text',
      rows: 3,
      description: 'Put each line on its own row.',
    }),
    defineField({ name: 'buttonLabel', title: 'Button label', type: 'string' }),
    defineField({
      name: 'buttonUrl',
      title: 'Button link',
      type: 'string',
      description: 'Where this button goes.',
    }),
    openInNewTabField(),
    wordsColorField('buttonColor', 'Button color'),
    wordsSizeField('buttonSize', 'Button size'),
    defineField({
      name: 'showArrows',
      title: 'Show the arrows',
      type: 'boolean',
      initialValue: true,
    }),
    backgroundColorField(),
    wordsColorField('textColor', 'Text color'),
    wordsSizeField('textSize', 'Text size'),
    ...space.fields,
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return pageBuilderBlockPreview('calloutBlock', heading, 'Callout')
    },
  },
})
