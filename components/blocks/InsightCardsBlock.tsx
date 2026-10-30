import { ReadingSection } from '@/components/home/ReadingSection'
import type { ReadingCard } from '@/components/home/readingData'
import { areaStyle, clean, colorOf, imageUrl, paintVars, sizeOf } from '@/components/blocks/homeBlockValue'

const SHAPE: Record<string, string | undefined> = {
  default: undefined,
  '9/16': '9 / 16',
  '1/1': '1 / 1',
  '3/4': '3 / 4',
}

type CardDoc = {
  _key?: string
  image?: unknown
  imageAlt?: string
  kicker?: string
  title?: string
  body?: string
  linkLabel?: string
  compactLinkLabel?: string
  linkUrl?: string
  openInNewTab?: boolean
  roundImage?: boolean
}

export default function InsightCardsBlock({ block }: { block: Record<string, unknown> }) {
  const docs = Array.isArray(block.cards) ? (block.cards as CardDoc[]) : []
  const cards: ReadingCard[] | undefined =
    docs.length > 0
      ? docs.flatMap((card, index): ReadingCard[] => {
          const title = clean(card.title)
          if (!title) return []
          const [lead, ...rest] = title.split('\n').map((line) => line.trim()).filter(Boolean)
          const item: ReadingCard = {
            id: card._key || `insight-${index}`,
              image: imageUrl(card.image, 1000) || '',
              imageAlt: clean(card.imageAlt),
              kicker: clean(card.kicker),
              titleLead: lead,
              body: clean(card.body),
              action: clean(card.linkLabel),
              href: clean(card.linkUrl) || '#',
              openInNewTab: card.openInNewTab === true,
          }
          const tail = rest.join('\n')
          if (tail) item.titleTail = tail
          const compact = clean(card.compactLinkLabel)
          if (compact) item.actionCompact = compact
          if (card.roundImage === true) item.rounded = true
          return [item]
        })
      : undefined

  return (
    <ReadingSection
      eyebrow={clean(block.eyebrow)}
      heading={clean(block.heading)}
      cards={cards ?? []}
      more={clean(block.conclusionLabel)}
      moreHref={clean(block.conclusionUrl) || '#'}
      moreOpen={block.conclusionNewTab === true}
      showMore={block.showConclusion !== false}
      imageProportion={SHAPE[clean(block.imageProportion)]}
      linkKind={clean(block.linkKind) === "textLink" ? "textLink" : undefined}
      appearance={paintVars(areaStyle(block, 'textColor', false), {
        '--cms-text': colorOf(block.textColor),
        '--cms-copy-size': sizeOf(block.textSize),
        '--cms-link': colorOf(block.linkColor),
        '--cms-link-size': sizeOf(block.linkSize),
      })}
    />
  )
}
