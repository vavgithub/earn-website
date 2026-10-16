'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ensureHubSpotScript } from '@/components/website/hubspotFormUtils'

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (config: Record<string, unknown>) => void
      }
    }
  }
}

export type HubSpotFormEmbedProps = {
  portalId: string
  formId: string
  region?: string
  className?: string
  /** Defer script + form.create until the container is near the viewport. */
  lazy?: boolean
}

/**
 * Self-contained HubSpot embed target. Loads the shared v2 script once per page,
 * creates the form when visible (optional), and clears the container on unmount
 * so reCAPTCHA is not left running on hidden nodes.
 */
export function HubSpotFormEmbed({
  portalId,
  formId,
  region = 'na1',
  className = '',
  lazy = true,
}: HubSpotFormEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const createdRef = useRef(false)
  const reactId = useId().replace(/:/g, '')
  const targetId = `hs-form-${reactId}`
  const [shouldLoad, setShouldLoad] = useState(!lazy)

  useEffect(() => {
    if (!lazy) return
    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [lazy])

  useEffect(() => {
    if (!shouldLoad || !portalId.trim() || !formId.trim()) return

    let cancelled = false
    const target = `#${targetId}`

    const mountForm = async () => {
      if (createdRef.current || cancelled) return
      if (!document.querySelector(target)) return

      await ensureHubSpotScript()
      if (cancelled || createdRef.current) return
      if (!window.hbspt?.forms) return

      window.hbspt.forms.create({ portalId, formId, region, target })
      createdRef.current = true
    }

    mountForm()

    return () => {
      cancelled = true
      createdRef.current = false
      const node = containerRef.current
      if (node) node.innerHTML = ''
    }
  }, [shouldLoad, portalId, formId, region, targetId])

  const showPlaceholder = !portalId.trim() || !formId.trim()

  return (
    <div className={`w-full ${className}`.trim()}>
      {showPlaceholder ? (
        <p className="m-0 min-h-[280px] font-inter text-base leading-relaxed text-[#FDFDFB]/80 md:min-h-[328px]">
          Add HubSpot portal ID and form ID in Sanity to preview this form.
        </p>
      ) : (
        <div
          ref={containerRef}
          id={targetId}
          className="min-h-[280px] w-full md:min-h-[328px]"
          aria-busy={shouldLoad && !createdRef.current}
        />
      )}
    </div>
  )
}
