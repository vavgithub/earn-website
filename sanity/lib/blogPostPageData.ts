import { cache } from 'react'

import { getSanityForRequest } from '@/sanity/lib/liveClient'

/** GROQ fragment: single blog post for /resources/[slug] (page + metadata). */
export const blogPostBySlugQuery = `*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  publishedAt,
  listingImage,
  listingExcerpt,
  seo {
    title,
    description,
    ogImage,
    headSnippet,
    canonicalUrl
  },
  pageBuilder
}`

export type BlogPostPageData = {
  _id: string
  _type: string
  title?: string
  publishedAt?: string
  listingImage?: unknown
  listingExcerpt?: string
  seo?: {
    title?: string
    description?: string
    ogImage?: unknown
    headSnippet?: string
    canonicalUrl?: string
  }
  pageBuilder?: unknown[]
}

export const getCachedBlogPostPageData = cache(async (slug: string) => {
  const { isDraft, sanityClient, studioBaseUrl } = await getSanityForRequest()
  const fetchOpts = isDraft ? { cache: 'no-store' as const } : { next: { revalidate: 60 } }

  try {
    const post = await sanityClient.fetch<BlogPostPageData | null>(
      blogPostBySlugQuery,
      { slug },
      fetchOpts,
    )
    return { isDraft, sanityClient, studioBaseUrl, post, fetchError: null as Error | null }
  } catch (fetchError) {
    return {
      isDraft,
      sanityClient,
      studioBaseUrl,
      post: null as BlogPostPageData | null,
      fetchError: fetchError as Error,
    }
  }
})
