import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'

export default defineType({
  name: 'blogSettings',
  title: 'Featured resource (hero)',
  type: 'document',
  icon: StarIcon,
  description: 'Large hero block at the top of /resources (above the tab bar).',
  fields: [
    defineField({
      name: 'featuredPost',
      title: 'Featured article',
      type: 'reference',
      to: [{ type: 'blogPost' }],
      description: 'Shown in the large “Featured Resource” block on /resources. Only one at a time.',
    }),
    defineField({
      name: 'defaultListingImage',
      title: 'Default card image',
      type: 'image',
      options: { hotspot: true },
      description: 'Fallback image for listing cards when a post has no card image.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Featured resource (hero)' }
    },
  },
})
