import { defineField, defineType } from 'sanity'
import { ComponentIcon } from '@sanity/icons'
import { layoutSlotBlockTypeRefs } from '../../lib/layoutSlotBlocks'

export default defineType({
  name: 'gridCell',
  title: 'Grid cell',
  type: 'object',
  icon: ComponentIcon,
  description: 'One column in the grid. Add Image, Text & headings, and/or Button blocks inside.',
  fields: [
    defineField({
      name: 'background',
      title: 'Cell background',
      type: 'string',
      options: {
        list: [
          { title: 'Transparent', value: 'transparent' },
          { title: 'Dark panel (Dark Slate)', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'transparent',
      description:
        'Dark panel uses light text. Transparent uses the page styling. Existing cells without this field keep the dark panel until you choose Transparent.',
    }),
    defineField({
      name: 'blocks',
      title: 'Content',
      type: 'array',
      of: layoutSlotBlockTypeRefs,
      options: { layout: 'grid' },
    }),
  ],
  preview: {
    select: { blocks: 'blocks', background: 'background' },
    prepare({ blocks, background }) {
      const n = blocks?.length ?? 0
      const bgLabel = background === 'transparent' ? 'Transparent' : 'Dark panel'
      return {
        title: 'Grid cell',
        subtitle: n === 0 ? bgLabel : `${bgLabel} · ${n} block${n === 1 ? '' : 's'}`,
      }
    },
  },
})
