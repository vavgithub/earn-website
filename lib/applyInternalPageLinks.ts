import { stegaClean } from 'next-sanity'

type FetchClient = {
  fetch: <T>(query: string, params?: Record<string, unknown>, options?: object) => Promise<T>
}

function publishedId(ref: string) {
  return ref.startsWith('drafts.') ? ref.slice('drafts.'.length) : ref
}

function pageRef(value: unknown) {
  if (!value || typeof value !== 'object') return undefined
  const ref = (value as { _ref?: unknown })._ref
  const clean = stegaClean(typeof ref === 'string' ? ref : '').trim()
  return clean ? publishedId(clean) : undefined
}

function collect(value: unknown, ids: Set<string>) {
  if (!value || typeof value !== 'object') return
  if (Array.isArray(value)) {
    for (const item of value) collect(item, ids)
    return
  }
  const record = value as Record<string, unknown>
  if (record._type === 'link' || record._type === 'buttonBlock' || record._type === 'calloutBlock' || record._type === 'filterCard' || record._type === 'proofItem' || record._type === 'insightCard' || record._type === 'insightCardsBlock') {
    const id = pageRef(record.page)
    if (id) ids.add(id)
  }
  for (const child of Object.values(record)) collect(child, ids)
}

function apply(value: unknown, paths: Map<string, string>) {
  if (!value || typeof value !== 'object') return
  if (Array.isArray(value)) {
    for (const item of value) apply(item, paths)
    return
  }
  const record = value as Record<string, unknown>
  if (record._type === 'link' || record._type === 'buttonBlock') {
    const id = pageRef(record.page)
    const path = id ? paths.get(id) : undefined
    if (path) record.href = path
  }
  if (record._type === 'calloutBlock' || record._type === 'proofItem') {
    const id = pageRef(record.page)
    const path = id ? paths.get(id) : undefined
    if (path) record.buttonUrl = path
  }
  if (record._type === 'insightCard') {
    const id = pageRef(record.page)
    const path = id ? paths.get(id) : undefined
    if (path) record.linkUrl = path
  }
  if (record._type === 'insightCardsBlock') {
    const id = pageRef(record.page)
    const path = id ? paths.get(id) : undefined
    if (path) record.conclusionUrl = path
  }
  for (const child of Object.values(record)) apply(child, paths)
}

/** Fills a picked page into the link address. A link with no page is left as it is. */
export async function applyInternalPageLinks(
  data: unknown,
  client: FetchClient,
  fetchOptions?: object,
) {
  const ids = new Set<string>()
  collect(data, ids)
  if (ids.size === 0) return

  const list = [...ids]
  let rows: Array<{ _id?: string | null; slug?: string | null }> = []
  try {
    rows = await client.fetch<Array<{ _id?: string | null; slug?: string | null }>>(
      `*[_id in $ids]{ _id, "slug": slug.current }`,
      { ids: [...list, ...list.map((id) => `drafts.${id}`)] },
      fetchOptions,
    )
  } catch {
    return
  }

  const paths = new Map<string, string>()
  const ordered = [...rows].sort(
    (a, b) => Number(String(a._id).startsWith('drafts.')) - Number(String(b._id).startsWith('drafts.')),
  )
  for (const row of ordered) {
    const id = publishedId(stegaClean(typeof row._id === 'string' ? row._id : '').trim())
    const slug = stegaClean(typeof row.slug === 'string' ? row.slug : '').trim()
    if (!id || !slug) continue
    paths.set(id, slug === 'home' ? '/' : `/${slug.replace(/^\/+/, '')}`)
  }
  apply(data, paths)
}
