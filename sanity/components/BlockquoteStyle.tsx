'use client'

import type { ReactNode } from 'react'

/**
 * Studio-only block style for legacy `blockquote` portable text.
 * Uses `children` directly — do not call `renderDefault` (Sanity's default BlockQuote
 * nests `<div>` inside `<p>` and triggers hydration errors).
 */
export function BlockquoteStyle({ children }: { children?: ReactNode }) {
  return (
    <blockquote
      style={{
        margin: 0,
        borderLeft: '4px solid #2ecc71',
        paddingLeft: '1rem',
        fontStyle: 'italic',
      }}
    >
      {children}
    </blockquote>
  )
}
