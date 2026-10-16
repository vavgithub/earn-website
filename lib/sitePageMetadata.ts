import type { Metadata } from 'next'

import { canonicalUrl, getCanonicalOrigin } from '@/lib/siteCanonical'

function metadataBaseUrl(): URL | undefined {
  try {
    return new URL(getCanonicalOrigin())
  } catch {
    return undefined
  }
}

/** Self-referencing canonical + metadataBase for static marketing routes. */
export function pageMetadata(path: string, metadata: Metadata): Metadata {
  const base = metadataBaseUrl()
  return {
    ...metadata,
    ...(base ? { metadataBase: base } : {}),
    alternates: {
      ...metadata.alternates,
      canonical: canonicalUrl(path),
    },
  }
}
