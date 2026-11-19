import { ReadingSection } from '@/components/home/ReadingSection'
import type { ReadingCard } from '@/components/home/readingData'
import { areaStyle, clean, colorOf, imageUrl, paintVars, sizeOf, toneStyle } from '@/components/blocks/homeBlockValue'
import { parseSectionHeadingLevel } from '@/lib/cmsSectionHeadingLevel'
import { linkMarkProps, parseTextColor, type TextColorValue } from '@/lib/cmsTextColor'
import { TEXT_COLOR_LEGACY_ALIASES, TEXT_COLOR_VALUES } from '@/sanity/lib/textColorField'
import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react'
import { stegaClean } from 'next-sanity'
import type { CSSProperties } from 'react'

const SHAPE: Record<string, string | undefined> = {
  default: undefined,
  '9/16': '9 / 16',
  '1/1': '1 / 1',
  '3/4': '3 / 4',
}

const BUTTON_MODULE_SIZE: Record<string, string> = {
  'button-md': '1.125rem',
  'button-lg': '1.25rem',
  'button-xl': '1.5rem',
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
  body?: string | PortableTextBlock[]
  bodyColor?: string
  bodySize?: string
  bodyLinkColor?: string
  linkLabel?: string
  linkColor?: string
  linkSize?: string
  compactLinkLabel?: string
  linkUrl?: string
  openInNewTab?: boolean
  roundImage?: boolean
}

function chosenLinkColor(value: unknown): TextColorValue | undefined {
  const raw = stegaClean(typeof value === 'string' ? value : '').trim()
  if (!raw) return undefined
  if (raw in TEXT_COLOR_LEGACY_ALIASES || (TEXT_COLOR_VALUES as readonly string[]).includes(raw)) {
    return parseTextColor(raw, 'offWhite')
  }
  return undefined
}

function bodyPortable(linkColor?: TextColorValue): PortableTextComponents {
  const linkStyle = linkColor ? linkMarkProps(linkColor).style : undefined
  return {
    block: {
      normal: ({ children }) => <p>{children}</p>,
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

function buttonFontSize(value: unknown) {
  const key = clean(value)
  return BUTTON_MODULE_SIZE[key] ?? sizeOf(value)
}

function toneWithButtonSize(color: unknown, size: unknown, colorVar: string, sizeVar: string) {
  const style: CSSProperties = { ...(toneStyle(color, undefined, colorVar, sizeVar) ?? {}) }
  const fontSize = buttonFontSize(size)
  if (fontSize) (style as Record<string, string>)[sizeVar] = fontSize
  return Object.keys(style).length > 0 ? style : undefined
}

function columnWidth(value: unknown) {
  const key = clean(value)
  if (key === 'content' || key === 'reading' || key === 'fullBleed') return key
  return undefined
}

function linkKind(value: unknown) {
  const key = clean(value)
  if (key === 'textLink' || key === 'ghost') return key
  return undefined
}

export default function InsightCardsBlock({ block }: { block: Record<string, unknown> }) {
  const docs = Array.isArray(block.cards) ? (block.cards as CardDoc[]) : []
  const cards: ReadingCard[] | undefined =
    docs.length > 0
      ? docs.flatMap((card, index): ReadingCard[] => {
          const title = clean(card.title)
          if (!title) return []
          const [lead, ...rest] = title.split('\n').map((line) => line.trim()).filter(Boolean)
          const rich = Array.isArray(card.body)
          const item: ReadingCard = {
            id: card._key || `insight-${index}`,
            image: imageUrl(card.image, 1000) || '',
            imageAlt: clean(card.imageAlt),
            kicker: clean(card.kicker),
            titleLead: lead,
            body: rich ? '' : clean(card.body),
            bodyContent: rich ? (
              <PortableText value={card.body as PortableTextBlock[]} components={bodyPortable(chosenLinkColor(card.bodyLinkColor))} />
            ) : undefined,
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
          item.linkStyle = toneWithButtonSize(card.linkColor, card.linkSize, '--link-color', '--link-size')
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
      linkKind={linkKind(block.linkKind)}
      columnWidth={columnWidth(block.layoutWidth)}
      moreStyle={toneWithButtonSize(block.conclusionColor || block.linkColor, block.conclusionSize || block.linkSize, '--more-color', '--more-size')}
      appearance={paintVars(areaStyle(block, 'textColor', false), {
        '--cms-text': colorOf(block.textColor),
        '--cms-copy-size': sizeOf(block.textSize),
        '--cms-link': colorOf(block.linkColor),
        '--cms-link-size': buttonFontSize(block.linkSize),
      })}
    />
  )
}
