import { ProductsSection } from '@/components/home/ProductsSection'
import type { Product } from '@/components/home/productsData'
import { areaStyle, clean, colorOf, imageUrl, paragraphs, sizeOf, textStyle, toneStyle } from '@/components/blocks/homeBlockValue'
import type { FilterPaint } from '@/components/home/ProductsSection'
import { parseSectionHeadingLevel } from '@/lib/cmsSectionHeadingLevel'
import { linkMarkProps, parseTextColor, type TextColorValue } from '@/lib/cmsTextColor'
import { sectionBackgroundStyle } from '@/lib/sectionBackground'
import { TEXT_COLOR_LEGACY_ALIASES, TEXT_COLOR_VALUES } from '@/sanity/lib/textColorField'
import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react'
import { stegaClean } from 'next-sanity'

type FilterDoc = { _key?: string; label?: string; labelColor?: string; labelSize?: string }
type CardDoc = {
  _key?: string
  iconMode?: string
  icon?: unknown
  brand?: string
  brandColor?: string
  brandSize?: string
  title?: string
  titleColor?: string
  titleSize?: string
  body?: string | PortableTextBlock[]
  linkLabel?: string
  linkUrl?: string
  linkKind?: string
  linkColor?: string
  linkSize?: string
  openInNewTab?: boolean
  textColor?: string
  textSize?: string
  bodyLinkColor?: string
  shownUnder?: string[]
  chips?: string[]
  chipLabelColor?: string
  chipBackground?: string
  wide?: boolean
  wideOnLargestScreen?: boolean
}

function chosenLinkColor(value: unknown): TextColorValue | undefined {
  const raw = stegaClean(typeof value === 'string' ? value : '').trim()
  if (!raw) return undefined
  if (raw in TEXT_COLOR_LEGACY_ALIASES || (TEXT_COLOR_VALUES as readonly string[]).includes(raw)) {
    return parseTextColor(raw, 'offWhite')
  }
  return undefined
}

function leadPortable(linkColor?: TextColorValue): PortableTextComponents {
  const linkStyle = linkColor ? linkMarkProps(linkColor).style : undefined
  return {
    block: {
      normal: ({ children }) => <span className="block">{children}</span>,
    },
    list: {
      bullet: ({ children }) => <ul className="m-0 list-disc pl-5">{children}</ul>,
      number: ({ children }) => <ol className="m-0 list-decimal pl-5">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      link: ({ children, value }) => {
        const href = stegaClean(typeof value?.href === 'string' ? value.href : '').trim() || '#'
        return (
          <a href={href} className="underline underline-offset-2" style={linkStyle}>
            {children}
          </a>
        )
      },
    },
  }
}

function columnWidth(value: unknown) {
  const key = clean(value)
  if (key === 'content' || key === 'reading' || key === 'fullBleed') return key
  return undefined
}

function leadContent(value: unknown, linkColor: unknown) {
  if (Array.isArray(value)) {
    return <PortableText value={value as PortableTextBlock[]} components={leadPortable(chosenLinkColor(linkColor))} />
  }
  return clean(value)
}

function names(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.map((item) => clean(item)).filter(Boolean)
}

function backgroundHex(value: unknown) {
  if (!clean(value)) return undefined
  const paint = sectionBackgroundStyle(value).backgroundColor
  return typeof paint === 'string' ? paint : undefined
}

function filterPaint(block: Record<string, unknown>): FilterPaint | undefined {
  const paint: FilterPaint = {}
  const button = colorOf(block.filterButtonColor)
  const label = colorOf(block.filterLabelColor)
  if (button) paint.button = button
  if (label) paint.label = label
  return paint.button || paint.label ? paint : undefined
}

