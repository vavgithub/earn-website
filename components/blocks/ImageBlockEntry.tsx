import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { stegaClean } from 'next-sanity'
import { urlForImage } from '@/sanity/lib/image'
import PageBlockLayout from '@/components/blocks/PageBlockLayout'
import PageBlockSection from '@/components/blocks/PageBlockSection'
import type { LayoutSlotVariant } from '@/components/blocks/layoutSlotVariant'

const objectFitClass: Record<string, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
}

const aspectRatioClass: Record<string, string> = {
  '16:9': 'aspect-video',
  '2:1': 'aspect-[2/1]',
  '3:1': 'aspect-[3/1]',
  '1:1': 'aspect-square',
}

/** Which part of the image stays in view when cropped (object-position). */
const objectPositionClass: Record<string, string> = {
  'left-top': 'object-left-top',
  top: 'object-top',
  'right-top': 'object-right-top',
  left: 'object-left',
  center: 'object-center',
  right: 'object-right',
  'left-bottom': 'object-left-bottom',
  bottom: 'object-bottom',
  'right-bottom': 'object-right-bottom',
}

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

function normalizeObjectFit(raw: unknown): 'cover' | 'contain' | 'natural' {
  if (raw === 'contain' || raw === 'natural') return raw
  return 'cover'
}

function normalizeAspectRatio(
  raw: unknown,
  slotVariant: LayoutSlotVariant,
): '16:9' | '2:1' | '3:1' | '1:1' {
  const v = clean(raw)
  if (v === '2:1' || v === '3:1' || v === '1:1' || v === '16:9') return v
  return slotVariant === 'hero' ? '1:1' : '16:9'
}

function normalizeObjectPosition(raw: unknown): string {
  const v = clean(raw)
  return objectPositionClass[v] ? v : 'center'
}

function parsePixelHeight(raw: unknown): number | undefined {
  if (typeof raw !== 'number' || !Number.isFinite(raw) || raw <= 0) return undefined
  return Math.round(raw)
}

function frameStyle(minHeight?: number, maxHeight?: number): CSSProperties | undefined {
  if (!minHeight && !maxHeight) return undefined
  return {
    ...(minHeight ? { minHeight: `${minHeight}px` } : {}),
    ...(maxHeight ? { maxHeight: `${maxHeight}px` } : {}),
  }
}

function ImageLink({
  href,
  openInNewTab,
  className,
  children,
}: {
  href: string
  openInNewTab: boolean
  className?: string
  children: ReactNode
}) {
  const normalized = normalizeInternalPath(href)
  if (isExternalHref(normalized) || openInNewTab) {
    return (
      <a
        href={normalized}
        className={className}
        {...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }
  return (
    <Link href={normalized} className={className}>
      {children}
    </Link>
  )
}

export default function ImageBlockEntry({
  block,
  embedded = false,
  slotVariant = 'default',
}: {
  block: any
  embedded?: boolean
  slotVariant?: LayoutSlotVariant
}) {
  const isGridCell = slotVariant === 'gridCell'
  const isHero = slotVariant === 'hero'
  const embeddedRadius = embedded ? (isGridCell ? 'rounded-2xl' : 'rounded-xl') : ''
  const embeddedSizes = isHero
    ? '(max-width: 480px) 100vw, 480px'
    : '(max-width: 768px) 100vw, 50vw'

  if (!block?.image) return null

  const url = urlForImage(block.image)?.url()
  if (!url) return null

  const alt = typeof block.alt === 'string' ? block.alt.trim() : ''
  if (!alt) return null

  const objectFit = normalizeObjectFit(block.objectFit)
  const fitClass = objectFitClass[objectFit] ?? objectFitClass.cover
  const useFramedFit = objectFit === 'cover' || objectFit === 'contain'
  const aspectRatio = normalizeAspectRatio(block.aspectRatio, slotVariant)
  const aspectClass = aspectRatioClass[aspectRatio] ?? aspectRatioClass['16:9']
  const objectPosition = normalizeObjectPosition(block.objectPosition)
  const positionClass = objectPositionClass[objectPosition] ?? objectPositionClass.center
  const minHeight = parsePixelHeight(block.minHeight)
  const maxHeight = parsePixelHeight(block.maxHeight)
  const frameInlineStyle = frameStyle(minHeight, maxHeight)
  const href = clean(block.href)
  const openInNewTab = Boolean(block.openInNewTab)

  const dims = block.image?.asset?.metadata?.dimensions as
    | { width?: number; height?: number }
    | undefined
  const naturalW = typeof dims?.width === 'number' && dims.width > 0 ? dims.width : 1600
  const naturalH = typeof dims?.height === 'number' && dims.height > 0 ? dims.height : 1067

  const heroWidthClass = isHero && embedded ? 'w-full max-w-[480px]' : 'w-full'
  const linkClassName = href ? 'block w-full' : undefined

  const imageNode = useFramedFit ? (
    <div
      className={`relative overflow-hidden ${aspectClass} ${embeddedRadius} ${heroWidthClass}`}
      style={frameInlineStyle}
    >
      <Image
        src={url}
        alt={alt}
        fill
        sizes={embedded ? embeddedSizes : '(max-width: 1080px) 100vw, 1080px'}
        className={`h-full w-full ${fitClass} ${positionClass}`}
      />
    </div>
  ) : (
    <div className={`relative ${heroWidthClass}`} style={frameInlineStyle}>
      <Image
        src={url}
        alt={alt}
        width={naturalW}
        height={naturalH}
        sizes={embedded ? embeddedSizes : '(max-width: 1080px) 100vw, 1080px'}
        className={`h-auto w-full max-w-full ${embeddedRadius}`}
      />
    </div>
  )

  const figure = (
    <figure className={heroWidthClass}>
      {href ? (
        <ImageLink href={href} openInNewTab={openInNewTab} className={linkClassName}>
          {imageNode}
        </ImageLink>
      ) : (
        imageNode
      )}
    </figure>
  )

  if (embedded) {
    return figure
  }

  return (
    <PageBlockSection block={block} blockType="imageBlock">
      <PageBlockLayout layoutWidth={block.layoutWidth}>{figure}</PageBlockLayout>
    </PageBlockSection>
  )
}
