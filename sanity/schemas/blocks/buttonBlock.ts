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
  { title: 'Extra small (12px)', value: 'xs' },
  { title: 'Small (16px)', value: 'sm' },
  { title: 'Medium (18px)', value: 'md' },
  { title: 'Large (20px)', value: 'lg' },
  { title: 'Extra large (24px)', value: 'xl' },
] as const

const SHAPES = [
  { title: 'Pill', value: 'pill' },
  { title: 'Rounded', value: 'rounded' },
] as const

type ButtonParent = { buttonType?: string; showTopLine?: boolean; lineWidth?: string }

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

const linkFieldset = {
  name: 'buttonLink',
  title: 'Link',
  options: { columns: 2 as const },
} as const

const lineFieldset = {
  name: 'buttonLine',
  title: 'Line',
  options: { columns: 3 as const },
} as const

export default defineType({
  name: 'buttonBlock',
  title: 'Button',
  type: 'object',
  icon: BoltIcon,
  description:
    'Call-to-action only (label, URL, button type, colors, optional top line). Use Heading & Text for copy above.',
  fieldsets: [linkFieldset, lineFieldset, blockPaddingRowFieldset],
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      fieldset: linkFieldset.name,
      to: [{ type: 'page' }],
      weak: true,
      description: 'Pick a page on this site. Leave empty to use the URL.',
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      fieldset: linkFieldset.name,
      description: 'Used when no page is picked. Internal path (e.g. /contact) or a full URL (https://…).',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { page?: { _ref?: string } } | undefined
          if (parent?.page?._ref) return true
          if (typeof value === 'string' && value.trim()) return true
          return 'Add a page or a URL'
        }),
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
      name: 'lineThickness',
      title: 'Line thickness',
      type: 'number',
      fieldset: lineFieldset.name,
      description: 'Thickness of the line, in pixels. Leave empty to keep the current line.',
      hidden: ({ parent }) => !showLineColor({ parent }),
      validation: (Rule) => Rule.min(0).max(24),
    }),
    defineField({
      name: 'lineWidth',
      title: 'Top line width',
      type: 'string',
      fieldset: lineFieldset.name,
      description: 'Leave empty to keep the line as wide as the button.',
      options: {
        list: [
          { title: 'Button width', value: 'button' },
          { title: 'Percent of the row', value: 'percent' },
        ],
        layout: 'radio',
      },
      hidden: ({ parent }) => !showLineColor({ parent }),
    }),
    defineField({
      name: 'lineWidthPercent',
      title: 'Percent of the row',
      type: 'number',
      fieldset: lineFieldset.name,
      description: 'Type 1 to 100. 100 is the full row. 50 is half the row.',
      hidden: ({ parent }) => !showLineColor({ parent }) || parent?.lineWidth !== 'percent',
      validation: (Rule) => Rule.min(1).max(100),
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
