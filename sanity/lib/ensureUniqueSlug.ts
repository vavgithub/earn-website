import type { SanityClient } from '@sanity/client'
import { apiVersion } from '../env'

/** Draft + published id pair for the open document (so we do not treat own slug as a clash). */
export function excludeIdsForDocument(rawId?: string | null): string[] {
  if (!rawId || typeof rawId !== 'string') return []
  const out = new Set<string>()
  out.add(rawId)
  if (rawId.startsWith('drafts.')) {
    out.add(rawId.slice('drafts.'.length))
  } else {
    out.add(`drafts.${rawId}`)
  }
  return [...out]
}

async function slugTakenByOther(
  client: SanityClient,
  opts: {
    documentType: string
    slug: string
    excludeIds: string[]
  },
): Promise<boolean> {
  const { documentType, slug, excludeIds } = opts
  if (!slug) return false
  const q =
    excludeIds.length > 0
      ? `count(*[_type == $type && slug.current == $slug && !(_id in $ids)])`
      : `count(*[_type == $type && slug.current == $slug])`
  const count = await client.fetch<number>(q, {
    type: documentType,
    slug,
    ...(excludeIds.length > 0 ? { ids: excludeIds } : {}),
  })
  return (count ?? 0) > 0
}

/**
 * First free slug: `base`, then `base-2`, `base-3`, … when `base` is already used by another document.
 */
export async function ensureUniqueSlugForType(
  client: SanityClient,
  opts: {
    documentType: string
    baseSlug: string
    maxLength: number
    excludeIds: string[]
  },
): Promise<string> {
  const { documentType, baseSlug, maxLength, excludeIds } = opts
  const base = baseSlug.trim().slice(0, maxLength)
  if (!base) return base

  if (!(await slugTakenByOther(client, { documentType, slug: base, excludeIds }))) {
    return base
  }

  for (let i = 2; i < 500; i += 1) {
    const suffix = `-${i}`
    const maxBase = Math.max(1, maxLength - suffix.length)
    const truncated = base.slice(0, maxBase)
    const candidate = `${truncated}${suffix}`
    if (!(await slugTakenByOther(client, { documentType, slug: candidate, excludeIds }))) {
      return candidate
    }
  }

  return `${base.slice(0, 40)}-${Date.now()}`
}

/** For `slug` field `options.isUnique` — same rules as {@link ensureUniqueSlugForType}. */
export function createSlugIsUniqueValidator(documentType: string) {
  return async (
    slug: string,
    context: { document?: { _id?: string } | null; getClient: (options: { apiVersion: string }) => SanityClient },
  ): Promise<boolean> => {
    if (!slug) return true
    const client = context.getClient({ apiVersion })
    const ids = excludeIdsForDocument(context.document?._id)
    const taken = await slugTakenByOther(client, { documentType, slug, excludeIds: ids })
    return !taken
  }
}
