import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons'
import {
  blockLayoutFields,
  blockPaddingRowFieldset,
} from './blockLayoutFields'
import { layoutSlotBlockTypeRefs } from '../../lib/layoutSlotBlocks'
import {
  blockSectionHeaderFields,
  blockSectionHeaderFieldsets,
} from '../../lib/blockSectionHeaderFields'
import { sectionBackgroundField } from '../../lib/sectionBackgroundField'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'

export default defineType({
  name: 'heroBlog',
  title: 'Hero',
  type: 'object',
  icon: ImageIcon,
  description: 'Two columns. Add Image, Text & headings, or Button blocks to each side.',
  fieldsets: [...blockSectionHeaderFieldsets, blockPaddingRowFieldset],
  fields: [
    ...blockSectionHeaderFields,
    defineField({
      name: 'column1',
      title: 'Column 1 (left)',
      type: 'array',
      of: layoutSlotBlockTypeRefs,
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'column2',
      title: 'Column 2 (right)',
      type: 'array',
      of: layoutSlotBlockTypeRefs,
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'columnVerticalAlign',
      title: 'Vertical alignment',
      type: 'string',
      description: 'Aligns both columns vertically when side by side on desktop; stacked mobile stays top-aligned.',
      options: {
        list: [
          { title: 'Top', value: 'top' },
          { title: 'Center', value: 'center' },
          { title: 'Bottom', value: 'bottom' },
        ],
        layout: 'radio',
      },
      initialValue: 'top',
    }),
    sectionBackgroundField(),
    ...blockLayoutFields(),
  ],
  preview: {
    select: {
      c1: 'column1',
      c2: 'column2',
    },
    prepare({ c1, c2 }) {
      const n1 = c1?.length ?? 0
      const n2 = c2?.length ?? 0
      return pageBuilderBlockPreview(
        'heroBlog',
        'Hero',
        `${n1 + n2} block${n1 + n2 === 1 ? '' : 's'} · 2 columns`,
      )
    },
  },
})