export default function FilterCardsBlock({ block }: { block: Record<string, unknown> }) {
  const docs = Array.isArray(block.cards) ? (block.cards as CardDoc[]) : []
  const filters = (Array.isArray(block.filters) ? (block.filters as FilterDoc[]) : []).flatMap((filter) => {
    const label = clean(filter.label)
    if (!label) return []
    return [{
      id: filter._key || label,
      label,
      color: colorOf(filter.labelColor),
      size: sizeOf(filter.labelSize),
    }]
  })
  const products: Product[] | undefined =
    docs.length > 0
      ? docs.flatMap((card, index): Product[] => {
          const title = clean(card.title)
          if (!title) return []
          const bodyIsRich = Array.isArray(card.body)
          const product: Product = {
            id: card._key || `card-${index}`,
            logo: 'earn',
            brand: clean(card.brand),
            title,
            body: bodyIsRich ? [] : paragraphs(clean(card.body)),
          }
          if (Array.isArray(card.body)) product.bodyRich = card.body
          const bodyLinkColor = clean(card.bodyLinkColor)
          if (bodyLinkColor) product.bodyLinkColor = bodyLinkColor
          const iconMode = clean(card.iconMode)
          const icon = iconMode === 'none' ? undefined : imageUrl(card.icon, iconMode === 'image' ? 1000 : 240)
          if (icon) product.iconUrl = icon
          if (iconMode === 'image') product.iconMode = 'image'
          const label = clean(card.linkLabel)
          const href = clean(card.linkUrl)
          const linkKind = clean(card.linkKind)
          if (label) product.linkLabel = label
          if (href) product.href = href
          if (linkKind === 'textLink' || linkKind === 'button') product.linkKind = linkKind
          if (card.openInNewTab) product.openInNewTab = true
          const shownUnder = names(card.shownUnder)
          if (shownUnder.length) product.filters = shownUnder
          const chips = names(card.chips)
          if (chips.length) product.chips = chips
          const textColor = colorOf(card.textColor) || colorOf(block.cardTextColor)
          const textSize = sizeOf(card.textSize) || sizeOf(block.cardTextSize)
          const linkColor = colorOf(card.linkColor)
          const chipBackground = backgroundHex(card.chipBackground)
          const chipLabelColor = colorOf(card.chipLabelColor)
          if (textColor) product.textColor = textColor
          if (textSize) product.textSize = textSize
          const brandColor = colorOf(card.brandColor)
          const brandSize = sizeOf(card.brandSize)
          const titleColor = colorOf(card.titleColor)
          const titleSize = sizeOf(card.titleSize)
          const linkSize = sizeOf(card.linkSize)
          if (brandColor) product.brandColor = brandColor
          if (brandSize) product.brandSize = brandSize
          if (titleColor) product.titleColor = titleColor
          if (titleSize) product.titleSize = titleSize
          if (linkColor) product.linkColor = linkColor
          if (linkSize) product.linkSize = linkSize
          if (chipBackground) product.chipBackground = chipBackground
          if (chipLabelColor) product.chipLabelColor = chipLabelColor
          if (card.wide === true) product.feature = true
          if (card.wideOnLargestScreen === true) product.span = true
          return [product]
        })
      : undefined
  const paint = filterPaint(block)

  return (
    <ProductsSection
      eyebrow={clean(block.eyebrow)}
      heading={clean(block.heading)}
      headingLevel={parseSectionHeadingLevel(block.headingLevel, 'h2')}
      lead={leadContent(block.lead, block.leadLinkColor)}
      eyebrowStyle={toneStyle(block.eyebrowColor, block.eyebrowSize, '--eyebrow-color', '--eyebrow-size')}
      headingStyle={toneStyle(block.headingColor, block.headingSize, '--heading-color', '--heading-size')}
      leadStyle={toneStyle(block.leadColor, block.leadSize, '--lead-color', '--lead-size')}
      menuStyle={textStyle(block.filterMenuColor, block.filterMenuSize)}
      showFilters={block.showFilters !== false}
      products={products}
      filters={filters}
      filterMenuLabel={clean(block.filterMenuLabel) || 'All'}
      {...(paint ? { filterPaint: paint } : {})}
      appearance={areaStyle(block, 'textColor', false)}
      columnWidth={columnWidth(block.layoutWidth)}
    />
  )
}
