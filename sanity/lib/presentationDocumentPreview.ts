import type { SanityClient } from '@sanity/client'
import { getPublishedId } from 'sanity'
import { RESOURCES_INDEX_PATH, resourcesArticlePath } from '../../lib/resourcePaths'

/** Document types that map to a marketing-site preview URL. */
export const PRESENTATION_PREVIEW_DOC_TYPES = ['blogPost', 'page', 'blogSettings'] as const

export type PresentationPreviewDocType = (typeof PRESENTATION_PREVIEW_DOC_TYPES)[number]

export function isPresentationPreviewDocType(type: string): type is PresentationPreviewDocType {
  return (PRESENTATION_PREVIEW_DOC_TYPES as readonly string[]).includes(type)
}

const STRUCTURE_LIST_PANE_IDS = new Set([
  'resources-section',
  'resources-news-insights',
  'blog-posts',
  'blog-settings',
  'blog-categories',
  'blog-tags',
  'site-pages',
  'site-section',
  'site-navigation',
  'site-footer',
  'global-head-tags',
  'resource-cards-by-tab',
  'resource-tabs',
  'resources-hubspot-settings',
])

function readPaneId(segment: string): string {
  return segment.split('|')[0]?.split(',')[0]?.trim() ?? ''
}

function structurePanesSegment(pathname: string): string | null {
  const marker = '/structure/'
  const idx = pathname.indexOf(marker)
  if (idx === -1) return null
  const rest = pathname.slice(idx + marker.length).split('?')[0]?.split('#')[0] ?? ''
  if (!rest || rest.startsWith('intent')) return null
  return rest
}

/** Last pane id in a Structure URL (often the open document id). */
export function getLastStructurePaneId(pathname: string): string | null {
  const segment = structurePanesSegment(pathname)
  if (!segment) return null
  const groups = segment.split(';').filter(Boolean)
  if (groups.length === 0) return null
  const last = readPaneId(groups[groups.length - 1])
  return last || null
}

/**
 * Parse explicit type/id pairs from nested Structure paths
 * (e.g. `…;blogPost;abc123` or `…;page;about-page`).
 */
export function parseStructureDocumentFromPathname(pathname: string): { type: string; id: string } | null {
  const segment = structurePanesSegment(pathname)
  if (!segment) return null

  const groups = segment.split(';').filter(Boolean)
  if (groups.length === 0) return null

  for (let i = groups.length - 1; i >= 0; i -= 1) {
    const paneId = readPaneId(groups[i])
    if (paneId === 'blogSettings') {
      return { type: 'blogSettings', id: 'blogSettings' }
    }
    if (isPresentationPreviewDocType(paneId)) {
      if (i + 1 < groups.length) {
        const docId = readPaneId(groups[i + 1])
        if (docId && docId !== paneId && !STRUCTURE_LIST_PANE_IDS.has(docId)) {
          return { type: paneId, id: docId }
        }
      }
    }
  }

  if (groups.length >= 2) {
    const docId = readPaneId(groups[groups.length - 1])
    const maybeType = readPaneId(groups[groups.length - 2])
    if (
      isPresentationPreviewDocType(maybeType) &&
      docId &&
      !STRUCTURE_LIST_PANE_IDS.has(docId)
    ) {
      return { type: maybeType, id: docId }
    }
  }

  return null
}

/** Resolve the document open in Structure (explicit path match, then GROQ on last pane id). */
export async function resolveStructureDocument(
  pathname: string,
  client: SanityClient,
): Promise<{ type: string; id: string } | null> {
  const explicit = parseStructureDocumentFromPathname(pathname)
  if (explicit) return explicit

  const lastId = getLastStructurePaneId(pathname)
  if (!lastId || STRUCTURE_LIST_PANE_IDS.has(lastId)) return null

  const publishedId = getPublishedId(lastId)
  const doc = await client.fetch<{ _type?: string; _id?: string } | null>(
    `*[_id in [$id, "drafts." + $id]][0]{ _type, _id }`,
    { id: publishedId },
  )
  if (!doc?._type || !doc._id || !isPresentationPreviewDocType(doc._type)) return null
  return { type: doc._type, id: doc._id }
}

export async function resolvePresentationPreviewHref(
  client: SanityClient,
  type: string,
  id: string,
): Promise<string | null> {
  if (type === 'blogSettings') return RESOURCES_INDEX_PATH

  const publishedId = getPublishedId(id)

  if (type === 'blogPost') {
    const slug = await client.fetch<string | null>(
      `*[_id in [$id, "drafts." + $id]][0].slug.current`,
      { id: publishedId },
    )
    return slug?.trim() ? resourcesArticlePath(slug.trim()) : null
  }

  if (type === 'page') {
    const slug = await client.fetch<string | null>(
      `*[_id in [$id, "drafts." + $id]][0].slug.current`,
      { id: publishedId },
    )
    return slug?.trim() ? `/${slug.trim()}` : null
  }

  return null
}

export const STRUCTURE_DOC_STORAGE_KEY = 'earn-last-structure-doc'

export type StoredStructureDoc = {
  type: string
  id: string
  preview: string | null
}

export function readStoredStructureDoc(): StoredStructureDoc | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STRUCTURE_DOC_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredStructureDoc
    if (!parsed?.type || !parsed?.id) return null
    return parsed
  } catch {
    return null
  }
}

export function writeStoredStructureDoc(doc: StoredStructureDoc): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(STRUCTURE_DOC_STORAGE_KEY, JSON.stringify(doc))
}

/** Normalise preview values for comparison (`/about` vs full URL). */
export function previewPathKey(preview: string, origin: string): string {
  try {
    const u = new URL(preview, origin)
    return `${u.pathname}${u.search}`
  } catch {
    return preview
  }
}

export function previewSearchParamFromRouter(
  searchParams: [string, string][] | undefined,
): string | null {
  if (!searchParams) return null
  const hit = searchParams.find(([key]) => key === 'preview')
  return typeof hit?.[1] === 'string' ? hit[1] : null
}
