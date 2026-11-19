import { defineArrayMember, defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'
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
import { TEXT_COLOR_OPTIONS } from '../../lib/textColorField'
import { legacyPlainTextInput } from '../../components/LegacyPlainTextInput'
import { layoutWidthOptions } from './layoutWidthField'

const BUTTON_SIZES = [
  { title: 'Extra small (12px)', value: 'xs' },
  { title: 'Small (16px)', value: 'sm' },
  { title: 'Medium (18px)', value: 'button-md' },
  { title: 'Large (20px)', value: 'button-lg' },
  { title: 'Extra large (24px)', value: 'button-xl' },
]

const space = spaceAroundFields()
const eyebrowStyle = pairFieldset('eyebrowStyle', 'Eyebrow')
const textStyle = headingFieldset('textStyle')
const linkStyle = pairFieldset('linkStyle', 'Link')
const conclusionStyle = pairFieldset('conclusionStyle', 'Link under the cards')
const conclusionDestination = {
  name: 'conclusionDestination',
  title: 'Link under the cards goes to',
  options: { columns: 2 as const },
}
const kickerStyle = pairFieldset('kickerStyle', 'Label on the card')
const cardTitleStyle = pairFieldset('cardTitleStyle', 'Heading')
const cardBodyStyle = {
  name: 'cardBodyStyle',
  title: 'Text',
  options: { columns: 3 as const },
}
const cardDestination = {
  name: 'cardDestination',
  title: 'Link',
  options: { columns: 2 as const },
}

export default defineType({
  name: 'insightCardsBlock',
  title: 'Horizontal card list',
  type: 'object',
  icon: BookIcon,
  description: 'A row of insight cards.',
  fieldsets: [eyebrowStyle, textStyle, linkStyle, conclusionStyle, conclusionDestination, space.fieldset],
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    wordsColorField('eyebrowColor', 'Text color', eyebrowStyle.name),
    wordsSizeField('eyebrowSize', 'Text size', eyebrowStyle.name),
    defineField({ name: 'heading', title: 'Heading', type: 'text', rows: 3 }),
    sectionHeadingLevelField({
      name: 'headingLevel',
      fieldset: textStyle.name,
      description: '',
    }),
    wordsColorField('textColor', 'Text color', textStyle.name),
    wordsSizeField('textSize', 'Text size', textStyle.name),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      description: 'Add or remove cards.',
      of: [
        defineArrayMember({
          name: 'insightCard',
          type: 'object',
          fieldsets: [kickerStyle, cardTitleStyle, cardBodyStyle, cardDestination],
          fields: [
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'imageAlt', title: 'Image description', type: 'string' }),
            defineField({ name: 'kicker', title: 'Label on the card', type: 'string' }),
            wordsColorField('kickerColor', 'Text color', kickerStyle.name),
            wordsSizeField('kickerSize', 'Text size', kickerStyle.name),
            defineField({
              name: 'title',
              title: 'Heading',
              type: 'text',
              rows: 3,
            }),
            wordsColorField('titleColor', 'Text color', cardTitleStyle.name),
            wordsSizeField('titleSize', 'Text size', cardTitleStyle.name),
            defineField({
              name: 'body',
              title: 'Text',
              type: 'blockContent',
              components: { input: legacyPlainTextInput('flow') },
            }),
            wordsColorField('bodyColor', 'Text color', cardBodyStyle.name),
            wordsSizeField('bodySize', 'Text size', cardBodyStyle.name),
            defineField({
              name: 'bodyLinkColor',
              title: 'Link color',
              type: 'string',
              fieldset: cardBodyStyle.name,
              options: { list: [...TEXT_COLOR_OPTIONS], layout: 'dropdown' },
            }),
            defineField({ name: 'linkLabel', title: 'Link label', type: 'string' }),
            defineField({
              ...wordsColorField('linkColor', 'Text color'),
              hidden: true,
            }),
            defineField({
              ...wordsSizeField('linkSize', 'Text size'),
              hidden: true,
            }),
            defineField({
              name: 'compactLinkLabel',
              title: 'Shorter link label',
              type: 'string',
              description: 'Shown on a phone. Leave empty to use the link label.',
            }),
            defineField({
              name: 'page',
              title: 'Page',
              type: 'reference',
              to: [{ type: 'page' }],
              weak: true,
              fieldset: cardDestination.name,
              description: 'Pick a page on this site. Leave empty to use the URL.',
            }),
            defineField({
              name: 'linkUrl',
              title: 'URL',
              type: 'string',
              fieldset: cardDestination.name,
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
          { title: 'Ghost button', value: 'ghost' },
        ],
      },
      initialValue: 'button',
    }),
    wordsColorField('linkColor', 'Link color', linkStyle.name),
    defineField({
      name: 'linkSize',
      title: 'Link size',
      type: 'string',
      fieldset: linkStyle.name,
      options: { list: BUTTON_SIZES, layout: 'dropdown' },
    }),
    defineField({
      name: 'showConclusion',
      title: 'Show the link under the cards',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'conclusionLabel', title: 'Link under the cards', type: 'string' }),
    wordsColorField('conclusionColor', 'Text color', conclusionStyle.name),
    defineField({
      name: 'conclusionSize',
      title: 'Text size',
      type: 'string',
      fieldset: conclusionStyle.name,
      options: { list: BUTTON_SIZES, layout: 'dropdown' },
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: [{ type: 'page' }],
      weak: true,
      fieldset: conclusionDestination.name,
    }),
    defineField({
      name: 'conclusionUrl',
      title: 'URL',
      type: 'string',
      fieldset: conclusionDestination.name,
    }),
    openInNewTabField('conclusionNewTab'),
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
      return pageBuilderBlockPreview('insightCardsBlock', first, 'Horizontal card list')
    },
  },
})
