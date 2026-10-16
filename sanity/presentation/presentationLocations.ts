import { defineLocations } from 'sanity/presentation'
import { RESOURCES_INDEX_PATH, resourcesArticlePath } from '../../lib/resourcePaths'

/** Maps CMS documents to site URLs for Presentation (Structure banner + preview sync). */
export const presentationLocations = {
  blogSettings: defineLocations({
    select: { _id: '_id' },
    resolve: () => ({
      locations: [{ title: 'Resources (News & Insights)', href: RESOURCES_INDEX_PATH }],
    }),
  }),

  blogPost: defineLocations({
    select: { title: 'title', slug: 'slug.current' },
    resolve: (doc) => {
      const slug = typeof doc?.slug === 'string' ? doc.slug.trim() : ''
      if (!slug) {
        return { message: 'Add a slug to preview this article', tone: 'caution' as const }
      }
      const title = typeof doc?.title === 'string' && doc.title.trim() ? doc.title.trim() : slug
      return {
        locations: [{ title, href: resourcesArticlePath(slug) }],
      }
    },
  }),

  page: defineLocations({
    select: { title: 'title', slug: 'slug.current' },
    resolve: (doc) => {
      const slug = typeof doc?.slug === 'string' ? doc.slug.trim() : ''
      if (!slug) {
        return { message: 'Add a slug to preview this page', tone: 'caution' as const }
      }
      const title = typeof doc?.title === 'string' && doc.title.trim() ? doc.title.trim() : slug
      return {
        locations: [{ title, href: `/${slug}` }],
      }
    },
  }),
}
