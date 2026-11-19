import { PrincipleSection } from '@/components/home/PrincipleSection'
import { areaStyle, clean, toneStyle } from '@/components/blocks/homeBlockValue'
import { parseSectionHeadingLevel } from '@/lib/cmsSectionHeadingLevel'
import { linkMarkProps, parseTextColor, type TextColorValue } from '@/lib/cmsTextColor'
import { TEXT_COLOR_LEGACY_ALIASES, TEXT_COLOR_VALUES } from '@/sanity/lib/textColorField'
import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react'
import { stegaClean } from 'next-sanity'

function chosenLinkColor(value: unknown): TextColorValue | undefined {
  const raw = stegaClean(typeof value === 'string' ? value : '').trim()
  if (!raw) return undefined
  if (raw in TEXT_COLOR_LEGACY_ALIASES || (TEXT_COLOR_VALUES as readonly string[]).includes(raw)) {
    return parseTextColor(raw, 'offWhite')
  }
  return undefined
}

function linePortable(linkColor?: TextColorValue): PortableTextComponents {
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

function columnWidth(value: unknown) {
  const key = clean(value)
  if (key === 'content' || key === 'reading' || key === 'fullBleed') return key
  return undefined
}

export default function StatementBlock({ block }: { block: Record<string, unknown> }) {
  const heading = clean(block.heading)
  const [lead, ...rest] = heading.split('\n').map((line) => line.trim()).filter(Boolean)
  const tail = rest.join('\n')
  const rich = Array.isArray(block.subtitle)

  return (
    <PrincipleSection
      eyebrow={clean(block.eyebrow)}
      eyebrowStyle={toneStyle(block.eyebrowColor, block.eyebrowSize, '--eyebrow-color', '--eyebrow-size')}
      headingLead={lead}
      headingTail={heading ? tail : ''}
      headingStyle={toneStyle(block.headingColor, block.headingSize, '--heading-color', '--heading-size')}
      headingLevel={parseSectionHeadingLevel(block.headingLevel, 'h2')}
      line={rich ? '' : clean(block.subtitle)}
      lineContent={
        rich ? (
          <PortableText
            value={block.subtitle as PortableTextBlock[]}
            components={linePortable(chosenLinkColor(block.subtitleLinkColor))}
          />
        ) : undefined
      }
      subtitleStyle={toneStyle(block.subtitleColor, block.subtitleSize, '--line-color', '--line-size')}
      columnWidth={columnWidth(block.layoutWidth)}
      appearance={areaStyle(block)}
    />
  )
}
