import { cache } from 'react'

import { getSanityForRequest } from '@/sanity/lib/liveClient'

/** GROQ fragment: single CMS page for /[slug] (page + metadata). */
export const cmsPageBySlugQuery = `*[_type == "page" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  seo {
    title,
    description,
    ogImage,
    headSnippet,
    canonicalUrl
  },
  pageBuilder
}`

export type CmsPageData = {
  _id: string
  _type: string
  title?: string
  seo?: {
    title?: string
    description?: string
    ogImage?: unknown
    headSnippet?: string
    canonicalUrl?: string
  }
  pageBuilder?: unknown[]
}

/** The site homepage document. Slug `home` is only the Studio address; the site shows it at `/`. */
export const homepageQuery = `*[_id == "homepage"][0]{
  _id,
  _type,
  title,
  seo {
    title,
    description,
    ogImage,
    headSnippet,
    canonicalUrl
  },
  pageBuilder
}`

export const getCachedHomepage = cache(async () => {
  const { isDraft, sanityClient, studioBaseUrl } = await getSanityForRequest()
  const fetchOpts = isDraft ? { cache: 'no-store' as const } : { next: { revalidate: 60 } }

  try {
    const page = await sanityClient.fetch<CmsPageData | null>(homepageQuery, {}, fetchOpts)
    return { isDraft, sanityClient, studioBaseUrl, page, fetchError: null as Error | null }
  } catch (fetchError) {
    return {
      isDraft,
      sanityClient,
      studioBaseUrl,
      page: null as CmsPageData | null,
      fetchError: fetchError as Error,
    }
  }
})

export const getCachedCmsPageData = cache(async (slug: string) => {
  const { isDraft, sanityClient, studioBaseUrl } = await getSanityForRequest()
  const fetchOpts = isDraft ? { cache: 'no-store' as const } : { next: { revalidate: 60 } }

  try {
    const page = await sanityClient.fetch<CmsPageData | null>(
      cmsPageBySlugQuery,
      { slug },
      fetchOpts,
    )
    return { isDraft, sanityClient, studioBaseUrl, page, fetchError: null as Error | null }
  } catch (fetchError) {
    return {
      isDraft,
      sanityClient,
      studioBaseUrl,
      page: null as CmsPageData | null,
      fetchError: fetchError as Error,
    }
  }
})
