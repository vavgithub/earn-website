import { defineArrayMember, defineField, defineType, type ArrayOptions } from 'sanity'
import { UsersIcon } from '@sanity/icons'
import { openInNewTabField } from '../../lib/homeBlockFields'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'

const linkDescription = 'Internal path such as /contact, or a full https URL.'

/** Existing items stay. Editors can open them, not add, remove, copy, or reorder. */
const fixedList: ArrayOptions = {
  sortable: false,
  disableActions: ['add', 'addBefore', 'addAfter', 'duplicate', 'copy', 'remove'],
}

function hasText(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
}

function isProducers(parent: unknown) {
  return (parent as { part?: string } | undefined)?.part === 'production'
}

const cardFields = [
  defineField({ name: 'title', title: 'Title', type: 'string' }),
  defineField({ name: 'body', title: 'Text', type: 'text', rows: 3 }),
  defineField({
    name: 'linkLabel',
    title: 'Link label',
    type: 'string',
    description: 'The words on the card link.',
  }),
  defineField({
    name: 'linkUrl',
    title: 'Link',
    type: 'string',
    description: linkDescription,
  }),
  openInNewTabField(),
]

export default defineType({
  name: 'ecosystemBlock',
  title: 'Ecosystem',
  type: 'object',
  icon: UsersIcon,
  description: 'Update the words and the links. The layout stays as it is.',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Text above the title',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Title',
      type: 'string',
      description: 'The main title.',
    }),
    defineField({
      name: 'slides',
      title: 'Areas',
      type: 'array',
      description: 'Update the words and the links. These stay as they are.',
      options: fixedList,
      of: [
        defineArrayMember({
          name: 'ecosystemPart',
          type: 'object',
          fields: [
            defineField({
              name: 'part',
              title: 'Which area',
              type: 'string',
              hidden: true,
              options: {
                list: [
                  { title: 'Producers', value: 'production' },
                  { title: 'Midstream', value: 'midstream' },
                  { title: 'Buyers', value: 'demand' },
                ],
              },
            }),
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'image',
              hidden: true,
              options: { hotspot: true },
            }),
            defineField({
              name: 'tone',
              title: 'Photo tone',
              type: 'string',
              hidden: true,
              options: {
                list: [
                  { title: 'Softer', value: 'soft' },
                  { title: 'Darker', value: 'mid' },
                ],
              },
              initialValue: 'soft',
            }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'body', title: 'Text', type: 'text', rows: 4 }),
            defineField({
              name: 'linkLabel',
              title: 'Link label',
              type: 'string',
              description: 'The line under the text, such as See how producers use Earn.',
            }),
            defineField({
              name: 'linkUrl',
              title: 'Link',
              type: 'string',
              description: 'Where that line goes. Producers, Midstream, and Buyers each have their own link.',
            }),
            openInNewTabField(),
            defineField({
              name: 'leadTitle',
              title: 'First card title',
              type: 'string',
              hidden: ({ parent }) => !isProducers(parent),
            }),
            defineField({
              name: 'leadBody',
              title: 'First card text',
              type: 'text',
              rows: 2,
              hidden: ({ parent }) => !isProducers(parent),
            }),
            defineField({
              name: 'leadLinkLabel',
              title: 'First card link label',
              type: 'string',
              hidden: ({ parent }) => !isProducers(parent),
            }),
            defineField({
              name: 'leadLinkUrl',
              title: 'First card link',
              type: 'string',
              description: linkDescription,
              hidden: ({ parent }) => !isProducers(parent),
            }),
            defineField({
              ...openInNewTabField('leadOpenInNewTab'),
              hidden: ({ parent }) => !isProducers(parent),
            }),
            defineField({
              name: 'groups',
              title: 'Card groups',
              type: 'array',
              description: 'Update the words and the links.',
              options: fixedList,
              of: [
                defineArrayMember({
                  name: 'ecosystemCardGroup',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'heading',
                      title: 'Group name',
                      type: 'string',
                      hidden: ({ parent }) => !hasText((parent as { heading?: string } | undefined)?.heading),
                    }),
                    defineField({
                      name: 'cards',
                      title: 'Cards',
                      type: 'array',
                      options: fixedList,
                      of: [defineArrayMember({ name: 'ecosystemCard', type: 'object', fields: cardFields })],
                    }),
                  ],
                  preview: {
                    select: { title: 'heading' },
                    prepare({ title }) {
                      return { title: title || 'Cards' }
                    },
                  },
                }),
              ],
            }),
            defineField({
              name: 'trailingTitle',
              title: 'Last card title',
              type: 'string',
              hidden: ({ parent }) => !isProducers(parent),
            }),
            defineField({
              name: 'trailingBody',
              title: 'Last card text',
              type: 'text',
              rows: 2,
              hidden: ({ parent }) => !isProducers(parent),
            }),
            defineField({
              name: 'trailingLinkLabel',
              title: 'Last card link label',
              type: 'string',
              hidden: ({ parent }) => !isProducers(parent),
            }),
            defineField({
              name: 'trailingLinkUrl',
              title: 'Last card link',
              type: 'string',
              description: linkDescription,
              hidden: ({ parent }) => !isProducers(parent),
            }),
            defineField({
              ...openInNewTabField('trailingOpenInNewTab'),
              hidden: ({ parent }) => !isProducers(parent),
            }),
          ],
          preview: {
            select: { title: 'title', part: 'part' },
            prepare({ title, part }) {
              return { title: title || part || 'Area' }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return pageBuilderBlockPreview('ecosystemBlock', heading, 'Ecosystem')
    },
  },
})
