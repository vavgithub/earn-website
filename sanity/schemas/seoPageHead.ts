import { defineField } from 'sanity'

type SeoCanonicalUrlFieldOptions = {
  /** e.g. `/` for CMS pages, `/resources/` for News & Insights articles */
  urlPathPrefix: string
  slugLabel?: string
}

/** Optional canonical override for CMS pages and News & Insights articles. */
export function createSeoCanonicalUrlField({
  urlPathPrefix,
  slugLabel = 'page',
}: SeoCanonicalUrlFieldOptions) {
  const prefix = urlPathPrefix.endsWith('/') ? urlPathPrefix : `${urlPathPrefix}/`
  return defineField({
    name: 'canonicalUrl',
    title: 'Canonical URL',
    type: 'url',
    description: `Optional. When empty, the site uses the configured site URL plus ${prefix} and this ${slugLabel} slug. Override only if this page should point somewhere else.`,
    validation: (Rule) =>
      Rule.uri({
        scheme: ['http', 'https'],
        allowRelative: false,
      }),
  })
}

export const seoCanonicalUrlField = createSeoCanonicalUrlField({ urlPathPrefix: '/' })

/** Shared optional SEO + custom head tags for CMS documents (pages, blog posts). */
export const seoPageHeadField = defineField({
  name: 'seo',
  title: 'SEO & page head (optional)',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: 'title',
      title: 'SEO title',
      type: 'string',
      description: 'Shown in the browser tab and Google. If empty, the page title is used.',
    }),
    defineField({
      name: 'description',
      title: 'SEO description',
      type: 'text',
      rows: 4,
      description: 'Short summary for search and social previews.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Link preview image',
      type: 'image',
      options: { hotspot: true },
      description:
        'The picture shown when someone shares this page on LinkedIn, X, Slack, iMessage, etc.',
    }),
    defineField({
      name: 'headSnippet',
      title: 'Extra head tags',
      type: 'text',
      rows: 10,
      description:
        'Trusted editors only. Paste tags you want in the page head only for this page (for example one or more <script> or <meta> blocks). Wrong HTML can break the page.',
    }),
    seoCanonicalUrlField,
  ],
})
