import { defineArrayMember, defineField, defineType, type ArrayOptions } from 'sanity'
import { StackCompactIcon } from '@sanity/icons'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'

/** The four steps stay. Editors can open them, not add, remove, copy, or reorder. */
const fixedList: ArrayOptions = {
  sortable: false,
  disableActions: ['add', 'addBefore', 'addAfter', 'duplicate', 'copy', 'remove'],
}

export default defineType({
  name: 'architectureBlock',
  title: 'Architecture',
  type: 'object',
  icon: StackCompactIcon,
  description: 'Update the words. The layout stays as it is.',
  fields: [
    defineField({ name: 'eyebrow', title: 'Text above the title', type: 'string' }),
    defineField({ name: 'heading', title: 'Title', type: 'string' }),
    defineField({ name: 'lead', title: 'Text under the title', type: 'text', rows: 4 }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      description: 'Update the words. These four stay as they are.',
      options: fixedList,
      of: [
        defineArrayMember({
          name: 'architectureStep',
          type: 'object',
          fields: [
            defineField({
              name: 'stepId',
              title: 'Which step',
              type: 'string',
              hidden: true,
              options: {
                list: [
                  { title: 'Verified record', value: 'record' },
                  { title: 'Natural gas network', value: 'network' },
                  { title: 'Trust and governance', value: 'trust' },
                  { title: 'Machine interface', value: 'machine' },
                ],
              },
            }),
            defineField({ name: 'index', title: 'Number', type: 'string' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'kicker', title: 'Line under the title', type: 'text', rows: 2 }),
            defineField({ name: 'body', title: 'Text', type: 'text', rows: 5, description: 'Separate paragraphs with a blank line.' }),
          ],
          preview: {
            select: { title: 'title', stepId: 'stepId' },
            prepare({ title, stepId }) {
              return { title: title || stepId || 'Step' }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return pageBuilderBlockPreview('architectureBlock', heading, 'Architecture')
    },
  },
})
