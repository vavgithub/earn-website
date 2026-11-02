import { defineArrayMember, defineField, defineType } from 'sanity'
import { DocumentsIcon } from '@sanity/icons'
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
const itemTitleStyle = pairFieldset('itemTitleStyle', 'Title')
const itemBodyStyle = pairFieldset('itemBodyStyle', 'Text')
const itemButtonStyle = pairFieldset('itemButtonStyle', 'Button label')
const buttonStyle = pairFieldset('buttonStyle', 'Button')

export default defineType({
  name: 'proofListBlock',
  title: 'Proof list',
  type: 'object',
  icon: DocumentsIcon,
  description: 'A list of proof points.',
  fieldsets: [eyebrowStyle, headingStyle, buttonStyle, space.fieldset],
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
    wordsColorField('headingColor', 'Text color', headingStyle.name),
    wordsSizeField('headingSize', 'Text size', headingStyle.name),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      description: 'Add or remove items.',
      of: [
        defineArrayMember({
          name: 'proofItem',
          type: 'object',
          fieldsets: [itemTitleStyle, itemBodyStyle, itemButtonStyle],
          fields: [
            defineField({ name: 'logo', title: 'Logo or icon', type: 'image' }),
            defineField({ name: 'logoAlt', title: 'Logo name', type: 'string' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            wordsColorField('titleColor', 'Text color', itemTitleStyle.name),
            wordsSizeField('titleSize', 'Text size', itemTitleStyle.name),
            defineField({ name: 'body', title: 'Text', type: 'text', rows: 4 }),
            wordsColorField('bodyColor', 'Text color', itemBodyStyle.name),
            wordsSizeField('bodySize', 'Text size', itemBodyStyle.name),
            defineField({ name: 'buttonLabel', title: 'Button label', type: 'string' }),
            wordsColorField('buttonColor', 'Text color', itemButtonStyle.name),
            wordsSizeField('buttonSize', 'Text size', itemButtonStyle.name),
            defineField({
              name: 'buttonUrl',
              title: 'Button link',
              type: 'string',
              description: 'Where this button goes. Each item has its own link.',
            }),
            openInNewTabField(),
          ],
          preview: {
            select: { title: 'title', media: 'logo' },
            prepare({ title, media }) {
              return { title: title || 'Item', media }
            },
          },
        }),
      ],
    }),
    wordsColorField('buttonColor', 'Button color', buttonStyle.name),
    wordsSizeField('buttonSize', 'Button size', buttonStyle.name),
    defineField({
      name: 'imageSize',
      title: 'Logo size',
      type: 'string',
      options: {
        list: [
          { title: 'Same as the homepage', value: 'default' },
          { title: 'Small', value: 'sm' },
          { title: 'Medium', value: 'md' },
          { title: 'Large', value: 'lg' },
        ],
      },
      initialValue: 'default',
    }),
    backgroundColorField(),
    ...space.fields,
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      const first = typeof heading === 'string' ? heading.split('\n')[0] : ''
      return pageBuilderBlockPreview('proofListBlock', first, 'Proof list')
    },
  },
})
