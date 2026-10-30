import { defineArrayMember, defineField, defineType } from 'sanity'
import { DocumentsIcon } from '@sanity/icons'
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
  name: 'proofListBlock',
  title: 'Proof list',
  type: 'object',
  icon: DocumentsIcon,
  description: 'A list of proof points.',
  fieldsets: [space.fieldset],
  fields: [
    defineField({ name: 'eyebrow', title: 'Text above the title', type: 'string' }),
    defineField({
      name: 'heading',
      title: 'Title',
      type: 'text',
      rows: 3,
      description: 'Put each line of the title on its own row.',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      description: 'Add or remove items.',
      of: [
        defineArrayMember({
          name: 'proofItem',
          type: 'object',
          fields: [
            defineField({ name: 'logo', title: 'Logo or icon', type: 'image' }),
            defineField({ name: 'logoAlt', title: 'Logo name', type: 'string' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'body', title: 'Text', type: 'text', rows: 4 }),
            defineField({ name: 'buttonLabel', title: 'Button label', type: 'string' }),
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
    wordsColorField('textColor', 'Text color'),
    wordsSizeField('textSize', 'Text size'),
    wordsColorField('buttonColor', 'Button color'),
    wordsSizeField('buttonSize', 'Button size'),
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
