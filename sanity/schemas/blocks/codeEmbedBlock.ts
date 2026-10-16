import { defineField, defineType } from 'sanity'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'
import { CodeBlockIcon } from '@sanity/icons'
import {
  blockLayoutFields,
  blockPaddingRowFieldset,
} from './blockLayoutFields'
import {
  blockSectionHeaderFields,
  blockSectionHeaderFieldsets,
} from '../../lib/blockSectionHeaderFields'
import { sectionBackgroundField } from '../../lib/sectionBackgroundField'

export default defineType({
  name: 'codeEmbedBlock',
  title: 'HTML / embed (scripts run)',
  type: 'object',
  icon: CodeBlockIcon,
  description:
    'Raw HTML, including inline or external scripts (HubSpot, analytics snippets, etc.). Scripts execute on the live site. Only for trusted editors.',
  fieldsets: [...blockSectionHeaderFieldsets, blockPaddingRowFieldset],
  fields: [
    ...blockSectionHeaderFields,
    defineField({
      name: 'markup',
      title: 'HTML / embed code',
      type: 'text',
      rows: 16,
      validation: (Rule) => Rule.required(),
    }),
    sectionBackgroundField(),
    ...blockLayoutFields(),
  ],
  preview: {
    select: { markup: 'markup' },
    prepare({ markup }) {
      const s = typeof markup === 'string' ? markup.trim() : ''
      const detail = s ? `${s.slice(0, 72)}${s.length > 72 ? '…' : ''}` : 'Empty'
      return pageBuilderBlockPreview('codeEmbedBlock', 'HTML embed', detail)
    },
  },
})
