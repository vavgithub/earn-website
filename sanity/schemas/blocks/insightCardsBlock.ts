import { defineArrayMember, defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'
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
  name: 'insightCardsBlock',
  title: 'Insight cards',
  type: 'object',
  icon: BookIcon,
  description: 'A row of insight cards.',
  fieldsets: [space.fieldset],
  fields: [
    defineField({ name: 'eyebrow', title: 'Text above the title', type: 'string' }),
    defineField({ name: 'heading', title: 'Title', type: 'text', rows: 3 }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      description: 'Add or remove cards.',
      of: [
        defineArrayMember({
          name: 'insightCard',
          type: 'object',
          fields: [
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'imageAlt', title: 'Image description', type: 'string' }),
            defineField({ name: 'kicker', title: 'Label on the card', type: 'string' }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'text',
              rows: 3,
              description: 'Put each line of the title on its own row.',
            }),
            defineField({ name: 'body', title: 'Text', type: 'text', rows: 4 }),
            defineField({ name: 'linkLabel', title: 'Link label', type: 'string' }),
            defineField({
              name: 'compactLinkLabel',
              title: 'Shorter link label',
              type: 'string',
              description: 'Shown on a phone. Leave empty to use the link label.',
            }),
            defineField({
              name: 'linkUrl',
              title: 'Link',
              type: 'string',
              description: 'Where this card’s link goes. Each card has its own link.',
            }),
            openInNewTabField(),
            defineField({
              name: 'roundImage',
              title: 'Round the photo corners',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'title', media: 'image' },
            prepare({ title, media }) {
              const first = typeof title === 'string' ? title.split('\n')[0] : ''
              return { title: first || 'Card', media }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'imageProportion',
      title: 'Image shape',
      type: 'string',
      options: {
        list: [
          { title: 'Same as the homepage', value: 'default' },
          { title: '9/16', value: '9/16' },
          { title: '1/1', value: '1/1' },
          { title: '3/4', value: '3/4' },
        ],
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'linkKind',
      title: 'Link style',
      type: 'string',
      options: {
        list: [
          { title: 'Text link', value: 'textLink' },
          { title: 'Button', value: 'button' },
        ],
      },
      initialValue: 'button',
    }),
    wordsColorField('linkColor', 'Link color'),
    wordsSizeField('linkSize', 'Link size'),
    defineField({
      name: 'showConclusion',
      title: 'Show the link under the cards',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'conclusionLabel', title: 'Link under the cards', type: 'string' }),
    defineField({ name: 'conclusionUrl', title: 'Link under the cards goes to', type: 'string' }),
    openInNewTabField('conclusionNewTab'),
    backgroundColorField(),
    wordsColorField('textColor', 'Text color'),
    wordsSizeField('textSize', 'Text size'),
    ...space.fields,
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      const first = typeof heading === 'string' ? heading.split('\n')[0] : ''
      return pageBuilderBlockPreview('insightCardsBlock', first, 'Insight cards')
    },
  },
})
