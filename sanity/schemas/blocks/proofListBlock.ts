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
const headingStyle = headingFieldset('headingStyle')
const itemTitleStyle = pairFieldset('itemTitleStyle', 'Title')
const itemBodyStyle = {
  name: 'itemBodyStyle',
  title: 'Text',
  options: { columns: 3 as const },
}
const itemLink = {
  name: 'itemLink',
  title: 'Button link',
  options: { columns: 2 as const },
}
const buttonStyle = pairFieldset('buttonStyle', 'Button')

export default defineType({
  name: 'proofListBlock',
  title: 'Vertical card list',
  type: 'object',
  icon: DocumentsIcon,
  description: 'A list of proof points.',
  fieldsets: [eyebrowStyle, headingStyle, buttonStyle, space.fieldset],
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
          fieldsets: [itemTitleStyle, itemBodyStyle, itemLink],
          fields: [
            defineField({ name: 'logo', title: 'Logo or icon', type: 'image' }),
            defineField({ name: 'logoAlt', title: 'Logo name', type: 'string' }),
            defineField({ name: 'title', title: 'Heading', type: 'text', rows: 2 }),
            wordsColorField('titleColor', 'Text color', itemTitleStyle.name),
            wordsSizeField('titleSize', 'Text size', itemTitleStyle.name),
            defineField({
              name: 'body',
              title: 'Text',
              type: 'blockContent',
              components: { input: legacyPlainTextInput('lines') },
            }),
            wordsColorField('bodyColor', 'Text color', itemBodyStyle.name),
            wordsSizeField('bodySize', 'Text size', itemBodyStyle.name),
            defineField({
              name: 'bodyLinkColor',
              title: 'Link color',
              type: 'string',
              fieldset: itemBodyStyle.name,
              options: { list: [...TEXT_COLOR_OPTIONS], layout: 'dropdown' },
            }),
            defineField({ name: 'buttonLabel', title: 'Button label', type: 'string' }),
            defineField({
              ...wordsColorField('buttonColor', 'Text color'),
              hidden: true,
            }),
            defineField({
              ...wordsSizeField('buttonSize', 'Text size'),
              hidden: true,
            }),
            defineField({
              name: 'page',
              title: 'Page',
              type: 'reference',
              to: [{ type: 'page' }],
              weak: true,
              fieldset: itemLink.name,
              description: 'Pick a page on this site. Leave empty to use the URL.',
            }),
            defineField({
              name: 'buttonUrl',
              title: 'URL',
              type: 'string',
              fieldset: itemLink.name,
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
    defineField({
      name: 'buttonSize',
      title: 'Button size',
      type: 'string',
      fieldset: buttonStyle.name,
      options: { list: BUTTON_SIZES, layout: 'dropdown' },
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
      return pageBuilderBlockPreview('proofListBlock', first, 'Vertical card list')
    },
  },
})
