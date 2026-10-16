import { defineField, defineType } from 'sanity'
import { ThListIcon } from '@sanity/icons'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { AutoSlugInput } from '../components/AutoSlugInput'

/** Public URL hash for /resources#… (e.g. governance, methodologies, casestudies). */
const TAB_HASH_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** DOM id suffix for tab panels (e.g. case-studies for hash casestudies). */
const TAB_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export default defineType({
  name: 'resourceTab',
  title: 'Resource tab',
  type: 'document',
  icon: ThListIcon,
  description:
    'Site tabs on /resources (Governance, Methodologies, Guides, Case Studies). News & Insights is separate. Reorder: Resources → Resource tabs → Tab order. Add cards under each tab list.',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      ...orderRankField({ type: 'resourceTab' }),
    }),
    defineField({
      name: 'title',
      title: 'Tab label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tabHash',
      title: 'URL hash',
      type: 'slug',
      description:
        'Public deep-link segment after # on /resources (e.g. governance, methodologies, casestudies). Do not use "news" — that tab is reserved for articles.',
      components: { input: AutoSlugInput },
      options: {
        source: 'title',
        maxLength: 48,
        slugify: (input: string) =>
          input
            .trim()
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
      },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          const value = typeof slug === 'object' && slug && 'current' in slug ? slug.current : slug
          if (!value || typeof value !== 'string') return 'URL hash is required'
          if (value === 'news' || value === 'news-insights') {
            return 'Reserved for News & Insights — choose another hash'
          }
          if (!TAB_HASH_PATTERN.test(value)) {
            return 'Use lowercase letters, numbers, and hyphens only'
          }
          return true
        }),
    }),
    defineField({
      name: 'tabKey',
      title: 'Internal tab key',
      type: 'string',
      description:
        'DOM id for this tab (e.g. governance, methodologies, case-studies). Must match existing deep links if migrating.',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value || typeof value !== 'string') return 'Tab key is required'
          if (!TAB_KEY_PATTERN.test(value)) {
            return 'Use lowercase letters, numbers, and hyphens only'
          }
          return true
        }),
    }),
    defineField({
      name: 'gridLayout',
      title: 'Card grid layout',
      type: 'string',
      options: {
        list: [
          { title: 'Two columns (default)', value: 'twoColumn' },
          { title: 'Two columns (same as default)', value: 'twoColumnWithDivider' },
          { title: 'Single column (governance)', value: 'singleWide' },
        ],
        layout: 'radio',
      },
      initialValue: 'twoColumn',
    }),
  ],
  preview: {
    select: { title: 'title', tabHash: 'tabHash.current', tabKey: 'tabKey' },
    prepare({ title, tabHash, tabKey }) {
      return {
        title: title || 'Tab',
        subtitle: tabHash ? `#${tabHash} · id=${tabKey}` : tabKey ? `id=${tabKey}` : '',
      }
    },
  },
})
