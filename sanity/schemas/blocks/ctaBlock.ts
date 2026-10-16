import { defineField, defineType } from 'sanity'
import { BoltIcon } from '@sanity/icons'
import {
  blockLayoutFields,
  blockPaddingRowFieldset,
} from './blockLayoutFields'
import {
  blockSectionHeaderFields,
  blockSectionHeaderFieldsets,
} from '../../lib/blockSectionHeaderFields'
import { sectionBackgroundField } from '../../lib/sectionBackgroundField'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'

export default defineType({
  name: 'ctaBlock',
  title: 'Call to action',
  type: 'object',
  icon: BoltIcon,
  description: 'Optional section heading and intro, plus a button link.',
  fieldsets: [...blockSectionHeaderFieldsets, blockPaddingRowFieldset],
  fields: [
    ...blockSectionHeaderFields,
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonUrl',
      title: 'Button URL',
      type: 'url',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https', 'mailto', 'tel'],
        allowRelative: true,
      }),
    }),
    sectionBackgroundField(),
    ...blockLayoutFields(),
  ],
  preview: {
    select: {
      sectionHeading: 'sectionHeading',
      buttonText: 'buttonText',
    },
    prepare({ sectionHeading, buttonText }) {
      const detail = buttonText ? `Button: ${buttonText}` : undefined
      return pageBuilderBlockPreview('ctaBlock', sectionHeading, detail)
    },
  },
})
