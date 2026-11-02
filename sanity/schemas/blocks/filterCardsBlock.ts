import { defineArrayMember, defineField, defineType } from 'sanity'
import { ThListIcon } from '@sanity/icons'
import {
  backgroundColorField,
  namedBackgroundField,
  openInNewTabField,
  headingFieldset,
  pairFieldset,
  spaceAroundFields,
  wordsColorField,
  wordsSizeField,
} from '../../lib/homeBlockFields'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'
import { sectionHeadingLevelField } from '../../lib/sectionHeadingLevelField'

const space = spaceAroundFields('filterSpace', 'Space around the filters')
const eyebrowStyle = pairFieldset('eyebrowStyle', 'Text above the title')
const headingStyle = headingFieldset('headingStyle')
const leadStyle = pairFieldset('leadStyle', 'Text under the title')
const menuStyle = pairFieldset('menuStyle', 'Filter menu label')
const filterColors = pairFieldset('filterColors', 'Filters')
const filterNameStyle = pairFieldset('filterNameStyle', 'Filter name')
const cardTextStyle = pairFieldset('cardTextStyle', 'Card text')
const brandStyle = pairFieldset('brandStyle', 'Name above the title')
const titleStyle = pairFieldset('titleStyle', 'Title')
const cardWords = pairFieldset('cardWords', 'Text')
const linkStyle = pairFieldset('linkStyle', 'Link label')
const tagColors = pairFieldset('tagColors', 'Tags')

export default defineType({
  name: 'filterCardsBlock',
  title: 'Filter cards',
  type: 'object',
  icon: ThListIcon,
  description: 'Cards with filters. Add or remove filters, then choose which filters show each card.',
  fieldsets: [
    eyebrowStyle,
    headingStyle,
    leadStyle,
    menuStyle,
    filterColors,
    cardTextStyle,
    space.fieldset,
  ],
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
    defineField({ name: 'lead', title: 'Text under the title', type: 'text', rows: 3 }),
    wordsColorField('leadColor', 'Text color', leadStyle.name),
    wordsSizeField('leadSize', 'Text size', leadStyle.name),
    defineField({
      name: 'showFilters',
      title: 'Show the filters',
      type: 'boolean',
      initialValue: true,
    }),
    backgroundColorField(),
    defineField({
      ...wordsColorField('filterButtonColor', 'Filter button color', filterColors.name),
      description: 'The fill of each filter.',
    }),
    defineField({
      ...wordsColorField('filterLabelColor', 'Filter label color', filterColors.name),
      description: 'The words on each filter.',
    }),
    ...space.fields,
    defineField({
      name: 'filterMenuLabel',
      title: 'Filter menu label',
      type: 'string',
      description: 'Shown on a phone when All is selected.',
    }),
    wordsColorField('filterMenuColor', 'Text color', menuStyle.name),
    wordsSizeField('filterMenuSize', 'Text size', menuStyle.name),
    defineField({
      name: 'filters',
      title: 'Filters',
      type: 'array',
      description: 'Add or remove filters. All is always shown and lists every card.',
      of: [
        defineArrayMember({
          name: 'filterOption',
          type: 'object',
          fieldsets: [filterNameStyle],
          fields: [
            defineField({ name: 'label', title: 'Filter name', type: 'string' }),
            wordsColorField('labelColor', 'Text color', filterNameStyle.name),
            wordsSizeField('labelSize', 'Text size', filterNameStyle.name),
          ],
          preview: {
            select: { title: 'label' },
            prepare({ title }) {
              return { title: title || 'Filter' }
            },
          },
        }),
      ],
    }),
    wordsColorField('cardTextColor', 'Card text color', cardTextStyle.name),
    wordsSizeField('cardTextSize', 'Card text size', cardTextStyle.name),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'filterCard',
          type: 'object',
          fieldsets: [brandStyle, titleStyle, cardWords, linkStyle, tagColors],
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
            wordsColorField('brandColor', 'Text color', brandStyle.name),
            wordsSizeField('brandSize', 'Text size', brandStyle.name),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            wordsColorField('titleColor', 'Text color', titleStyle.name),
            wordsSizeField('titleSize', 'Text size', titleStyle.name),
            defineField({
              name: 'body',
              title: 'Text',
              type: 'text',
              rows: 4,
              description: 'Separate paragraphs with a blank line.',
            }),
            wordsColorField('textColor', 'Text color', cardWords.name),
            wordsSizeField('textSize', 'Text size', cardWords.name),
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
            wordsColorField('linkColor', 'Link color', linkStyle.name),
            wordsSizeField('linkSize', 'Link size', linkStyle.name),
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
            wordsColorField('chipLabelColor', 'Tag label color', tagColors.name),
            namedBackgroundField('chipBackground', 'Tag color', tagColors.name),
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
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      const first = typeof heading === 'string' ? heading.split('\n')[0] : ''
      return pageBuilderBlockPreview('filterCardsBlock', first, 'Filter cards')
    },
  },
})
