import type { ReactNode } from 'react'

export type LayoutWidthValue = 'content' | 'reading' | 'fullBleed'

export function normalizeLayoutWidth(value: unknown): LayoutWidthValue {
  if (value === 'reading' || value === 'fullBleed') return value
  return 'content'
}

/** Same horizontal shell as nav / legacy pages (`max-w-content` + site padding). */
const SITE_CONTENT_SHELL = 'mx-auto w-full max-w-content px-5 md:px-10 lg:px-[100px]'

type PageBlockLayoutProps = {
  /** From Sanity `layoutWidth`; missing/legacy values → `content`. */
  layoutWidth?: unknown
  /** Optional classes on the inner width column (text alignment, etc.). */
  className?: string
  children: ReactNode
}

/**
 * Width shell for CMS page builder blocks.
 * - `content`: up to 1080px, left-aligned in the site column (blue-line alignment in designs)
 * - `reading`: up to 840px prose, same left edge as content/nav
 * - `fullBleed`: viewport breakout
 */
export default function PageBlockLayout({ layoutWidth, className = '', children }: PageBlockLayoutProps) {
  const w = normalizeLayoutWidth(layoutWidth)
  const extra = className.trim()

  if (w === 'fullBleed') {
    return (
      <div
        className={`relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 ${extra}`.trim()}
      >
        {children}
      </div>
    )
  }

  if (w === 'reading') {
    return (
      <div className={SITE_CONTENT_SHELL}>
        <div className={`w-full max-w-[840px] ${extra}`.trim()}>{children}</div>
      </div>
    )
  }

  return (
    <div className={SITE_CONTENT_SHELL}>
      <div className={`w-full max-w-[1080px] ${extra}`.trim()}>{children}</div>
    </div>
  )
}
