import {defineField, defineType} from 'sanity'
import {ComposeIcon} from '@sanity/icons'
import {SiteRouteHrefInput} from '../components/SiteRouteHrefInput'

const footerLink = defineType({
  name: 'footerLink',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      components: {input: SiteRouteHrefInput},
      description: 'Open Browse routes or type any internal path or full URL.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', href: 'href'},
    prepare({title, href}) {
      return {title, subtitle: href || '—'}
    },
  },
})

export default defineType({
  name: 'siteFooter',
  title: 'Site Footer',
  type: 'document',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Site Footer',
      description: 'Studio label only.',
    }),
    defineField({
      name: 'copyrightYear',
      title: 'Copyright year',
      type: 'number',
      description: 'Shown in: © {year} EarnDLT®. All Rights Reserved. Leave empty to use the site default (2026).',
      validation: (Rule) => Rule.integer().min(1900).max(2100),
    }),
    defineField({
      name: 'column1',
      title: 'Column 1 (left)',
      type: 'array',
      of: [{type: 'footerLink'}],
    }),
    defineField({
      name: 'column2',
      title: 'Column 2 (middle)',
      type: 'array',
      of: [{type: 'footerLink'}],
    }),
    defineField({
      name: 'column3',
      title: 'Column 3 (right)',
      type: 'array',
      of: [{type: 'footerLink'}],
    }),
  ],
  preview: {
    select: {title: 'title', year: 'copyrightYear'},
    prepare({title, year}) {
      return {title: title || 'Site Footer', subtitle: year ? `© ${year}` : undefined}
    },
  },
})

export const footerSchemaTypes = [footerLink]
