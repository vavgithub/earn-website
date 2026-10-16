/** Canonical URLs for the merged Resources hub (blog listing + legacy tabs). */

export const RESOURCES_INDEX_PATH = '/resources'

export function resourcesArticlePath(slug: string): string {
  return `${RESOURCES_INDEX_PATH}/${slug}`
}

export function buildResourcesIndexHref(opts: {
  category?: string | null
  tag?: string | null
}): string {
  const p = new URLSearchParams()
  if (opts.category) p.set('category', opts.category)
  if (opts.tag) p.set('tag', opts.tag)
  const q = p.toString()
  return q ? `${RESOURCES_INDEX_PATH}?${q}` : RESOURCES_INDEX_PATH
}

/** @deprecated Use `buildResourcesIndexHref` — kept for redirects only. */
export function buildBlogsIndexHref(opts: {
  category?: string | null
  tag?: string | null
}): string {
  return buildResourcesIndexHref(opts)
}
