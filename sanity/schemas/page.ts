import { defineField, defineType } from 'sanity'
import { DocumentsIcon } from '@sanity/icons'
import { AutoSlugInput } from '../components/AutoSlugInput'
import { createSlugIsUniqueValidator } from '../lib/ensureUniqueSlug'
import { pageBuilderInnerTypeRefs } from '../lib/pageBuilder'
import { seoPageHeadField } from './seoPageHead'

const RESERVED_SLUGS = new Set([
  'api',
  'studio',
  'blogs',
  'resources',
  'resources-old',
  '_next',
  'legacy',
  'favicon.ico',
])

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      components: { input: AutoSlugInput },
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: createSlugIsUniqueValidator('page'),
      },
      validation: (Rule) =>
        Rule.required().custom((value, context) => {
          const current = typeof value === 'object' && value && 'current' in value ? (value as { current?: string }).current : undefined
          if (!current) return true
          const key = current.trim().toLowerCase().replace(/^\/+|\/+$/g, '')
          if (RESERVED_SLUGS.has(key)) {
            return `“${current}” is reserved for the app (use another slug).`
          }
          return true
        }),
    }),
    seoPageHeadField,
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      of: pageBuilderInnerTypeRefs,
      validation: (Rule) => Rule.min(1).error('Add at least one block.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({ title, slug }) {
      return {
        title: title || 'Untitled',
        subtitle: slug ? `/${slug}` : 'Page',
      }
    },
  },
})
