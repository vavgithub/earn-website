import { defineField, defineType } from 'sanity'
import { BoltIcon } from '@sanity/icons'
import {
  backgroundColorField,
  openInNewTabField,
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
const introStyle = pairFieldset('introStyle', 'Text beside the title')
const panelTitleStyle = pairFieldset('panelTitleStyle', 'Box title')
const panelBodyStyle = pairFieldset('panelBodyStyle', 'Box text')
const buttonStyle = pairFieldset('buttonStyle', 'Button label')

export default defineType({
  name: 'calloutBlock',
  title: 'Callout',
  type: 'object',
  icon: BoltIcon,
  description: 'A closing callout with a button. This is separate from Call to action.',
  fieldsets: [eyebrowStyle, headingStyle, introStyle, panelTitleStyle, panelBodyStyle, buttonStyle, space.fieldset],
  fields: [
    defineField({ name: 'eyebrow', title: 'Text above the title', type: 'string' }),
    wordsColorField('eyebrowColor', 'Text color', eyebrowStyle.name),
    wordsSizeField('eyebrowSize', 'Text size', eyebrowStyle.name),
    defineField({ name: 'heading', title: 'Title', type: 'string' }),
    sectionHeadingLevelField({
      name: 'headingLevel',
      fieldset: headingStyle.name,
      description: '',
    }),
    wordsColorField('headingColor', 'Text color', headingStyle.name),
    wordsSizeField('headingSize', 'Text size', headingStyle.name),
    defineField({ name: 'intro', title: 'Text beside the title', type: 'text', rows: 3 }),
    wordsColorField('introColor', 'Text color', introStyle.name),
    wordsSizeField('introSize', 'Text size', introStyle.name),
    defineField({ name: 'panelTitle', title: 'Box title', type: 'string' }),
    wordsColorField('panelTitleColor', 'Text color', panelTitleStyle.name),
    wordsSizeField('panelTitleSize', 'Text size', panelTitleStyle.name),
    defineField({
      name: 'panelBody',
      title: 'Box text',
      type: 'text',
      rows: 3,
      description: 'Put each line on its own row.',
    }),
    wordsColorField('panelBodyColor', 'Text color', panelBodyStyle.name),
    wordsSizeField('panelBodySize', 'Text size', panelBodyStyle.name),
    defineField({ name: 'buttonLabel', title: 'Button label', type: 'string' }),
    wordsColorField('buttonColor', 'Text color', buttonStyle.name),
    wordsSizeField('buttonSize', 'Text size', buttonStyle.name),
    defineField({
      name: 'buttonUrl',
      title: 'Button link',
      type: 'string',
      description: 'Where this button goes.',
    }),
    openInNewTabField(),
    defineField({
      name: 'showArrows',
      title: 'Show the arrows',
      type: 'boolean',
      initialValue: true,
    }),
    backgroundColorField(),
    ...space.fields,
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return pageBuilderBlockPreview('calloutBlock', heading, 'Callout')
    },
  },
})
