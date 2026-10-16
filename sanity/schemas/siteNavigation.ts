import {defineField, defineType} from 'sanity'
import {MenuIcon} from '@sanity/icons'
import {SiteRouteHrefInput} from '../components/SiteRouteHrefInput'

const navSubRow = defineType({
  name: 'navSubRow',
  title: 'Sub-item',
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
      title: 'URL (optional)',
      type: 'string',
      components: {input: SiteRouteHrefInput},
      description:
        'Optional. Leave empty for a non-clickable label. Open Browse routes or type any internal path or full URL.',
    }),
  ],
  preview: {
    select: {title: 'label', href: 'href'},
    prepare({title, href}) {
      return {title, subtitle: href ? 'Link' : 'Heading'}
    },
  },
})

const navRow = defineType({
  name: 'navRow',
  title: 'Item',
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
      title: 'URL (optional)',
      type: 'string',
      components: {input: SiteRouteHrefInput},
      description:
        'Optional. Leave empty for a non-clickable heading. Open Browse routes or type any internal path or full URL.',
    }),
    defineField({
      name: 'subitems',
      title: 'Sub-items (optional)',
      type: 'array',
      of: [{type: 'navSubRow'}],
      description: 'One level only. Sub-items render indented by 48px.',
    }),
    defineField({
      name: 'introHeading',
      title: 'Intro heading',
      type: 'string',
      description: 'Shown on the right when this row is hovered (single column + intro dropdowns).',
    }),
    defineField({
      name: 'introBody',
      title: 'Intro body',
      type: 'text',
      rows: 3,
      description: 'Body text on the right when this row is hovered.',
    }),
  ],
  preview: {
    select: {title: 'label', href: 'href', subitems: 'subitems'},
    prepare({title, href, subitems}) {
      const count = Array.isArray(subitems) ? subitems.length : 0
      return {title, subtitle: `${href ? 'Link' : 'Heading'}${count ? ` • ${count} sub-items` : ''}`}
    },
  },
})

const navColumn = defineType({
  name: 'navColumn',
  title: 'Column',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'navRow'}],
      validation: (Rule) => Rule.min(1).error('Add at least one item.'),
    }),
  ],
  preview: {
    select: {items: 'items'},
    prepare({items}) {
      const count = Array.isArray(items) ? items.length : 0
      return {title: `Column (${count} item${count === 1 ? '' : 's'})`}
    },
  },
})

const navItem = defineType({
  name: 'navItem',
  title: 'Top-level item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
      hidden: () => true,
      description:
        'Legacy stable id. New items: left blank — the site derives a key from the label automatically.',
    }),
    defineField({
      name: 'href',
      title: 'Top-level URL (optional)',
      type: 'string',
      components: {input: SiteRouteHrefInput},
      description: 'If set, the top-level item links here. Open Browse routes or type any path or full URL.',
    }),
    defineField({
      name: 'dropdownKind',
      title: 'Dropdown type',
      type: 'string',
      initialValue: 'none',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Multi-column', value: 'multiColumn'},
          {title: 'Single column + intro text', value: 'singleWithIntro'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [{type: 'navColumn'}],
      hidden: ({parent}) => parent?.dropdownKind !== 'multiColumn',
    }),
    defineField({
      name: 'items',
      title: 'Items (left list)',
      type: 'array',
      of: [{type: 'navRow'}],
      hidden: ({parent}) => parent?.dropdownKind !== 'singleWithIntro',
    }),
    defineField({
      name: 'introHeading',
      title: 'Default intro heading',
      type: 'string',
      description:
        'Single column + intro: shown on the right when the menu first opens, before hovering a left item.',
      hidden: ({parent}) => parent?.dropdownKind !== 'singleWithIntro',
    }),
    defineField({
      name: 'introBody',
      title: 'Default intro body',
      type: 'text',
      rows: 4,
      description: 'Body for that default right-hand panel (before hovering a left item).',
      hidden: ({parent}) => parent?.dropdownKind !== 'singleWithIntro',
    }),
  ],
  preview: {
    select: {title: 'label', kind: 'dropdownKind', href: 'href'},
    prepare({title, kind, href}) {
      const kindLabel =
        kind === 'multiColumn' ? 'Multi-column' : kind === 'singleWithIntro' ? 'Single+Intro' : 'None'
      return {title, subtitle: `${kindLabel}${href ? ' • has URL' : ''}`}
    },
  },
})

export default defineType({
  name: 'siteNavigation',
  title: 'Site Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Site Navigation',
      description: 'Shown in Studio as the document name (keep as “Site Navigation”).',
    }),
    defineField({
      name: 'items',
      title: 'Top-level items',
      type: 'array',
      of: [{type: 'navItem'}],
      validation: (Rule) => Rule.min(1).error('Add at least one top-level item.'),
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Site Navigation'}
    },
  },
})

export const navigationTypes = [navSubRow, navRow, navColumn, navItem]

