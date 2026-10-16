import { redirect } from 'next/navigation'
import { buildResourcesIndexHref } from '@/lib/resourcePaths'

type Search = { category?: string; tag?: string }

/** Permanent move: blog listing lives at /resources. */
export default async function BlogsIndexRedirect({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const sp = await searchParams
  const categorySlug =
    typeof sp.category === 'string' && sp.category.trim() ? sp.category.trim() : null
  const tagSlug = typeof sp.tag === 'string' && sp.tag.trim() ? sp.tag.trim() : null
  redirect(buildResourcesIndexHref({ category: categorySlug, tag: tagSlug }))
}
