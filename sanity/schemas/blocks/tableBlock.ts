import { defineField, defineType } from 'sanity'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'
import { OlistIcon } from '@sanity/icons'
import {
  blockLayoutFields,
  blockPaddingRowFieldset,
} from './blockLayoutFields'
import {
  blockSectionHeaderFields,
  blockSectionHeaderFieldsets,
} from '../../lib/blockSectionHeaderFields'
import { textColorField } from '../../lib/textColorField'
import { typographyPairFieldset } from '../../lib/textColorPairFieldset'
import { textSizeField } from '../../lib/textSizeField'
import { sectionBackgroundField } from '../../lib/sectionBackgroundField'

export default defineType({
  name: 'tableBlock',
  title: 'Table',
  type: 'object',
  icon: OlistIcon,
  description:
    'Add any number of columns (headings), then each row has one cell per column, in the same order.',
  fieldsets: [
    ...blockSectionHeaderFieldsets,
    typographyPairFieldset('columnHeadingTypographyRow', 'Column heading typography'),
    typographyPairFieldset('cellTypographyRow', 'Cell typography'),
    blockPaddingRowFieldset,
  ],
  fields: [
    ...blockSectionHeaderFields,
    defineField({
      name: 'columns',
      title: 'Column headings',
      type: 'array',
      description: 'Order matters: first heading = first cell in each row, and so on.',
      of: [{ type: 'string' }],
      validation: (Rule) =>
        Rule.required()
          .min(2)
          .max(12)
          .error('Add between 2 and 12 columns.'),
    }),
    textSizeField({
      name: 'columnHeadingTextSize',
      title: 'Text size',
      description: 'Applies to all column headings.',
      fieldset: 'columnHeadingTypographyRow',
    }),
    textColorField({
      name: 'columnHeadingColor',
      title: 'Text color',
      description: 'Applies to all column headings.',
      initialValue: 'darkSlate',
      fieldset: 'columnHeadingTypographyRow',
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      validation: (Rule) =>
        Rule.min(1)
          .error('Add at least one row.')
          .custom((rows, context) => {
            const parent = context.parent as { columns?: string[] } | undefined
            const colCount = parent?.columns?.length ?? 0
            if (!colCount || !Array.isArray(rows)) return true
            let idx = 0
            for (const row of rows) {
              const cells = (row as { cells?: unknown })?.cells
              const len = Array.isArray(cells) ? cells.length : 0
              if (len !== colCount) {
                return `Row ${idx + 1}: must have exactly ${colCount} cells (one per column).`
              }
              idx += 1
            }
            return true
          }),
      of: [
        {
          type: 'object',
          name: 'tableRow',
          title: 'Row',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              description: 'One string per column, same order as “Column headings”.',
              of: [{ type: 'string' }],
            }),
          ],
          preview: {
            select: { cells: 'cells' },
            prepare({ cells }) {
              const list = Array.isArray(cells) ? cells : []
              const joined = list.map((c: unknown) => String(c ?? '')).join(' · ')
              return {
                title: joined ? joined.slice(0, 72) + (joined.length > 72 ? '…' : '') : 'Row',
                subtitle: `${list.length} cell${list.length === 1 ? '' : 's'}`,
              }
            },
          },
        },
      ],
    }),
    textSizeField({
      name: 'cellTextSize',
      title: 'Text size',
      description: 'Applies to all table cells.',
      fieldset: 'cellTypographyRow',
    }),
    textColorField({
      name: 'cellTextColor',
      title: 'Text color',
      description: 'Applies to all table cells.',
      initialValue: 'darkSlate',
      fieldset: 'cellTypographyRow',
    }),
    sectionBackgroundField(),
    ...blockLayoutFields(),
  ],
  preview: {
    select: { rows: 'rows', columns: 'columns' },
    prepare({ rows, columns }) {
      const n = rows?.length ?? 0
      const c = Array.isArray(columns) ? columns.length : 0
      const head = Array.isArray(columns)
        ? columns
            .map((x: unknown) => String(x ?? '').trim())
            .filter(Boolean)
            .slice(0, 3)
            .join(' · ')
        : ''
      const detail = `${c} column${c === 1 ? '' : 's'} · ${n} row${n === 1 ? '' : 's'}${head ? ` — ${head}` : ''}`
      return pageBuilderBlockPreview('tableBlock', 'Table', detail)
    },
  },
})
