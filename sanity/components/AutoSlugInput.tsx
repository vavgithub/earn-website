'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { set, SlugInput, type SlugInputProps, useClient, useFormValue } from 'sanity'
import { apiVersion } from '../env'
import { ensureUniqueSlugForType, excludeIdsForDocument } from '../lib/ensureUniqueSlug'

const TITLE_DEBOUNCE_MS = 450

function defaultSlugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function sourceFieldPath(schemaType: SlugInputProps['schemaType']): string[] {
  const src = schemaType.options?.source
  if (typeof src === 'string' && src.trim()) return [src.trim()]
  return ['title']
}

/**
 * Slug field that stays in sync with `options.source` (usually `title`):
 * - Hides Sanity’s **Generate** UI (automation replaces it): `source` is omitted from the inner `SlugInput`.
 * - Updates the slug **after you pause typing** (~450ms), not on every keystroke.
 * - **Clears the slug** when the title is cleared (required validation reminds editors to set a title again).
 * - Keeps manual slug edits until you change the title in a way that still matches the last auto slug.
 * - Resolves **unique** slugs per document type (`news`, then `news-2`, …).
 */
export function AutoSlugInput(props: SlugInputProps) {
  const { value, onChange, schemaType, readOnly } = props
  const client = useClient({ apiVersion })
  const path = sourceFieldPath(schemaType)
  const sourceValue = useFormValue(path) as string | undefined
  const documentId = useFormValue(['_id']) as string | undefined
  const documentType = useFormValue(['_type']) as string | undefined
  /** Title we last auto-synced the slug from (so we know when the slug is still “tied” to title). */
  const lastSyncedTitleRef = useRef<string | undefined>(undefined)
  /** Latest trimmed title (for stale debounce / async checks). */
  const latestTrimmedRef = useRef('')

  const trimmedLive = useMemo(
    () => (typeof sourceValue === 'string' ? sourceValue : '').trim(),
    [sourceValue],
  )
  latestTrimmedRef.current = trimmedLive

  const [debouncedTitle, setDebouncedTitle] = useState(trimmedLive)
  useEffect(() => {
    if (!trimmedLive) {
      setDebouncedTitle('')
      return
    }
    const id = setTimeout(() => setDebouncedTitle(trimmedLive), TITLE_DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [trimmedLive])

  /** Omit `source` so the default SlugInput does not show the “Generate” button (we auto-fill instead). */
  const schemaTypeForSlugInput = useMemo(() => {
    const opts = { ...(schemaType.options ?? {}) } as Record<string, unknown>
    delete opts.source
    return { ...schemaType, options: opts } as SlugInputProps['schemaType']
  }, [schemaType])

  const slugify =
    (typeof schemaType.options?.slugify === 'function'
      ? schemaType.options.slugify
      : defaultSlugify) as (input: string) => string
  const maxLength =
    typeof schemaType.options?.maxLength === 'number' ? schemaType.options.maxLength : 96

  /** Title cleared → clear slug immediately so it does not “stick” with no title. */
  useEffect(() => {
    if (readOnly) return
    const current = typeof value?.current === 'string' ? value.current.trim() : ''
    if (!trimmedLive) {
      if (current) {
        onChange(set({ _type: 'slug', current: '' }))
      }
      lastSyncedTitleRef.current = undefined
    }
  }, [trimmedLive, readOnly, onChange, value?.current])

  useEffect(() => {
    if (readOnly) return
    if (!debouncedTitle.trim()) return

    const trimmed = debouncedTitle.trim()
    if (latestTrimmedRef.current !== trimmed) return

    const current = typeof value?.current === 'string' ? value.current.trim() : ''

    const prevTitle = lastSyncedTitleRef.current
    const prevTrimmed = typeof prevTitle === 'string' ? prevTitle.trim() : ''
    const prevAutoSlug = prevTrimmed ? slugify(prevTrimmed).slice(0, maxLength) : ''

    const baseSlug = slugify(trimmed).slice(0, maxLength)
    if (!baseSlug) return

    const shouldSync = !current || (prevAutoSlug !== '' && current === prevAutoSlug)

    if (!shouldSync || !documentType) return

    let cancelled = false
    ;(async () => {
      const excludeIds = excludeIdsForDocument(documentId)
      const unique = await ensureUniqueSlugForType(client, {
        documentType,
        baseSlug,
        maxLength,
        excludeIds,
      })
      if (cancelled) return
      if (latestTrimmedRef.current !== trimmed) return
      if (unique && unique !== current) {
        onChange(set({ _type: 'slug', current: unique }))
      }
      lastSyncedTitleRef.current = trimmed
    })()

    return () => {
      cancelled = true
    }
  }, [debouncedTitle, value?.current, readOnly, slugify, maxLength, onChange, client, documentId, documentType])

  return <SlugInput {...props} schemaType={schemaTypeForSlugInput} />
}
