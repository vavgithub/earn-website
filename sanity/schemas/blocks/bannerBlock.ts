import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons'
import { BLOCK_PADDING_OPTIONS } from '../../lib/blockPaddingFields'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'
import { sectionBackgroundField } from '../../lib/sectionBackgroundField'
import { textColorField } from '../../lib/textColorField'

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
  fieldsets: [textBoxSpacingFieldset, bannerSpacingFieldset],
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      rows: 3,
      description: 'One line per row. On desktop each row is its own line.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 6,
      description: 'Separate paragraphs with a blank line.',
    }),
    textColorField({
      name: 'fontColor',
      title: 'Font color',
      description: 'Heading and body color.',
      initialValue: 'offWhite',
    }),
    defineField({
      name: 'fontSize',
      title: 'Font size',
      type: 'string',
      description: 'Size of the heading. Default matches the homepage.',
      options: {
        list: [
          { title: 'Same as the homepage', value: 'default' },
          { title: 'Lg (24px)', value: 'lg' },
          { title: 'Med (20px)', value: 'md' },
          { title: 'Small (16px)', value: 'sm' },
          { title: 'XS (12px)', value: 'xs' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'default',
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
      hidden: ({ parent }) => {
        const kind = (parent as { buttonKind?: string } | undefined)?.buttonKind
        return kind === 'none' || !kind
      },
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in a new tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => {
        const kind = (parent as { buttonKind?: string } | undefined)?.buttonKind
        return kind === 'none' || !kind
      },
    }),
    defineField({
      name: 'buttonUrl',
      title: 'Button URL',
      type: 'string',
      description: 'Internal path such as /contact, or a full https URL.',
      hidden: ({ parent }) => {
        const kind = (parent as { buttonKind?: string } | undefined)?.buttonKind
        return kind === 'none' || !kind
      },
    }),
    textColorField({
      name: 'buttonColor',
      title: 'Button color',
      description: 'Fill color for a button. Text color for a text link.',
      initialValue: 'brightYellow',
      hidden: ({ parent }) => {
        const kind = (parent as { buttonKind?: string } | undefined)?.buttonKind
        return kind === 'none' || !kind
      },
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
