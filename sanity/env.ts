export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-04-22'

export const useCdn = false

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '') || ''

/**
 * Production marketing origin from `NEXT_PUBLIC_SITE_URL`.
 * Empty until that variable is set. Do not fall back to another project's domain.
 */
export const productionSiteOrigin = configuredSiteUrl

/**
 * Base URL of the Next site (Presentation `initial`, OG `metadataBase`, etc.).
 * Set `NEXT_PUBLIC_SITE_URL` per environment. Canonical URLs use this origin (`lib/siteCanonical.ts`).
 */
export const sitePreviewOrigin = (() => {
  if (configuredSiteUrl) return configuredSiteUrl

  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`

  return 'http://localhost:3000'
})()

/** Origins allowed for Sanity Presentation ↔ preview iframe (Comlink). */
const presentationAllowOriginList = [
  'http://localhost:3000',
  'http://localhost:*',
  'https://*.vercel.app',
  'https://*.amplifyapp.com',
]

if (configuredSiteUrl) {
  presentationAllowOriginList.push(configuredSiteUrl)
}

export const presentationAllowOrigins = presentationAllowOriginList

/** `protocol + host` only (derived from {@link sitePreviewOrigin}). */
export const sitePreviewWebOrigin = (() => {
  try {
    return new URL(sitePreviewOrigin).origin
  } catch {
    return sitePreviewOrigin.replace(/\/$/, '')
  }
})()
