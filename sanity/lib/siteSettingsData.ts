import { cache } from 'react'

import { getSanityForRequest } from '@/sanity/lib/liveClient'

export const siteSettingsQuery = `*[_type == "siteSettings"] | order(_updatedAt desc)[0]{
  _id,
  globalHeadSnippet
}`

export type SiteSettingsData = {
  _id: string
  globalHeadSnippet?: string
}

export const getCachedSiteSettings = cache(async () => {
  const { isDraft, sanityClient } = await getSanityForRequest()
  const fetchOpts = isDraft ? { cache: 'no-store' as const } : { next: { revalidate: 60 } }

  try {
    const settings = await sanityClient.fetch<SiteSettingsData | null>(
      siteSettingsQuery,
      {},
      fetchOpts,
    )
    return { settings, fetchError: null as Error | null }
  } catch (fetchError) {
    return {
      settings: null,
      fetchError: fetchError instanceof Error ? fetchError : new Error(String(fetchError)),
    }
  }
})
