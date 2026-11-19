import { defineType, defineArrayMember, defineField } from 'sanity'
import { BlockquoteStyle } from '../components/BlockquoteStyle'

/**
 * Rich text fields across the marketing site (blocks, section intros, resources, etc.).
 *
 * Do not remove styles or list types that exist in production CMS content — Studio
 * will error on documents that still use them.
 *
 * “Open in new tab” is a boolean on each rich-text row (next to link color), not per link.
 */
export const blockContent = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote', component: BlockquoteStyle },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fieldsets: [
              {
                name: 'linkDestination',
                options: { columns: 2 },
              },
            ],
            fields: [
              defineField({
                name: 'page',
                title: 'Page',
                type: 'reference',
                to: [{ type: 'page' }],
                weak: true,
                fieldset: 'linkDestination',
                description: 'Pick a page on this site. Leave empty to use the URL.',
              }),
              defineField({
                title: 'URL',
                name: 'href',
                type: 'url',
                fieldset: 'linkDestination',
                description: 'Used when no page is picked. Full URL (https://…) or a path (/about).',
                validation: (Rule) =>
                  Rule.custom((value, context) => {
                    const parent = context.parent as { page?: { _ref?: string } } | undefined
                    if (parent?.page?._ref) return true
                    if (typeof value !== 'string' || !value.trim()) return 'Add a page or a URL'
                    if (
                      value.startsWith('/') ||
                      value.startsWith('http://') ||
                      value.startsWith('https://') ||
                      value.startsWith('mailto:') ||
                      value.startsWith('tel:')
                    ) {
                      return true
                    }
                    return 'Use a full URL or a path that starts with /'
                  }),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})
