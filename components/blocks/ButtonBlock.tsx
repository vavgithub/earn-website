import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { stegaClean } from 'next-sanity'
import { LinkRuleChevron } from '@/components/ui/Button'
import PageBlockLayout from '@/components/blocks/PageBlockLayout'
import PageBlockSection from '@/components/blocks/PageBlockSection'
import type {
  GridCellSurface,
  LayoutSlotVariant,
} from '@/components/blocks/layoutSlotVariant'
import type { TextColorValue } from '@/lib/cmsTextColor'
import {
  fillButtonClasses,
  ghostButtonClasses,
  linkRuleWrapperProps,
  resolveButtonBlock,
  textLinkButtonClasses,
} from '@/lib/resolveButtonBlock'

function clean(s: unknown) {
  return stegaClean(typeof s === 'string' ? s : String(s ?? '')).trim()
}

function isExternalHref(href: string) {
  const t = href.trim()
  return (
    /^https?:\/\//i.test(t) ||
    t.startsWith('mailto:') ||
    t.startsWith('tel:') ||
    t.startsWith('//')
  )
}

function normalizeInternalPath(href: string) {
  const t = href.trim()
  if (!t) return '/'
  if (isExternalHref(t)) return t
  return t.startsWith('/') ? t : `/${t}`
}

const alignClass = {
  left: 'flex justify-start',
  center: 'flex justify-center',
  right: 'flex justify-end',
} as const

type ButtonBlockProps = {
  block: Record<string, unknown>
  embedded?: boolean
  slotVariant?: LayoutSlotVariant
  gridCellSurface?: GridCellSurface
  /** @deprecated use `embedded` */
  nested?: boolean
}

const gridCellGhostClass =
  'border-[#FDFDFB] text-[#FDFDFB] hover:bg-[#FDFDFB] hover:text-[#141D19] active:bg-[#FDFDFB]/90 active:text-[#141D19]'

function cn(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ')
}

function wrapWithTopLine(show: boolean, lineColor: TextColorValue, node: ReactNode) {
  if (!show) return node
  const { className, style } = linkRuleWrapperProps(lineColor)
  return (
    <div className={className} style={style}>
      {node}
    </div>
  )
}

function TextChevronLink({
  href,
  label,
  openInNewTab,
  className,
  style,
}: {
  href: string
  label: string
  openInNewTab: boolean
  className: string
  style?: CSSProperties
}) {
  const linkContent = (
    <>
      {label}
      <LinkRuleChevron />
    </>
  )

  if (isExternalHref(href) || openInNewTab) {
    return (
      <a
        href={href}
        className={className}
        style={style}
        {...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {linkContent}
      </a>
    )
  }

  return (
    <Link href={href} className={className} style={style}>
      {linkContent}
    </Link>
  )
}

function ButtonInner({
  block,
  nested = false,
  slotVariant = 'default',
  gridCellSurface = 'dark',
}: ButtonBlockProps) {
  const label = clean(block.label)
  const hrefRaw = clean(block.href)
  if (!label || !hrefRaw) return null

  const config = resolveButtonBlock(block)
  const alignment = (
    nested ? 'left' : clean(block.alignment) || 'left'
  ) as keyof typeof alignClass
  const align = alignClass[alignment] ?? alignClass.left
  const openInNewTab = Boolean(block.openInNewTab)
  const onDarkGrid = slotVariant === 'gridCell' && gridCellSurface === 'dark'

  const href = isExternalHref(hrefRaw) ? hrefRaw : normalizeInternalPath(hrefRaw)

  if (config.buttonType === 'textLink') {
    const linkStyles = textLinkButtonClasses(config)
    return (
      <div className={align}>
        {wrapWithTopLine(
          config.showTopLine,
          config.lineColor,
          <TextChevronLink
            href={href}
            label={label}
            openInNewTab={openInNewTab}
            className={linkStyles.className}
            style={linkStyles.style}
          />,
        )}
      </div>
    )
  }

  const buttonStyles =
    config.buttonType === 'ghost'
      ? ghostButtonClasses(config, onDarkGrid ? gridCellGhostClass : undefined)
      : fillButtonClasses(config)

  const control =
    isExternalHref(hrefRaw) || openInNewTab ? (
      <a
        href={href}
        className={buttonStyles.className}
        style={buttonStyles.style}
        {...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {label}
      </a>
    ) : (
      <Link href={href} className={buttonStyles.className} style={buttonStyles.style}>
        {label}
      </Link>
    )

  return (
    <div className={align}>
      {wrapWithTopLine(config.showTopLine, config.lineColor, control)}
    </div>
  )
}

export default function ButtonBlock({
  block,
  embedded,
  nested,
  slotVariant,
  gridCellSurface,
}: ButtonBlockProps) {
  const inSlot = embedded ?? nested ?? false
  if (inSlot) {
    return (
      <ButtonInner
        block={block}
        nested={false}
        slotVariant={slotVariant}
        gridCellSurface={gridCellSurface}
      />
    )
  }

  return (
    <PageBlockSection block={block} blockType="buttonBlock">
      <PageBlockLayout layoutWidth={block.layoutWidth}>
        <ButtonInner
          block={block}
          slotVariant={slotVariant}
          gridCellSurface={gridCellSurface}
        />
      </PageBlockLayout>
    </PageBlockSection>
  )
}
