import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, sitePreviewOrigin, useCdn } from '../env'

/** Fallback studio URL for `createDataAttribute` when `studioBaseUrl` is not passed (non-draft). */
export const presentationStudioBaseUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || `${sitePreviewOrigin}/studio`

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
})
