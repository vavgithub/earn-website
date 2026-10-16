import { defineField, defineType } from 'sanity'
import { ThListIcon } from '@sanity/icons'
import {
  blockLayoutFields,
  blockPaddingRowFieldset,
} from './blockLayoutFields'
import {
  gridAccordionHeaderFields,
  gridAccordionHeaderFieldsets,
} from '../../lib/gridAccordionHeaderFields'
import { sectionBackgroundField } from '../../lib/sectionBackgroundField'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'

export default defineType({
  name: 'gridBlock',
  title: 'Grid',
  type: 'object',
  icon: ThListIcon,
  description:
    'Responsive grid of cells. Each cell can contain Image, Text & headings, and Button blocks. Optional heading and intro above the grid.',
  fieldsets: [...gridAccordionHeaderFieldsets, blockPaddingRowFieldset],
  fields: [
    ...gridAccordionHeaderFields('blackGreen'),
    defineField({
      name: 'items',
      title: 'Grid cells',
      type: 'array',
      of: [{ type: 'gridCell' }],
      options: { layout: 'grid' },
      validation: (Rule) => Rule.min(1).error('Add at least one grid cell.'),
    }),
    sectionBackgroundField(),
    ...blockLayoutFields(),
  ],
  preview: {
    select: { heading: 'heading', items: 'items' },
    prepare({ heading, items }) {
      const n = items?.length ?? 0
      return pageBuilderBlockPreview('gridBlock', heading, `${n} item${n === 1 ? '' : 's'}`)
    },
  },
})
