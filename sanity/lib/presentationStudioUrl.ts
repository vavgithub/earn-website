import { headers } from 'next/headers'

import { sitePreviewOrigin } from '../env'

/** Studio URL for Presentation: env override, else request host + `/studio`, else `sitePreviewOrigin`. */
export async function getPresentationStudioBaseUrl(): Promise<string> {
  const explicit = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL?.replace(/\/$/, '')
  if (explicit) return explicit

  const h = await headers()
  const host =
    h.get('x-forwarded-host')?.split(',')[0]?.trim() ?? h.get('host') ?? null
  let proto = h.get('x-forwarded-proto')?.split(',')[0]?.trim() ?? null

  if (host) {
    if (!proto) {
      proto = host.includes('localhost') ? 'http' : 'https'
    }
    return `${proto}://${host}/studio`
  }

  return `${sitePreviewOrigin.replace(/\/$/, '')}/studio`
}
