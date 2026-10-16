import { draftMode } from 'next/headers'

import { client } from './client'
import { getPresentationStudioBaseUrl } from './presentationStudioUrl'

export type SanityRequestContext = {
  isDraft: boolean
  sanityClient: typeof client
  /** Set when draft mode is on; pass to `BlockRenderer` for `createDataAttribute`. */
  studioBaseUrl?: string
}

/**
 * Single draft-mode + client resolution (avoids duplicate `draftMode` / studio URL work per request).
 */
export async function getSanityForRequest(): Promise<SanityRequestContext> {
  const { isEnabled: isDraft } = await draftMode()
  if (!isDraft) {
    return { isDraft: false, sanityClient: client }
  }

  const studioBaseUrl = await getPresentationStudioBaseUrl()
  const token = process.env.SANITY_API_READ_TOKEN
  const sanityClient = token
    ? client.withConfig({
        token,
        perspective: 'previewDrafts',
        useCdn: false,
        stega: { studioUrl: studioBaseUrl },
      })
    : client

  return { isDraft: true, sanityClient, studioBaseUrl }
}
