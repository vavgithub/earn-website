import { defineField, defineType } from 'sanity'
import { TextIcon } from '@sanity/icons'
import {
  blockLayoutFields,
  blockPaddingRowFieldset,
} from './blockLayoutFields'
import { isInsideGridCell, isInsideLayoutSlot } from '../../lib/layoutSlotBlocks'
import { bodyTextColorField, linkColorField, linksOpenInNewTabField, textColorField } from '../../lib/textColorField'
import { sectionBackgroundField } from '../../lib/sectionBackgroundField'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'
import { bodyRichTextFieldset, textColorPairFieldset } from '../../lib/textColorPairFieldset'
import { textSizeField } from '../../lib/textSizeField'
import {
  sectionHeadingRowFieldset,
  sectionHeadingRowFields,
} from '../../lib/sectionHeadingRowFields'

const layoutSlotHidden = ({ path }: { path?: unknown[] }) => isInsideLayoutSlot(path)
const gridCellHidden = ({ path }: { path?: unknown[] }) => isInsideGridCell(path)

const richTextFieldsets = [
  {
    ...textColorPairFieldset('eyebrowRow', 'Eyebrow'),
    hidden: gridCellHidden,
  },
  sectionHeadingRowFieldset(),
  bodyRichTextFieldset('contentRow', 'Content'),
  blockPaddingRowFieldset,
] as const

export default defineType({
  name: 'richTextSection',
  title: 'Text & headings',
  type: 'object',
  icon: TextIcon,
  description: 'Rich text with H1–H4, lists, links, and images—use for article body or standalone copy.',
  fieldsets: [...richTextFieldsets],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small line above the main text',
      fieldset: 'eyebrowRow',
      hidden: gridCellHidden,
    }),
    textColorField({
      name: 'eyebrowColor',
      initialValue: 'brightYellow',
      fieldset: 'eyebrowRow',
      hidden: gridCellHidden,
    }),
    ...sectionHeadingRowFields({ hidden: layoutSlotHidden }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      fieldset: 'contentRow',
      validation: (Rule) => Rule.required(),
    }),
    textSizeField({
      name: 'contentTextSize',
      fieldset: 'contentRow',
    }),
    bodyTextColorField({
      name: 'contentTextColor',
      fieldset: 'contentRow',
    }),
    linkColorField({
      name: 'contentLinkColor',
      fieldset: 'contentRow',
    }),
    linksOpenInNewTabField({
      name: 'contentLinksOpenInNewTab',
      fieldset: 'contentRow',
    }),
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    sectionBackgroundField({ onlyTopLevel: true }),
    ...blockLayoutFields({
      layoutWidthHidden: ({ path }) => isInsideLayoutSlot(path),
      paddingHidden: ({ path }) => isInsideLayoutSlot(path),
    }),
  ],
  preview: {
    select: {
      eyebrow: 'eyebrow',
      content: 'content',
    },
    prepare({ eyebrow, content }) {
      const eyebrowText = typeof eyebrow === 'string' ? eyebrow : ''
      const block = content?.find((b: { _type?: string }) => b._type === 'block')
      const text = block?.children?.map((c: { text?: string }) => c.text).join('') ?? ''
      const excerpt = text.length > 72 ? `${text.slice(0, 72)}…` : text
      const detail = eyebrowText && excerpt ? excerpt : undefined
      return pageBuilderBlockPreview('richTextSection', eyebrowText || excerpt, detail)
    },
  },
})
