import { defineField, defineType } from 'sanity'
import { TagsIcon } from '@sanity/icons'
import { AutoSlugInput } from '../components/AutoSlugInput'
import { createSlugIsUniqueValidator } from '../lib/ensureUniqueSlug'

export default defineType({
  name: 'blogTag',
  title: 'News & Insights tag',
  type: 'document',
  description: 'Optional tags for articles on /resources.',
  icon: TagsIcon,
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
      options: { source: 'title', maxLength: 96, isUnique: createSlugIsUniqueValidator('blogTag') },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return { title: title || 'Tag', subtitle: slug ? `#${slug}` : '' }
    },
  },
})
