import { ProductsSection } from '@/components/home/ProductsSection'
import type { Product } from '@/components/home/productsData'
import { areaStyle, clean, colorOf, imageUrl, paintVars, paragraphs, sizeOf } from '@/components/blocks/homeBlockValue'
import type { FilterPaint } from '@/components/home/ProductsSection'
import { sectionBackgroundStyle } from '@/lib/sectionBackground'

type FilterDoc = { _key?: string; label?: string }
type CardDoc = {
  _key?: string
  iconMode?: string
  icon?: unknown
  brand?: string
  title?: string
  body?: string
  linkLabel?: string
  linkUrl?: string
  linkKind?: string
  linkColor?: string
  openInNewTab?: boolean
  textColor?: string
  textSize?: string
  shownUnder?: string[]
  chips?: string[]
  chipLabelColor?: string
  chipBackground?: string
  wide?: boolean
  wideOnLargestScreen?: boolean
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
    return [{ id: filter._key || label, label }]
  })
  const products: Product[] | undefined =
    docs.length > 0
      ? docs.flatMap((card, index): Product[] => {
          const title = clean(card.title)
          if (!title) return []
          const product: Product = {
            id: card._key || `card-${index}`,
            logo: 'earn',
            brand: clean(card.brand),
            title,
            body: paragraphs(clean(card.body)),
          }
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
          const textColor = colorOf(card.textColor)
          const textSize = sizeOf(card.textSize)
          const linkColor = colorOf(card.linkColor)
          const chipBackground = backgroundHex(card.chipBackground)
          const chipLabelColor = colorOf(card.chipLabelColor)
          if (textColor) product.textColor = textColor
          if (textSize) product.textSize = textSize
          if (linkColor) product.linkColor = linkColor
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
      lead={clean(block.lead)}
      showFilters={block.showFilters !== false}
      products={products}
      filters={filters}
      filterMenuLabel={clean(block.filterMenuLabel) || 'All'}
      {...(paint ? { filterPaint: paint } : {})}
      appearance={paintVars(areaStyle(block), {
        '--card-text': colorOf(block.cardTextColor),
        '--card-text-size': sizeOf(block.cardTextSize),
      })}
    />
  )
}
