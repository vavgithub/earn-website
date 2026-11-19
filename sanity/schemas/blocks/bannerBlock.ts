import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons'
import { BLOCK_PADDING_OPTIONS } from '../../lib/blockPaddingFields'
import { BannerBodyInput } from '../../components/BannerBodyInput'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'
import { SECTION_BACKGROUND_STUDIO_OPTIONS } from '../../../lib/sectionBackgroundTokens'
import { sectionBackgroundField } from '../../lib/sectionBackgroundField'
import { textColorField } from '../../lib/textColorField'
import { sectionHeadingLevelField } from '../../lib/sectionHeadingLevelField'
import { textSizeOptions } from '../../lib/textSizeField'

const BUTTON_SIZES = [
  { title: 'Extra small (12px)', value: 'xs' },
  { title: 'Small (16px)', value: 'sm' },
  { title: 'Medium (18px)', value: 'button-md' },
  { title: 'Large (20px)', value: 'button-lg' },
  { title: 'Extra large (24px)', value: 'button-xl' },
]

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

const textBoxFieldset = {
  name: 'textBox',
  title: 'Text box',
  options: { columns: 3 as const },
} as const

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
  title: 'Text',
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

function isVideoBackground(parent: { backgroundMode?: string } | undefined) {
  return parent?.backgroundMode === 'video'
}

function hidesImage(parent: { backgroundMode?: string } | undefined) {
  return isColorBackground(parent) || isVideoBackground(parent)
}

export default defineType({
  name: 'bannerBlock',
  title: 'Hero',
  type: 'object',
  icon: ImageIcon,
  description:
    'Full-width area at the top of a page. Leave the spacing empty to match the homepage. Add a button only when this one needs one.',
  fieldsets: [fontStyleFieldset, bodyStyleFieldset, textBoxFieldset, buttonStyleFieldset, textBoxSpacingFieldset, bannerSpacingFieldset],
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
      title: 'Text',
      type: 'blockContent',
      components: { input: BannerBodyInput },
      description: 'Bold, italics, lists, and links. Text already on the page stays as it is until this is edited.',
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
      fieldset: textBoxFieldset.name,
      description: 'How solid the text box is, from 0 to 100. 40 matches the homepage.',
      initialValue: 40,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'copyBackground',
      title: 'Text box color',
      type: 'string',
      fieldset: textBoxFieldset.name,
      description: 'Color behind the text. Leave empty to keep the current color.',
      options: {
        list: SECTION_BACKGROUND_STUDIO_OPTIONS,
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'copyAlign',
      title: 'Text box position',
      type: 'string',
      fieldset: textBoxFieldset.name,
      description: 'Where the text box sits across the banner. Left matches the homepage.',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'heightMode',
      title: 'Banner height',
      type: 'string',
      description: 'Current height matches the homepage. The other choice sizes the banner from the text box and the space above and below it.',
      options: {
        list: [
          { title: 'Current height', value: 'current' },
          { title: 'Text box plus the space above and below', value: 'content' },
        ],
        layout: 'radio',
      },
      initialValue: 'current',
    }),
    defineField({
      name: 'buttonKind',
      title: 'Button or text link',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Button', value: 'button' },
          { title: 'Ghost button', value: 'ghost' },
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
      description: 'Fill color for a button. Border and text color for a ghost button. Text color for a text link.',
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
        list: BUTTON_SIZES,
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
          { title: 'Background video', value: 'video' },
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
      hidden: ({ parent }) => hidesImage(parent),
    }),
    defineField({
      name: 'video',
      title: 'Background video',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ parent }) => !isVideoBackground(parent),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image alt text',
      type: 'string',
      description: 'Leave empty when the image is decorative.',
      hidden: ({ parent }) => hidesImage(parent),
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
      hidden: ({ parent }) => hidesImage(parent),
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
      hidden: ({ parent }) => hidesImage(parent),
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
      return pageBuilderBlockPreview('bannerBlock', firstLine, 'Hero')
    },
  },
})
