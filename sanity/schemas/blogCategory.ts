import { defineField, defineType } from 'sanity'
import { ListIcon } from '@sanity/icons'
import { AutoSlugInput } from '../components/AutoSlugInput'
import { createSlugIsUniqueValidator } from '../lib/ensureUniqueSlug'

export default defineType({
  name: 'blogCategory',
  title: 'News & Insights category',
  type: 'document',
  icon: ListIcon,
  description:
    'Filter tabs under News & Insights on /resources (plus “All”, which is not a category document). Default set: run `npm run seed:blog-categories` once.',
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
      options: { source: 'title', maxLength: 96, isUnique: createSlugIsUniqueValidator('blogCategory') },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first in the category tabs (after “All”).',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return { title: title || 'Category', subtitle: slug ? `/${slug}` : '' }
    },
  },
})
