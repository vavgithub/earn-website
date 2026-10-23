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
      type: 'text',
      rows: 2,
      description: 'Press Enter to break the line on the site, e.g. "Sustainability" / "and Reporting".',
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

const footerLinkGroup = defineType({
  name: 'footerLinkGroup',
  title: 'Link group',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Sub-heading (optional)',
      type: 'string',
      description: 'Underlined label above the links, e.g. "EarnDLT". Leave empty for a plain list.',
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{type: 'footerLink'}],
    }),
  ],
  preview: {
    select: {title: 'heading', links: 'links'},
    prepare({title, links}) {
      const count = Array.isArray(links) ? links.length : 0
      return {title: title || 'Links', subtitle: `${count} link${count === 1 ? '' : 's'}`}
    },
  },
})

const footerColumn = defineType({
  name: 'footerColumn',
  title: 'Column',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'groups',
      title: 'Link groups',
      type: 'array',
      of: [{type: 'footerLinkGroup'}],
      description: 'Most columns need one group with no sub-heading.',
    }),
  ],
  preview: {
    select: {title: 'heading', groups: 'groups'},
    prepare({title, groups}) {
      const count = Array.isArray(groups) ? groups.length : 0
      return {title, subtitle: `${count} group${count === 1 ? '' : 's'}`}
    },
  },
})

const footerSocialLink = defineType({
  name: 'footerSocialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          {title: 'LinkedIn', value: 'linkedin'},
          {title: 'X', value: 'x'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'platform', subtitle: 'url'},
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
      name: 'columns',
      title: 'Link columns',
      type: 'array',
      of: [{type: 'footerColumn'}],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [{type: 'footerSocialLink'}],
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      description: 'Shown under the social icons, e.g. (+1) 877-905-EARN (3276).',
    }),
    defineField({
      name: 'copyrightHolder',
      title: 'Copyright holder',
      type: 'string',
      description: 'Shown in: © {year} {holder}. All Rights Reserved. Leave empty for "EarnDLT®".',
    }),
    defineField({
      name: 'copyrightYear',
      title: 'Copyright year',
      type: 'number',
      description: 'Leave empty to always show the current year.',
      validation: (Rule) => Rule.integer().min(1900).max(2100),
    }),
  ],
  preview: {
    select: {title: 'title', year: 'copyrightYear'},
    prepare({title, year}) {
      return {title: title || 'Site Footer', subtitle: year ? `© ${year}` : undefined}
    },
  },
})

export const footerSchemaTypes = [footerLink, footerLinkGroup, footerColumn, footerSocialLink]
