'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { useClient } from 'sanity'
import { useRouter, useRouterState } from 'sanity/router'
import { apiVersion, sitePreviewOrigin } from '../env'
import {
  isPresentationPreviewDocType,
  previewPathKey,
  previewSearchParamFromRouter,
  readStoredStructureDoc,
  resolvePresentationPreviewHref,
  resolveStructureDocument,
  writeStoredStructureDoc,
  type StoredStructureDoc,
} from '../lib/presentationDocumentPreview'

const PRESENTATION_TOOL = 'presentation'
const SYNC_GUARD_MS = 12_000
const MAX_REAPPLY = 4

function isStructurePath(path: string): boolean {
  return path.includes('/structure/')
}

function isPresentationPath(path: string): boolean {
  return path.includes('/presentation')
}

function navigateToStoredDoc(
  router: ReturnType<typeof useRouter>,
  doc: StoredStructureDoc,
): boolean {
  if (!doc.preview || !isPresentationPreviewDocType(doc.type)) return false
  router.navigateIntent('edit', {
    id: doc.id,
    type: doc.type,
    mode: 'presentation',
    presentation: PRESENTATION_TOOL,
    preview: doc.preview,
  })
  return true
}

/**
 * When switching Structure → Presentation, open the same document's site URL.
 * Re-applies if the preview URL machine briefly loads `/resources` then wins the race.
 */
export function PresentationStructureSync() {
  const router = useRouter()
  const client = useClient({ apiVersion })
  const studioPath = useRouterState((state) => router.resolvePathFromState(state))
  const previewParam = useRouterState((state) =>
    previewSearchParamFromRouter(state._searchParams as [string, string][] | undefined),
  )

  const prevStudioPathRef = useRef('')
  const syncTargetRef = useRef<string | null>(null)
  const syncExpiresAtRef = useRef(0)
  const reapplyCountRef = useRef(0)

  // While in Structure, cache document + preview path before the user switches tabs.
  useEffect(() => {
    if (!isStructurePath(studioPath)) return

    let cancelled = false
    void (async () => {
      const doc = await resolveStructureDocument(studioPath, client)
      if (cancelled || !doc || !isPresentationPreviewDocType(doc.type)) return

      const preview = await resolvePresentationPreviewHref(client, doc.type, doc.id)
      if (cancelled) return

      writeStoredStructureDoc({ type: doc.type, id: doc.id, preview })
    })()

    return () => {
      cancelled = true
    }
  }, [studioPath, client])

  // Structure → Presentation: navigate immediately using cached preview (no async wait).
  useLayoutEffect(() => {
    const prev = prevStudioPathRef.current
    prevStudioPathRef.current = studioPath

    if (!isStructurePath(prev) || !isPresentationPath(studioPath)) return

    const stored = readStoredStructureDoc()
    if (!stored?.preview || !isPresentationPreviewDocType(stored.type)) return

    syncTargetRef.current = previewPathKey(stored.preview, sitePreviewOrigin)
    syncExpiresAtRef.current = Date.now() + SYNC_GUARD_MS
    reapplyCountRef.current = 0

    navigateToStoredDoc(router, stored)
  }, [studioPath, router])

  // If draft-mode / preview URL machine resets to `/resources`, put the intended URL back.
  useEffect(() => {
    if (!isPresentationPath(studioPath)) return
    if (!previewParam) return

    const target = syncTargetRef.current
    if (!target || Date.now() > syncExpiresAtRef.current) return

    const stored = readStoredStructureDoc()
    if (!stored?.preview) return

    const current = previewPathKey(previewParam, sitePreviewOrigin)
    if (current === target) {
      syncTargetRef.current = null
      return
    }

    if (reapplyCountRef.current >= MAX_REAPPLY) return

    reapplyCountRef.current += 1
    navigateToStoredDoc(router, stored)
  }, [studioPath, previewParam, router])

  // Late re-apply after draft-mode iframe redirect (common ~1–2s after tab switch).
  useEffect(() => {
    if (!isPresentationPath(studioPath)) return
    if (!syncTargetRef.current || Date.now() > syncExpiresAtRef.current) return

    const stored = readStoredStructureDoc()
    if (!stored?.preview) return

    const timers = [800, 1800, 3200].map((ms) =>
      window.setTimeout(() => {
        if (!syncTargetRef.current || Date.now() > syncExpiresAtRef.current) return
        if (reapplyCountRef.current >= MAX_REAPPLY) return

        const livePreview = previewSearchParamFromRouter(
          router.state._searchParams as [string, string][] | undefined,
        )
        const current = livePreview
          ? previewPathKey(livePreview, sitePreviewOrigin)
          : ''
        if (current === syncTargetRef.current) {
          syncTargetRef.current = null
          return
        }

        reapplyCountRef.current += 1
        navigateToStoredDoc(router, stored)
      }, ms),
    )

    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [studioPath, router])

  return null
}
