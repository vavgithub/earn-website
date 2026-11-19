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
import { TEXT_COLOR_OPTIONS } from '../../lib/textColorField'
import { legacyPlainTextInput } from '../../components/LegacyPlainTextInput'
import { layoutWidthOptions } from './layoutWidthField'

const space = spaceAroundFields('filterSpace', 'Section padding')
const eyebrowStyle = pairFieldset('eyebrowStyle', 'Eyebrow')
const headingStyle = headingFieldset('headingStyle')
const leadStyle = {
  name: 'leadStyle',
  title: 'Text',
  options: { columns: 3 as const },
}
const menuStyle = pairFieldset('menuStyle', 'Filter menu label')
const filterColors = pairFieldset('filterColors', 'Filters')
const filterNameStyle = pairFieldset('filterNameStyle', 'Filter name')
const cardTextStyle = pairFieldset('cardTextStyle', 'Card text')
const brandStyle = pairFieldset('brandStyle', 'Eyebrow')
const titleStyle = pairFieldset('titleStyle', 'Heading')
const cardWords = {
  name: 'cardWords',
  title: 'Text',
  options: { columns: 3 as const },
}
const cardLink = {
  name: 'cardLink',
  title: 'Link',
  options: { columns: 2 as const },
}
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
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    wordsColorField('eyebrowColor', 'Text color', eyebrowStyle.name),
    wordsSizeField('eyebrowSize', 'Text size', eyebrowStyle.name),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      rows: 3,
    }),
    {
      ...sectionHeadingLevelField({
        name: 'headingLevel',
        fieldset: headingStyle.name,
        description: '',
      }),
      title: 'Heading level',
    },
    wordsColorField('headingColor', 'Text color', headingStyle.name),
    wordsSizeField('headingSize', 'Text size', headingStyle.name),
    defineField({
      name: 'lead',
      title: 'Text',
      type: 'blockContent',
      components: { input: legacyPlainTextInput('flow') },
    }),
    wordsColorField('leadColor', 'Text color', leadStyle.name),
    wordsSizeField('leadSize', 'Text size', leadStyle.name),
    defineField({
      name: 'leadLinkColor',
      title: 'Link color',
      type: 'string',
      fieldset: leadStyle.name,
      options: { list: [...TEXT_COLOR_OPTIONS], layout: 'dropdown' },
    }),
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
          fieldsets: [brandStyle, titleStyle, cardWords, cardLink, linkStyle, tagColors],
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
            defineField({ name: 'brand', title: 'Eyebrow', type: 'string' }),
            wordsColorField('brandColor', 'Text color', brandStyle.name),
            wordsSizeField('brandSize', 'Text size', brandStyle.name),
            defineField({ name: 'title', title: 'Heading', type: 'text', rows: 2 }),
            wordsColorField('titleColor', 'Text color', titleStyle.name),
            wordsSizeField('titleSize', 'Text size', titleStyle.name),
            defineField({
              name: 'body',
              title: 'Text',
              type: 'blockContent',
              components: { input: legacyPlainTextInput('flow') },
            }),
            wordsColorField('textColor', 'Text color', cardWords.name),
            wordsSizeField('textSize', 'Text size', cardWords.name),
            defineField({
              name: 'bodyLinkColor',
              title: 'Link color',
              type: 'string',
              fieldset: cardWords.name,
              options: { list: [...TEXT_COLOR_OPTIONS], layout: 'dropdown' },
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
            defineField({ name: 'linkLabel', title: 'Link label', type: 'string' }),
            defineField({
              name: 'page',
              title: 'Page',
              type: 'reference',
              to: [{ type: 'page' }],
              weak: true,
              fieldset: cardLink.name,
              description: 'Pick a page on this site. Leave empty to use the URL.',
            }),
            defineField({
              name: 'linkUrl',
              title: 'URL',
              type: 'string',
              fieldset: cardLink.name,
              description: 'Used when no page is picked. Each card has its own link.',
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
      return pageBuilderBlockPreview('filterCardsBlock', first, 'Filter cards')
    },
  },
})
