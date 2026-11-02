import { ReadingSection } from '@/components/home/ReadingSection'
import type { ReadingCard } from '@/components/home/readingData'
import { areaStyle, clean, colorOf, imageUrl, paintVars, sizeOf, toneStyle } from '@/components/blocks/homeBlockValue'
import { parseSectionHeadingLevel } from '@/lib/cmsSectionHeadingLevel'

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
  kickerColor?: string
  kickerSize?: string
  title?: string
  titleColor?: string
  titleSize?: string
  body?: string
  bodyColor?: string
  bodySize?: string
  linkLabel?: string
  linkColor?: string
  linkSize?: string
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
          item.kickerStyle = toneStyle(card.kickerColor, card.kickerSize, '--kicker-color', '--kicker-size')
          item.titleStyle = toneStyle(card.titleColor, card.titleSize, '--title-color', '--title-size')
          item.bodyStyle = toneStyle(card.bodyColor, card.bodySize, '--body-color', '--body-size')
          item.linkStyle = toneStyle(card.linkColor, card.linkSize, '--link-color', '--link-size')
          return [item]
        })
      : undefined

  return (
    <ReadingSection
      eyebrow={clean(block.eyebrow)}
      heading={clean(block.heading)}
      headingLevel={parseSectionHeadingLevel(block.headingLevel, 'h2')}
      eyebrowStyle={toneStyle(block.eyebrowColor, block.eyebrowSize, '--eyebrow-color', '--eyebrow-size')}
      headingStyle={toneStyle(block.textColor, block.textSize, '--heading-color', '--heading-size')}
      cards={cards ?? []}
      more={clean(block.conclusionLabel)}
      moreHref={clean(block.conclusionUrl) || '#'}
      moreOpen={block.conclusionNewTab === true}
      showMore={block.showConclusion !== false}
      imageProportion={SHAPE[clean(block.imageProportion)]}
      linkKind={clean(block.linkKind) === "textLink" ? "textLink" : undefined}
      moreStyle={toneStyle(block.conclusionColor || block.linkColor, block.conclusionSize || block.linkSize, '--more-color', '--more-size')}
      appearance={paintVars(areaStyle(block, 'textColor', false), {
        '--cms-text': colorOf(block.textColor),
        '--cms-copy-size': sizeOf(block.textSize),
        '--cms-link': colorOf(block.linkColor),
        '--cms-link-size': sizeOf(block.linkSize),
      })}
    />
  )
}
