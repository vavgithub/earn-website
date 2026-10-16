import { defineField, defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { pageBuilderInnerTypeRefs } from '../lib/pageBuilder'
import { createSlugIsUniqueValidator } from '../lib/ensureUniqueSlug'
import { AutoSlugInput } from '../components/AutoSlugInput'
import { BlogTagsCheckboxInput } from '../components/BlogTagsCheckboxInput'
import { createSeoCanonicalUrlField } from './seoPageHead'

export default defineType({
  name: 'blogPost',
  title: 'News & Insights article',
  type: 'document',
  icon: DocumentTextIcon,
  description: 'Articles listed under the News & Insights tab on /resources.',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      ...orderRankField({ type: 'blogPost' }),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Article title and the heading on /resources cards (long titles truncate after two lines on the card).',
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
        isUnique: createSlugIsUniqueValidator('blogPost'),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO & page head (optional)',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'title',
          title: 'SEO title',
          type: 'string',
          description: 'Shown in the browser tab and Google. If empty, the post title is used.',
        }),
        defineField({
          name: 'description',
          title: 'SEO description',
          type: 'text',
          rows: 4,
          description:
            'Short summary for search and social previews. If empty, the card description is used when available.',
        }),
        defineField({
          name: 'ogImage',
          title: 'Link preview image',
          type: 'image',
          options: { hotspot: true },
          description:
            'The picture shown when someone shares this post on LinkedIn, X, Slack, iMessage, etc. If empty, the card image is used when available.',
        }),
        defineField({
          name: 'headSnippet',
          title: 'Extra head tags',
          type: 'text',
          rows: 10,
          description:
            'Trusted editors only. Paste tags you want in the page head only for this post (for example one or more <script> or <meta> blocks). Wrong HTML can break the page.',
        }),
        createSeoCanonicalUrlField({ urlPathPrefix: '/resources/', slugLabel: 'post' }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'blogCategory' }],
      description: 'Shown on the card and used for the tabs on /resources. Create new categories under Blog → Categories.',
      options: {
        disableNew: false,
      },
      validation: (Rule) =>
        Rule.required().error('Choose a category so this post appears under the correct tab on /resources.'),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'blogTag' }],
        },
      ],
      description:
        'Optional. Filter chips on /resources. Use + New tag to create. Uncheck to remove only from this post. Delete tags under Blog → Tags in the desk.',
      components: {
        input: BlogTagsCheckboxInput,
      },
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'listingImage',
      title: 'Card image',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown on /resources and in the featured slot. If empty, we try the first image in the page below, then the default in Featured resource settings.',
    }),
    defineField({
      name: 'listingExcerpt',
      title: 'Card description',
      type: 'text',
      rows: 5,
      description:
        'Text under the title on cards and in the featured block. If empty, we try to pull a line from the page below. Long text is clipped on the card after seven lines.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      of: pageBuilderInnerTypeRefs,
    }),
  ],
  preview: {
    select: { title: 'title', cat: 'category.title' },
    prepare({ title, cat }) {
      return {
        title: title || 'Untitled',
        subtitle: cat ? String(cat) : 'News & Insights',
      }
    },
  },
})
