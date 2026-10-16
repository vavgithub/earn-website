'use client'

import { useSyncExternalStore } from 'react'
import { VisualEditing } from 'next-sanity/visual-editing'

function getIsPresentationIframe() {
  try {
    return window.parent !== window.self
  } catch {
    return false
  }
}

/**
 * Sanity overlays only inside the Presentation preview iframe. Draft mode can stay on in a normal
 * tab after using Presentation — do not mount `<VisualEditing />` there.
 *
 * `useSyncExternalStore` detects the iframe on the first client render (before paint) so Studio’s
 * comlink connects immediately. A `useState(false)` + `useLayoutEffect` delay caused the preview to
 * flash blank until the Presentation refresh button was used.
 */
export default function VisualEditingBridge() {
  const isPresentationIframe = useSyncExternalStore(
    () => () => {},
    getIsPresentationIframe,
    () => false,
  )

  if (!isPresentationIframe) return null
  return <VisualEditing />
}
