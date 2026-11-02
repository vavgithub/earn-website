import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons'
import { BLOCK_PADDING_OPTIONS } from '../../lib/blockPaddingFields'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'
import { sectionBackgroundField } from '../../lib/sectionBackgroundField'
import { textColorField } from '../../lib/textColorField'
import { sectionHeadingLevelField } from '../../lib/sectionHeadingLevelField'
import { textSizeOptions } from '../../lib/textSizeField'

const IMAGE_POSITIONS = [
  { title: 'Top', value: 'top' },
  { title: 'Center', value: 'center' },
  { title: 'Bottom', value: 'bottom' },
  { title: 'Left', value: 'left' },
  { title: 'Right', value: 'right' },
  { title: 'Top left', value: 'top left' },
  { title: 'Bottom left', value: 'bottom left' },
  { title: 'Top right', value: 'top right' },
  { title: 'Bottom right', value: 'bottom right' },
] as const

const textBoxSpacingFieldset = {
  name: 'copyPadding',
  title: 'Space inside the text box',
  options: { columns: 2 as const },
} as const

const bannerSpacingFieldset = {
  name: 'bannerSpacing',
  title: 'Space around the banner',
  options: { columns: 2 as const },
} as const

const fontStyleFieldset = {
  name: 'fontStyle',
  title: 'Heading',
  options: { columns: 3 as const },
} as const

const bodyStyleFieldset = {
  name: 'bodyStyle',
  title: 'Body',
  options: { columns: 2 as const },
} as const

const buttonStyleFieldset = {
  name: 'buttonStyle',
  title: 'Button',
  options: { columns: 2 as const },
} as const

function hideWithoutButton(parent: { buttonKind?: string } | undefined) {
  const kind = parent?.buttonKind
  return kind === 'none' || !kind
}

function isColorBackground(parent: { backgroundMode?: string } | undefined) {
  return parent?.backgroundMode === 'color'
}

export default defineType({
  name: 'bannerBlock',
  title: 'Banner',
  type: 'object',
  icon: ImageIcon,
  description:
    'Full-width banner. Leave the spacing empty to match the homepage. Add a button only when this banner needs one.',
  fieldsets: [fontStyleFieldset, bodyStyleFieldset, buttonStyleFieldset, textBoxSpacingFieldset, bannerSpacingFieldset],
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      rows: 3,
      description: 'One line per row. On desktop each row is its own line.',
    }),
    sectionHeadingLevelField({
      name: 'headingLevel',
      initialValue: 'h1',
      fieldset: fontStyleFieldset.name,
      description: '',
    }),
    textColorField({
      name: 'fontColor',
      title: 'Text color',
      description: '',
      initialValue: 'offWhite',
      fieldset: fontStyleFieldset.name,
    }),
    defineField({
      name: 'fontSize',
      title: 'Text size',
      type: 'string',
      fieldset: fontStyleFieldset.name,
      options: {
        list: textSizeOptions([{ title: 'Same as the homepage', value: 'default' }]),
        layout: 'dropdown',
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 6,
      description: 'Separate paragraphs with a blank line.',
    }),
    textColorField({
      name: 'bodyColor',
      title: 'Text color',
      description: 'Color of the body. Leave empty to keep the design color.',
      fieldset: bodyStyleFieldset.name,
    }),
    defineField({
      name: 'bodySize',
      title: 'Text size',
      type: 'string',
      fieldset: bodyStyleFieldset.name,
      description: 'Size of the body. Leave empty to keep the design size.',
      options: {
        list: textSizeOptions(),
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'copyOpacity',
      title: 'Text box opacity',
      type: 'number',
      description: 'How solid the text box is, from 0 to 100. 40 matches the homepage.',
      initialValue: 40,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'buttonKind',
      title: 'Button or text link',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Button', value: 'button' },
          { title: 'Text link', value: 'textLink' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button label',
      type: 'string',
      hidden: ({ parent }) => hideWithoutButton(parent),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in a new tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => hideWithoutButton(parent),
    }),
    defineField({
      name: 'buttonUrl',
      title: 'Button URL',
      type: 'string',
      description: 'Internal path such as /contact, or a full https URL.',
      hidden: ({ parent }) => hideWithoutButton(parent),
    }),
    textColorField({
      name: 'buttonColor',
      title: 'Text color',
      description: 'Fill color for a button. Text color for a text link.',
      initialValue: 'brightYellow',
      fieldset: buttonStyleFieldset.name,
      hidden: ({ parent }) => hideWithoutButton(parent),
    }),
    defineField({
      name: 'buttonSize',
      title: 'Text size',
      type: 'string',
      fieldset: buttonStyleFieldset.name,
      options: {
        list: textSizeOptions(),
        layout: 'dropdown',
      },
      hidden: ({ parent }) => hideWithoutButton(parent),
    }),
    defineField({
      name: 'backgroundMode',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'Background image', value: 'image' },
          { title: 'Background color', value: 'color' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
    }),
    defineField({
      name: 'image',
      title: 'Background image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => isColorBackground(parent),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image alt text',
      type: 'string',
      description: 'Leave empty when the image is decorative.',
      hidden: ({ parent }) => isColorBackground(parent),
    }),
    defineField({
      name: 'imageFit',
      title: 'Background image property',
      type: 'string',
      options: {
        list: [
          { title: 'Fill & Fit', value: 'fillFit' },
          { title: 'No-resize', value: 'noResize' },
        ],
        layout: 'radio',
      },
      initialValue: 'fillFit',
      hidden: ({ parent }) => isColorBackground(parent),
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      options: {
        list: [...IMAGE_POSITIONS],
        layout: 'dropdown',
      },
      initialValue: 'center',
      hidden: ({ parent }) => isColorBackground(parent),
    }),
    {
      ...sectionBackgroundField({ initialValue: 'medCoolGrey' }),
      title: 'Background color',
      hidden: ({ parent }) => !isColorBackground(parent),
    },
    defineField({
      name: 'copyPaddingTop',
      title: 'Space above the heading',
      type: 'string',
      fieldset: textBoxSpacingFieldset.name,
      description: 'Space inside the text box, above the heading. Leave empty to match the homepage.',
      options: { list: [...BLOCK_PADDING_OPTIONS], layout: 'dropdown' },
    }),
    defineField({
      name: 'copyPaddingBottom',
      title: 'Space below the text',
      type: 'string',
      fieldset: textBoxSpacingFieldset.name,
      description: 'Space inside the text box, below the last paragraph. Leave empty to match the homepage.',
      options: { list: [...BLOCK_PADDING_OPTIONS], layout: 'dropdown' },
    }),
    defineField({
      name: 'paddingTop',
      title: 'Space above the banner',
      type: 'string',
      fieldset: bannerSpacingFieldset.name,
      description: 'Space above the whole banner. Leave empty to match the homepage.',
      options: { list: [...BLOCK_PADDING_OPTIONS], layout: 'dropdown' },
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Space below the banner',
      type: 'string',
      fieldset: bannerSpacingFieldset.name,
      description: 'Space below the whole banner, before the next section. Leave empty to match the homepage.',
      options: { list: [...BLOCK_PADDING_OPTIONS], layout: 'dropdown' },
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      const firstLine = typeof heading === 'string' ? heading.split('\n')[0] : ''
      return pageBuilderBlockPreview('bannerBlock', firstLine, 'Banner')
    },
  },
})
