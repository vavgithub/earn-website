/** Studio slug `home` is the homepage document. The site shows that page at `/`. */
export function pagePreviewPath(slug: string): string {
  const key = slug.trim().replace(/^\/+|\/+$/g, '')
  if (!key || key === 'home') return '/'
  return `/${key}`
}

export function isHomepagePreview(id: string | null | undefined, slug: string | null | undefined) {
  const publishedId = (id ?? '').replace(/^drafts\./, '')
  const key = (slug ?? '').trim().replace(/^\/+|\/+$/g, '')
  return publishedId === 'homepage' || key === 'home'
}
