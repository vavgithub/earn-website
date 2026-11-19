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
import { TEXT_COLOR_OPTIONS } from '../../lib/textColorField'
import { legacyPlainTextInput } from '../../components/LegacyPlainTextInput'
import { layoutWidthOptions } from './layoutWidthField'

const space = spaceAroundFields()
const eyebrowStyle = pairFieldset('eyebrowStyle', 'Eyebrow')
const headingStyle = headingFieldset('headingStyle')
const introStyle = {
  name: 'introStyle',
  title: 'Text beside the title',
  options: { columns: 3 as const },
}
const panelTitleStyle = pairFieldset('panelTitleStyle', 'Box title')
const panelBodyStyle = {
  name: 'panelBodyStyle',
  title: 'Box text',
  options: { columns: 3 as const },
}
const buttonStyle = pairFieldset('buttonStyle', 'Button label')
const buttonLink = {
  name: 'buttonLink',
  title: 'Button link',
  options: { columns: 2 as const },
}

const BUTTON_SIZES = [
  { title: 'Extra small (12px)', value: 'xs' },
  { title: 'Small (16px)', value: 'sm' },
  { title: 'Medium (18px)', value: 'button-md' },
  { title: 'Large (20px)', value: 'button-lg' },
  { title: 'Extra large (24px)', value: 'button-xl' },
]

function linkColorField(name: string, fieldset: string) {
  return defineField({
    name,
    title: 'Link color',
    type: 'string',
    fieldset,
    options: { list: [...TEXT_COLOR_OPTIONS], layout: 'dropdown' },
  })
}

export default defineType({
  name: 'calloutBlock',
  title: 'CTA',
  type: 'object',
  icon: BoltIcon,
  description: 'Eyebrow, heading, text, and a button.',
  fieldsets: [
    eyebrowStyle,
    headingStyle,
    introStyle,
    panelTitleStyle,
    panelBodyStyle,
    buttonStyle,
    buttonLink,
    space.fieldset,
  ],
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    wordsColorField('eyebrowColor', 'Text color', eyebrowStyle.name),
    wordsSizeField('eyebrowSize', 'Text size', eyebrowStyle.name),
    defineField({ name: 'heading', title: 'Heading', type: 'text', rows: 3 }),
    sectionHeadingLevelField({
      name: 'headingLevel',
      fieldset: headingStyle.name,
      description: '',
    }),
    wordsColorField('headingColor', 'Text color', headingStyle.name),
    wordsSizeField('headingSize', 'Text size', headingStyle.name),
    defineField({
      name: 'intro',
      title: 'Text',
      type: 'blockContent',
      description: 'Bold, italic, lists, and links. Text already on the page stays as it is until this is edited.',
      components: { input: legacyPlainTextInput('flow') },
    }),
    wordsColorField('introColor', 'Text color', introStyle.name),
    wordsSizeField('introSize', 'Text size', introStyle.name),
    linkColorField('introLinkColor', introStyle.name),
    defineField({ name: 'panelTitle', title: 'Box title', type: 'string' }),
    wordsColorField('panelTitleColor', 'Text color', panelTitleStyle.name),
    wordsSizeField('panelTitleSize', 'Text size', panelTitleStyle.name),
    defineField({
      name: 'panelBody',
      title: 'Box text',
      type: 'blockContent',
      description: 'Each new line shows as its own line. Bold, italic, lists, and links are available.',
      components: { input: legacyPlainTextInput('lines') },
    }),
    wordsColorField('panelBodyColor', 'Text color', panelBodyStyle.name),
    wordsSizeField('panelBodySize', 'Text size', panelBodyStyle.name),
    linkColorField('panelBodyLinkColor', panelBodyStyle.name),
    defineField({ name: 'buttonLabel', title: 'Button label', type: 'string' }),
    wordsColorField('buttonColor', 'Text color', buttonStyle.name),
    defineField({
      name: 'buttonSize',
      title: 'Size',
      type: 'string',
      fieldset: buttonStyle.name,
      description: 'Same sizes as the button. Leave empty to keep the current size.',
      options: { list: BUTTON_SIZES, layout: 'dropdown' },
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: [{ type: 'page' }],
      weak: true,
      fieldset: buttonLink.name,
      description: 'Pick a page on this site. Leave empty to use the URL.',
    }),
    defineField({
      name: 'buttonUrl',
      title: 'URL',
      type: 'string',
      fieldset: buttonLink.name,
      description: 'Used when no page is picked.',
    }),
    openInNewTabField(),
    defineField({
      name: 'showArrows',
      title: 'Show the arrows',
      type: 'boolean',
      initialValue: true,
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
      return pageBuilderBlockPreview('calloutBlock', heading, 'CTA')
    },
  },
})
