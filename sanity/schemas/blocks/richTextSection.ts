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
import { bodyRichTextFieldset } from '../../lib/textColorPairFieldset'
import { TEXT_SIZE_OPTIONS, textSizeField } from '../../lib/textSizeField'
import { sectionHeadingRowFields } from '../../lib/sectionHeadingRowFields'

const layoutSlotHidden = ({ path }: { path?: unknown[] }) => isInsideLayoutSlot(path)
const gridCellHidden = ({ path }: { path?: unknown[] }) => isInsideGridCell(path)

const richTextEyebrowFieldset = {
  name: 'richTextEyebrowRow',
  title: 'Eyebrow',
  options: { columns: 3 as const },
  hidden: gridCellHidden,
}

const richTextHeadingFieldset = {
  name: 'richTextHeadingRow',
  title: 'Section heading',
  options: { columns: 3 as const },
}

const richTextFieldsets = [
  richTextEyebrowFieldset,
  richTextHeadingFieldset,
  bodyRichTextFieldset('contentRow', 'Text'),
  blockPaddingRowFieldset,
] as const

export default defineType({
  name: 'richTextSection',
  title: 'Heading & Text',
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
      fieldset: richTextEyebrowFieldset.name,
      hidden: gridCellHidden,
    }),
    defineField({
      name: 'eyebrowTextSize',
      title: 'Text size',
      type: 'string',
      fieldset: richTextEyebrowFieldset.name,
      description: 'Leave empty to keep the current size.',
      options: { list: [...TEXT_SIZE_OPTIONS], layout: 'dropdown' },
      hidden: gridCellHidden,
    }),
    textColorField({
      name: 'eyebrowColor',
      initialValue: 'brightYellow',
      fieldset: richTextEyebrowFieldset.name,
      hidden: gridCellHidden,
    }),
    ...sectionHeadingRowFields({
      hidden: layoutSlotHidden,
      fieldset: richTextHeadingFieldset.name,
      headingDescription: 'Each new line shows as its own line on the page.',
    }),
    defineField({
      name: 'sectionHeadingSize',
      title: 'Text size',
      type: 'string',
      fieldset: richTextHeadingFieldset.name,
      description: 'Leave empty to keep the current heading size.',
      options: { list: [...TEXT_SIZE_OPTIONS], layout: 'dropdown' },
      hidden: layoutSlotHidden,
    }),
    defineField({
      name: 'content',
      title: 'Text',
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
