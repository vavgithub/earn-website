import { defineField, defineType } from 'sanity'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'
import { ImageIcon } from '@sanity/icons'
import {
  blockLayoutFields,
  blockPaddingRowFieldset,
} from './blockLayoutFields'
import { isInsideLayoutSlot } from '../../lib/layoutSlotBlocks'
import { sectionBackgroundField } from '../../lib/sectionBackgroundField'

const ASPECT_RATIOS = [
  { title: '16:9', value: '16:9' },
  { title: '2:1', value: '2:1' },
  { title: '3:1', value: '3:1' },
  { title: '1:1 (square)', value: '1:1' },
] as const

const OBJECT_POSITIONS = [
  { title: 'Top left', value: 'left-top' },
  { title: 'Top', value: 'top' },
  { title: 'Top right', value: 'right-top' },
  { title: 'Left', value: 'left' },
  { title: 'Center', value: 'center' },
  { title: 'Right', value: 'right' },
  { title: 'Bottom left', value: 'left-bottom' },
  { title: 'Bottom', value: 'bottom' },
  { title: 'Bottom right', value: 'right-bottom' },
] as const

export default defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  description: 'Standalone image with alt text, aspect ratio, optional link, and layout controls.',
  fieldsets: [blockPaddingRowFieldset],
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe the image for screen readers and SEO.',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'href',
      title: 'Link URL (optional)',
      type: 'string',
      description:
        'When set, the image becomes a clickable link. Internal path (e.g. /contact) or full URL (https://…).',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open link in new tab',
      type: 'boolean',
      description: 'For external https links. Ignored for internal paths unless enabled.',
      initialValue: false,
      hidden: ({ parent }) => !parent?.href?.trim(),
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect ratio',
      type: 'string',
      options: {
        list: [...ASPECT_RATIOS],
        layout: 'radio',
      },
      initialValue: '16:9',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'minHeight',
      title: 'Min height (px)',
      type: 'number',
      description: 'Optional minimum height of the image frame in pixels.',
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: 'maxHeight',
      title: 'Max height (px)',
      type: 'number',
      description: 'Optional maximum height of the image frame in pixels.',
      validation: (Rule) =>
        Rule.min(0)
          .integer()
          .custom((maxHeight, context) => {
            const parent = context.parent as { minHeight?: number } | undefined
            const min = parent?.minHeight
            if (
              typeof min === 'number' &&
              typeof maxHeight === 'number' &&
              maxHeight > 0 &&
              min > 0 &&
              maxHeight < min
            ) {
              return 'Max height must be greater than or equal to min height.'
            }
            return true
          }),
    }),
    defineField({
      name: 'objectFit',
      title: 'Object fit',
      type: 'string',
      options: {
        list: [
          { title: 'Cover (fill frame, may crop)', value: 'cover' },
          { title: 'Contain (fit inside frame)', value: 'contain' },
          { title: 'Natural (intrinsic size, scales down with column)', value: 'natural' },
        ],
        layout: 'radio',
      },
      initialValue: 'cover',
    }),
    defineField({
      name: 'objectPosition',
      title: 'Object position',
      type: 'string',
      description:
        'Which part of the image stays in view when cropped. Applies to Cover and Contain.',
      options: {
        list: [...OBJECT_POSITIONS],
      },
      initialValue: 'center',
      hidden: ({ parent }) => parent?.objectFit === 'natural',
    }),
    sectionBackgroundField({ onlyTopLevel: true }),
    ...blockLayoutFields({
      layoutWidthHidden: ({ path }) => isInsideLayoutSlot(path),
      paddingHidden: ({ path }) => isInsideLayoutSlot(path),
    }),
  ],
  preview: {
    select: {
      alt: 'alt',
      layoutWidth: 'layoutWidth',
      aspectRatio: 'aspectRatio',
      href: 'href',
      media: 'image',
    },
    prepare({ alt, layoutWidth, aspectRatio, href, media }) {
      const widthLabel =
        layoutWidth === 'fullBleed'
          ? 'Full width'
          : layoutWidth === 'reading'
            ? 'Reading width'
            : 'Content width'
      const ratioLabel = aspectRatio ? String(aspectRatio) : '16:9'
      const linkLabel = href?.trim() ? ' · Linked' : ''
      const preview = pageBuilderBlockPreview(
        'imageBlock',
        alt,
        `${widthLabel} · ${ratioLabel}${linkLabel}`,
      )
      return { ...preview, media }
    },
  },
})
