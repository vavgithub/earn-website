import { defineField, defineType } from 'sanity'
import { BoltIcon } from '@sanity/icons'
import {
  blockLayoutFields,
  blockPaddingRowFieldset,
} from './blockLayoutFields'
import { isInsideLayoutSlot } from '../../lib/layoutSlotBlocks'
import { sectionBackgroundField } from '../../lib/sectionBackgroundField'
import { textColorField } from '../../lib/textColorField'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'

const BUTTON_TYPES = [
  { title: 'Fill button', value: 'fill' },
  { title: 'Ghost button', value: 'ghost' },
  { title: 'Text link', value: 'textLink' },
] as const

const SIZES = [
  { title: 'Extra small', value: 'xs' },
  { title: 'Small', value: 'sm' },
  { title: 'Medium', value: 'md' },
  { title: 'Large', value: 'lg' },
  { title: 'Extra large', value: 'xl' },
] as const

const SHAPES = [
  { title: 'Pill', value: 'pill' },
  { title: 'Rounded', value: 'rounded' },
] as const

type ButtonParent = { buttonType?: string; showTopLine?: boolean }

function isFill({ parent }: { parent?: ButtonParent }) {
  return parent?.buttonType === 'fill'
}

function isGhost({ parent }: { parent?: ButtonParent }) {
  return parent?.buttonType === 'ghost'
}

function isTextLink({ parent }: { parent?: ButtonParent }) {
  return parent?.buttonType === 'textLink'
}

function showLineColor({ parent }: { parent?: ButtonParent }) {
  return Boolean(parent?.showTopLine)
}

function isButtonNestedUnderButtons(path: unknown): boolean {
  return Array.isArray(path) && path.some((seg) => seg === 'buttons')
}

function hideButtonLayoutWidth(path: unknown): boolean {
  return isButtonNestedUnderButtons(path) || isInsideLayoutSlot(path)
}

function hideTopLevelButtonOptions(path: unknown): boolean {
  return hideButtonLayoutWidth(path)
}

export default defineType({
  name: 'buttonBlock',
  title: 'Button',
  type: 'object',
  icon: BoltIcon,
  description:
    'Call-to-action only (label, URL, button type, colors, optional top line). Use Text & headings for copy above.',
  fieldsets: [blockPaddingRowFieldset],
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      description:
        'Internal path (e.g. /contact, /resources) or full URL (https://…).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      description: 'For external https links. Ignored for internal paths.',
      initialValue: false,
    }),
    defineField({
      name: 'buttonType',
      title: 'Button type',
      type: 'string',
      options: { list: [...BUTTON_TYPES], layout: 'radio' },
      initialValue: 'fill',
      validation: (Rule) => Rule.required(),
    }),
    textColorField({
      name: 'textColor',
      title: 'Text color',
      description: 'Label or link text color.',
      initialValue: 'offWhite',
    }),
    textColorField({
      name: 'fillColor',
      title: 'Fill color',
      description: 'Background color for fill buttons.',
      initialValue: 'medSlate',
      hidden: ({ parent }) => !isFill({ parent }),
    }),
    textColorField({
      name: 'outlineColor',
      title: 'Outline color',
      description: 'Border color for ghost buttons.',
      initialValue: 'medSlate',
      hidden: ({ parent }) => !isGhost({ parent }),
    }),
    defineField({
      name: 'showTopLine',
      title: 'Top line',
      type: 'boolean',
      description: 'Show a line above the button or text link.',
      initialValue: false,
    }),
    textColorField({
      name: 'lineColor',
      title: 'Line color',
      description: 'Color of the line above the control.',
      initialValue: 'yellow',
      hidden: ({ parent }) => !showLineColor({ parent }),
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: { list: [...SIZES], layout: 'radio' },
      initialValue: 'md',
      validation: (Rule) => Rule.required(),
      hidden: ({ parent }) => isTextLink({ parent }),
    }),
    defineField({
      name: 'shape',
      title: 'Shape',
      type: 'string',
      options: { list: [...SHAPES], layout: 'radio' },
      initialValue: 'pill',
      validation: (Rule) => Rule.required(),
      hidden: ({ parent }) => isTextLink({ parent }),
    }),
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      description:
        'Top-level button block only; nested buttons follow the parent layout.',
      hidden: ({ path }) => isButtonNestedUnderButtons(path),
    }),
    sectionBackgroundField({ onlyTopLevel: true }),
    ...blockLayoutFields({
      layoutWidthHidden: ({ path }) => hideButtonLayoutWidth(path),
      paddingHidden: ({ path }) => hideTopLevelButtonOptions(path),
    }),
  ],
  preview: {
    select: {
      label: 'label',
      href: 'href',
      buttonType: 'buttonType',
      showTopLine: 'showTopLine',
    },
    prepare({ label, href, buttonType, showTopLine }) {
      const typeLabel =
        buttonType === 'ghost'
          ? 'Ghost'
          : buttonType === 'textLink'
            ? 'Text link'
            : 'Fill'
      const line = showTopLine ? ' · line' : ''
      const detail = [href, `${typeLabel}${line}`].filter(Boolean).join(' · ')
      return pageBuilderBlockPreview('buttonBlock', label, detail || undefined)
    },
  },
})
