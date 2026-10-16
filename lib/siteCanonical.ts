import { sitePreviewOrigin } from '@/sanity/env'

function configuredHostname(): string | null {
  try {
    return new URL(sitePreviewOrigin).hostname.toLowerCase()
  } catch {
    return null
  }
}

/**
 * Origin for sitemap + rel=canonical.
 * Uses `NEXT_PUBLIC_SITE_URL` when set, otherwise the preview origin (Vercel host or localhost).
 */
export function getCanonicalOrigin(): string {
  return sitePreviewOrigin.replace(/\/$/, '')
}

/** Normalize a site path for canonical/sitemap (`/about`, not `/about/`). */
export function canonicalPath(path: string): string {
  if (!path || path === '/') return '/'
  const withSlash = path.startsWith('/') ? path : `/${path}`
  return withSlash.replace(/\/+$/, '') || '/'
}

export function canonicalUrl(path: string): string {
  return `${getCanonicalOrigin()}${canonicalPath(path)}`
}

/** Strip a leading www when it matches the configured site host, and drop a trailing slash. */
export function normalizeCanonicalOverride(url: string): string {
  try {
    const parsed = new URL(url)
    const host = configuredHostname()
    if (host && parsed.hostname.toLowerCase() === `www.${host}`) {
      parsed.hostname = host
    }
    const normalized = parsed.toString()
    return normalized.endsWith('/') && parsed.pathname !== '/'
      ? normalized.slice(0, -1)
      : normalized
  } catch {
    return url.trim()
  }
}

export function resolveCanonicalUrl(path: string, override?: string | null): string {
  const trimmed = override?.trim()
  if (!trimmed) return canonicalUrl(path)

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return normalizeCanonicalOverride(trimmed)
  }

  return canonicalUrl(trimmed.startsWith('/') ? trimmed : `/${trimmed}`)
}
