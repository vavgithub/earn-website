import { defineArrayMember, defineField, defineType } from 'sanity'
import { ThListIcon } from '@sanity/icons'
import {
  backgroundColorField,
  namedBackgroundField,
  openInNewTabField,
  spaceAroundFields,
  wordsColorField,
  wordsSizeField,
} from '../../lib/homeBlockFields'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'

const space = spaceAroundFields('filterSpace', 'Space around the filters')

export default defineType({
  name: 'filterCardsBlock',
  title: 'Filter cards',
  type: 'object',
  icon: ThListIcon,
  description: 'Cards with filters. Add or remove filters, then choose which filters show each card.',
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
    defineField({ name: 'lead', title: 'Text under the title', type: 'text', rows: 3 }),
    defineField({
      name: 'showFilters',
      title: 'Show the filters',
      type: 'boolean',
      initialValue: true,
    }),
    backgroundColorField(),
    defineField({
      ...wordsColorField('filterButtonColor', 'Filter button color'),
      description: 'The fill of each filter.',
    }),
    defineField({
      ...wordsColorField('filterLabelColor', 'Filter label color'),
      description: 'The words on each filter.',
    }),
    ...space.fields,
    defineField({
      name: 'filterMenuLabel',
      title: 'Filter menu label',
      type: 'string',
      description: 'Shown on a phone when All is selected.',
    }),
    defineField({
      name: 'filters',
      title: 'Filters',
      type: 'array',
      description: 'Add or remove filters. All is always shown and lists every card.',
      of: [
        defineArrayMember({
          name: 'filterOption',
          type: 'object',
          fields: [defineField({ name: 'label', title: 'Filter name', type: 'string' })],
          preview: {
            select: { title: 'label' },
            prepare({ title }) {
              return { title: title || 'Filter' }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'filterCard',
          type: 'object',
          fields: [
            defineField({
              name: 'iconMode',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Icon', value: 'icon' },
                  { title: 'Image', value: 'image' },
                  { title: 'No icon', value: 'none' },
                ],
              },
              initialValue: 'icon',
            }),
            defineField({
              name: 'icon',
              title: 'Icon or image',
              type: 'image',
              hidden: ({ parent }) => parent?.iconMode === 'none',
            }),
            defineField({ name: 'brand', title: 'Name above the title', type: 'string' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({
              name: 'body',
              title: 'Text',
              type: 'text',
              rows: 4,
              description: 'Separate paragraphs with a blank line.',
            }),
            wordsColorField('textColor', 'Text color'),
            wordsSizeField('textSize', 'Text size'),
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
            defineField({ name: 'linkLabel', title: 'Link label', type: 'string' }),
            defineField({
              name: 'linkUrl',
              title: 'Link',
              type: 'string',
              description: 'Where this card’s link goes. Each card has its own link.',
            }),
            openInNewTabField(),
            wordsColorField('linkColor', 'Link color'),
            defineField({
              name: 'shownUnder',
              title: 'Shown under',
              type: 'array',
              description: 'Filter names that show this card. All always shows it.',
              of: [{ type: 'string' }],
            }),
            defineField({
              name: 'chips',
              title: 'Tags',
              type: 'array',
              description: 'Each tag is shown once. Add or remove tags here.',
              of: [{ type: 'string' }],
            }),
            wordsColorField('chipLabelColor', 'Tag label color'),
            namedBackgroundField('chipBackground', 'Tag color'),
            defineField({
              name: 'wide',
              title: 'Wider card',
              type: 'boolean',
              description: 'On for the large card at the start of the homepage.',
              initialValue: false,
            }),
            defineField({
              name: 'wideOnLargestScreen',
              title: 'Wide on the largest screen',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'title', media: 'icon' },
            prepare({ title, media }) {
              return { title: title || 'Card', media }
            },
          },
        }),
      ],
    }),
    wordsColorField('cardTextColor', 'Card text color'),
    wordsSizeField('cardTextSize', 'Card text size'),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      const first = typeof heading === 'string' ? heading.split('\n')[0] : ''
      return pageBuilderBlockPreview('filterCardsBlock', first, 'Filter cards')
    },
  },
})
