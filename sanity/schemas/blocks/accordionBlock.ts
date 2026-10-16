import { defineField, defineType } from 'sanity'
import { CollapseIcon } from '@sanity/icons'
import {
  blockLayoutFields,
  blockPaddingRowFieldset,
} from './blockLayoutFields'
import {
  gridAccordionHeaderFields,
  gridAccordionHeaderFieldsets,
} from '../../lib/gridAccordionHeaderFields'
import { sectionBackgroundField } from '../../lib/sectionBackgroundField'
import { textColorField } from '../../lib/textColorField'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'

export default defineType({
  name: 'accordionBlock',
  title: 'Accordion',
  type: 'object',
  icon: CollapseIcon,
  description: 'FAQ-style accordion. Optional section heading, intro, and section background.',
  fieldsets: [...gridAccordionHeaderFieldsets, blockPaddingRowFieldset],
  fields: [
    ...gridAccordionHeaderFields('offWhite'),
    sectionBackgroundField({ initialValue: 'darkBeige' }),
    textColorField({
      name: 'questionColor',
      title: 'Question color',
      initialValue: 'lightGreen',
      description: 'Accordion question titles and chevrons.',
    }),
    ...blockLayoutFields({
      withAlignment: true,
      layoutWidthOverrides: {
        initialValue: 'content',
        description:
          'Content width (1080px) matches other page-builder blocks. Section background still spans full width.',
      },
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      validation: (Rule) => Rule.min(1).error('Add at least one item.'),
      of: [
        {
          type: 'object',
          name: 'accordionItem',
          title: 'Item',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 5,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'question', subtitle: 'answer' },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Item',
                subtitle: subtitle ? String(subtitle).slice(0, 80) : '',
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading', items: 'items' },
    prepare({ heading, items }) {
      const n = items?.length ?? 0
      return pageBuilderBlockPreview('accordionBlock', heading, `${n} item${n === 1 ? '' : 's'}`)
    },
  },
})
