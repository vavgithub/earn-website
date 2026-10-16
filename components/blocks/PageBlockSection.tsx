import type { ReactNode } from 'react'
import {
  blockPaddingClassName,
  resolveBlockPadding,
} from '@/lib/blockPadding'
import {
  DEFAULT_SECTION_BACKGROUND,
  type SectionBackgroundValue,
  sectionBackgroundClassName,
  sectionBackgroundStyle,
  sectionBackgroundTextClassName,
  resolveSectionBackground,
} from '@/lib/sectionBackground'

type PageBlockSectionProps = {
  block?: Record<string, unknown> | null
  /** Sanity `_type` — used for padding defaults when CMS fields are empty. */
  blockType?: string
  /** Used when `sectionBackground` is missing on older CMS documents. */
  defaultBackground?: SectionBackgroundValue
  className?: string
  children: ReactNode
}

/**
 * Full-width section shell with optional CMS section background and padding.
 * Block inner components must not add section-level py-* — use CMS paddingTop / paddingBottom only.
 */
export default function PageBlockSection({
  block,
  blockType,
  defaultBackground = DEFAULT_SECTION_BACKGROUND,
  className = '',
  children,
}: PageBlockSectionProps) {
  const bgKey = resolveSectionBackground(block?.sectionBackground, defaultBackground)
  const bg = sectionBackgroundClassName(bgKey)
  const bgStyle = sectionBackgroundStyle(bgKey)
  const text = sectionBackgroundTextClassName(bgKey)
  const padding = blockPaddingClassName(resolveBlockPadding(block, blockType))
  return (
    <section className={`${bg} ${text} ${padding} ${className}`.trim()} style={bgStyle}>
      {children}
    </section>
  )
}
