import type { SanityClient } from '@sanity/client'
import {
  RESOURCES_INDEX_PATH,
  resourcesArticlePath,
} from '../../lib/resourcePaths'

export type SiteRouteChoice = { title: string; href: string; group: string }

/** Rewrite legacy `/blogs` paths for Browse routes (and stored nav links). */
export function normalizeSiteRouteHref(href: string): string {
  const h = href.trim()
  if (h === '/blogs' || h === '/blogs/') return RESOURCES_INDEX_PATH
  if (h.startsWith('/blogs/')) return resourcesArticlePath(h.slice('/blogs/'.length))
  return h
}

/** Hardcoded Next.js app routes (exclude `/studio` from editor picks). */
export const STATIC_SITE_ROUTES: SiteRouteChoice[] = [
  { group: 'Site', title: 'Home', href: '/' },
  { group: 'Site', title: 'Resources', href: '/resources' },
]

/**
 * CMS-backed routes: blog posts and builder pages (`app/[slug]`).
 */
export async function fetchSanitySiteRouteChoices(client: SanityClient): Promise<SiteRouteChoice[]> {
  const q = `{
    "blogs": *[_type == "blogPost" && defined(slug.current)] | order(title asc) {
      "title": coalesce(title, slug.current),
      "slug": slug.current
    },
    "pages": *[_type == "page" && defined(slug.current)] | order(title asc) {
      "title": coalesce(title, slug.current),
      "href": "/" + slug.current
    }
  }`
  const data = await client.fetch<{
    blogs?: { title?: string; slug?: string }[]
    pages?: { title?: string; href?: string }[]
  }>(q)

  const out: SiteRouteChoice[] = []
  for (const b of data?.blogs ?? []) {
    const slug = typeof b?.slug === 'string' ? b.slug.trim() : ''
    if (!slug) continue
    const href = resourcesArticlePath(slug)
    out.push({
      group: 'Resource article',
      title: typeof b?.title === 'string' && b.title.trim() ? b.title.trim() : slug,
      href,
    })
  }
  for (const p of data?.pages ?? []) {
    const href = typeof p?.href === 'string' ? p.href.trim() : ''
    if (!href) continue
    out.push({
      group: 'CMS page',
      title: typeof p?.title === 'string' && p.title.trim() ? p.title.trim() : href,
      href,
    })
  }
  return out
}

export function mergeRouteChoices(staticRoutes: SiteRouteChoice[], dynamic: SiteRouteChoice[]): SiteRouteChoice[] {
  const seen = new Set<string>()
  const merged: SiteRouteChoice[] = []
  for (const r of [...staticRoutes, ...dynamic]) {
    const h = normalizeSiteRouteHref(r.href)
    if (!h || seen.has(h)) continue
    seen.add(h)
    merged.push({ ...r, href: h })
  }
  return merged
}
