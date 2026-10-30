import type { MetadataRoute } from 'next'

import { RESOURCES_INDEX_PATH, resourcesArticlePath } from '@/lib/resourcePaths'
import { canonicalUrl } from '@/lib/siteCanonical'
import { client } from '@/sanity/lib/client'

type SlugRow = { slug: string; _updatedAt?: string }

export const dynamic = 'force-dynamic'

const STATIC_PATHS = ['/', RESOURCES_INDEX_PATH] as const

function toUrl(path: string): string {
  return canonicalUrl(path)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pagesQuery = `*[_type == "page" && defined(slug.current) && !(slug.current in ["studio","api","blogs","resources","resources-old","_next","home"])]{
    "slug": slug.current,
    _updatedAt
  }`

  const postsQuery = `*[_type == "blogPost" && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt
  }`

  const [pages, posts] = await Promise.all([
    client.fetch<SlugRow[]>(pagesQuery).catch(() => []),
    client.fetch<SlugRow[]>(postsQuery).catch(() => []),
  ])

  const staticUrls: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: toUrl(path),
  }))

  const pageUrls: MetadataRoute.Sitemap = pages.map((row) => ({
    url: toUrl(`/${row.slug}`),
  }))

  const postUrls: MetadataRoute.Sitemap = posts.map((row) => ({
    url: toUrl(resourcesArticlePath(row.slug)),
  }))

  // Deduplicate in case a CMS page overlaps a static route.
  const dedup = new Map<string, MetadataRoute.Sitemap[number]>()
  ;[...staticUrls, ...pageUrls, ...postUrls].forEach((entry) => dedup.set(entry.url, entry))

  return Array.from(dedup.values())
}

