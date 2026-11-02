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

const space = spaceAroundFields()
const eyebrowStyle = pairFieldset('eyebrowStyle', 'Text above the title')
const textStyle = headingFieldset('textStyle')
const linkStyle = pairFieldset('linkStyle', 'Link')
const conclusionStyle = pairFieldset('conclusionStyle', 'Link under the cards')
const kickerStyle = pairFieldset('kickerStyle', 'Label on the card')
const cardTitleStyle = pairFieldset('cardTitleStyle', 'Title')
const cardBodyStyle = pairFieldset('cardBodyStyle', 'Text')
const cardLinkStyle = pairFieldset('cardLinkStyle', 'Link label')

export default defineType({
  name: 'insightCardsBlock',
  title: 'Insight cards',
  type: 'object',
  icon: BookIcon,
  description: 'A row of insight cards.',
  fieldsets: [eyebrowStyle, textStyle, linkStyle, conclusionStyle, space.fieldset],
  fields: [
    defineField({ name: 'eyebrow', title: 'Text above the title', type: 'string' }),
    wordsColorField('eyebrowColor', 'Text color', eyebrowStyle.name),
    wordsSizeField('eyebrowSize', 'Text size', eyebrowStyle.name),
    defineField({ name: 'heading', title: 'Title', type: 'text', rows: 3 }),
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
          fieldsets: [kickerStyle, cardTitleStyle, cardBodyStyle, cardLinkStyle],
          fields: [
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'imageAlt', title: 'Image description', type: 'string' }),
            defineField({ name: 'kicker', title: 'Label on the card', type: 'string' }),
            wordsColorField('kickerColor', 'Text color', kickerStyle.name),
            wordsSizeField('kickerSize', 'Text size', kickerStyle.name),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'text',
              rows: 3,
              description: 'Put each line of the title on its own row.',
            }),
            wordsColorField('titleColor', 'Text color', cardTitleStyle.name),
            wordsSizeField('titleSize', 'Text size', cardTitleStyle.name),
            defineField({ name: 'body', title: 'Text', type: 'text', rows: 4 }),
            wordsColorField('bodyColor', 'Text color', cardBodyStyle.name),
            wordsSizeField('bodySize', 'Text size', cardBodyStyle.name),
            defineField({ name: 'linkLabel', title: 'Link label', type: 'string' }),
            wordsColorField('linkColor', 'Text color', cardLinkStyle.name),
            wordsSizeField('linkSize', 'Text size', cardLinkStyle.name),
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
    wordsColorField('linkColor', 'Link color', linkStyle.name),
    wordsSizeField('linkSize', 'Link size', linkStyle.name),
    defineField({
      name: 'showConclusion',
      title: 'Show the link under the cards',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'conclusionLabel', title: 'Link under the cards', type: 'string' }),
    wordsColorField('conclusionColor', 'Text color', conclusionStyle.name),
    wordsSizeField('conclusionSize', 'Text size', conclusionStyle.name),
    defineField({ name: 'conclusionUrl', title: 'Link under the cards goes to', type: 'string' }),
    openInNewTabField('conclusionNewTab'),
    backgroundColorField(),
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
