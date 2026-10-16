'use client'

import { useEffect, useRef } from 'react'
import { ensureHubSpotScript, setHiddenInputByName } from '@/components/website/hubspotFormUtils'

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (config: Record<string, unknown>) => void
      }
    }
  }
}

export type HubSpotFormProps = {
  portalId: string
  formId: string
  region?: string
  target: string
  /**
   * Optional hidden-field overrides; injected once HubSpot renders the form. Useful for routing
   * the same form to different workflows (e.g. resources methodology / guide modals).
   */
  hiddenFields?: { names: string[]; value: string }[]
  /** Only create the form when `window.location.hash === requireHash`. */
  requireHash?: string
}

function hashMatchesRequireHash(requireHash: string): boolean {
  const raw = window.location.hash.replace(/^#/, '').trim()
  if (!raw) return false
  if (raw === requireHash) return true

  // Support combined deep links like: #casestudies:tallgrass-case-study
  // (also allow #tab/modal and #tab--modal)
  const parts = raw.split(/[:/]{1}|--/).filter(Boolean)
  const last = parts[parts.length - 1]?.trim()
  return last === requireHash
}

/**
 * Loads the HubSpot embed script (once across the page) and creates a form into `target`.
 * If `requireHash` is provided, the form is created lazily on hash changes — useful for modal forms.
 */
export function HubSpotForm({
  portalId,
  formId,
  region = 'na1',
  target,
  hiddenFields,
  requireHash,
}: HubSpotFormProps) {
  const created = useRef(false)

  useEffect(() => {
    let cancelled = false

    const tryCreate = async () => {
      if (created.current || cancelled) return
      if (!document.querySelector(target)) return

      if (requireHash && !hashMatchesRequireHash(requireHash)) return

      await ensureHubSpotScript()
      if (cancelled || created.current) return
      if (!window.hbspt?.forms) return

      const opts: Record<string, unknown> = { portalId, formId, region, target }
      if (hiddenFields && hiddenFields.length) {
        opts.onFormReady = ($form: unknown) => {
          hiddenFields.forEach(({ names, value }) => setHiddenInputByName($form, names, value))
        }
      }

      window.hbspt.forms.create(opts)
      created.current = true
    }

    tryCreate()

    if (requireHash) {
      const onHash = () => tryCreate()
      window.addEventListener('hashchange', onHash)
      return () => {
        cancelled = true
        window.removeEventListener('hashchange', onHash)
      }
    }

    return () => {
      cancelled = true
    }
  }, [portalId, formId, region, target, hiddenFields, requireHash])

  return null
}
