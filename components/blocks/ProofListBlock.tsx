import { ProofSection } from '@/components/home/ProofSection'
import type { ProofItem } from '@/components/home/proofData'
import { areaStyle, clean, colorOf, imageUrl, paintVars, sizeOf, toneStyle } from '@/components/blocks/homeBlockValue'
import { parseSectionHeadingLevel } from '@/lib/cmsSectionHeadingLevel'
import { linkMarkProps, parseTextColor, type TextColorValue } from '@/lib/cmsTextColor'
import { TEXT_COLOR_LEGACY_ALIASES, TEXT_COLOR_VALUES } from '@/sanity/lib/textColorField'
import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react'
import { stegaClean } from 'next-sanity'
import type { CSSProperties } from 'react'

const LOGO_SIZE: Record<string, string | undefined> = {
  default: undefined,
  sm: '4rem',
  md: '6rem',
  lg: '8rem',
}

const BUTTON_MODULE_SIZE: Record<string, string> = {
  'button-md': '1.125rem',
  'button-lg': '1.25rem',
  'button-xl': '1.5rem',
}

type ItemDoc = {
  _key?: string
  logo?: unknown
  logoAlt?: string
  title?: string
  titleColor?: string
  titleSize?: string
  body?: string | PortableTextBlock[]
  bodyColor?: string
  bodySize?: string
  bodyLinkColor?: string
  buttonLabel?: string
  buttonColor?: string
  buttonSize?: string
  buttonUrl?: string
  openInNewTab?: boolean
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

function buttonTone(color: unknown, size: unknown) {
  const style: CSSProperties & Record<string, string> = {}
  const paint = colorOf(color)
  const fontSize = buttonFontSize(size)
  if (paint) style['--button-color'] = paint
  if (fontSize) style['--button-size'] = fontSize
  return Object.keys(style).length > 0 ? style : undefined
}

function columnWidth(value: unknown) {
  const key = clean(value)
  if (key === 'content' || key === 'reading' || key === 'fullBleed') return key
  return undefined
}

export default function ProofListBlock({ block }: { block: Record<string, unknown> }) {
  const docs = Array.isArray(block.items) ? (block.items as ItemDoc[]) : []
  const items: ProofItem[] | undefined =
    docs.length > 0
      ? docs.flatMap((item, index): ProofItem[] => {
          const title = clean(item.title)
          if (!title) return []
          const rich = Array.isArray(item.body)
          return [
            {
              id: item._key || `proof-${index}`,
              logo: imageUrl(item.logo, 480) || '',
              logoAlt: clean(item.logoAlt),
              title,
              body: rich ? '' : clean(item.body),
              bodyContent: rich ? (
                <PortableText value={item.body as PortableTextBlock[]} components={bodyPortable(chosenLinkColor(item.bodyLinkColor))} />
              ) : undefined,
              action: clean(item.buttonLabel),
              href: clean(item.buttonUrl) || '#',
              openInNewTab: item.openInNewTab === true,
              titleStyle: toneStyle(item.titleColor, item.titleSize, '--title-color', '--title-size'),
              bodyStyle: toneStyle(item.bodyColor, item.bodySize, '--body-color', '--body-size'),
              buttonStyle: buttonTone(item.buttonColor, item.buttonSize),
            },
          ]
        })
      : undefined

  const heading = clean(block.heading)
  const lines = heading.split('\n').map((line) => line.trim()).filter(Boolean)
  const [lead, ...rest] = lines

  return (
    <ProofSection
      eyebrow={clean(block.eyebrow)}
      eyebrowStyle={toneStyle(block.eyebrowColor || block.textColor, block.eyebrowSize || block.textSize, '--eyebrow-color', '--eyebrow-size')}
      headingLead={lead}
      headingStyle={toneStyle(block.headingColor || block.textColor, block.headingSize || block.textSize, '--heading-color', '--heading-size')}
      headingLevel={parseSectionHeadingLevel(block.headingLevel, 'h2')}
      headingTail={heading ? rest.join('\n') : ''}
      items={items ?? []}
      logoSize={LOGO_SIZE[clean(block.imageSize)]}
      columnWidth={columnWidth(block.layoutWidth)}
      appearance={paintVars(areaStyle(block, 'textColor', false), {
        '--cms-text': colorOf(block.textColor),
        '--cms-copy-size': sizeOf(block.textSize),
        '--cms-button': colorOf(block.buttonColor),
        '--cms-button-size': buttonFontSize(block.buttonSize),
      })}
    />
  )
}
