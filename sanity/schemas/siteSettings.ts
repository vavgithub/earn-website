import { defineField, defineType } from 'sanity'
import { CodeIcon } from '@sanity/icons'

export default defineType({
  name: 'siteSettings',
  title: 'Global head tags',
  type: 'document',
  icon: CodeIcon,
  fields: [
    defineField({
      name: 'globalHeadSnippet',
      title: 'Head tags',
      type: 'text',
      rows: 12,
      description:
        'Trusted editors only. Paste <script> / <meta> tags here — they run on every public page. Per-page “Extra head tags” on Pages and posts are added on top. Cookiebot + GA4: paste the Cookiebot script, the gtag.js loader, and Google’s inline gtag config block (three script tags). Wrong HTML can break the site.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Global head tags' }
    },
  },
})
