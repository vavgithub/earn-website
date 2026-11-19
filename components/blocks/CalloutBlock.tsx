import type { PortableTextBlock } from '@portabletext/react'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { WorkSection } from '@/components/home/WorkSection'
import { areaStyle, clean, colorOf, paintVars, sizeOf, toneStyle } from '@/components/blocks/homeBlockValue'
import { parseSectionHeadingLevel } from '@/lib/cmsSectionHeadingLevel'
import { linkMarkProps, parseTextColor, type TextColorValue } from '@/lib/cmsTextColor'
import { TEXT_COLOR_LEGACY_ALIASES, TEXT_COLOR_VALUES } from '@/sanity/lib/textColorField'
import { stegaClean } from 'next-sanity'

const LIGHT_BUTTONS = new Set(['brightYellow', 'yellow', 'offWhite', 'lightGrey'])

const BUTTON_MODULE_SIZE: Record<string, string> = {
  'button-md': '1.125rem',
  'button-lg': '1.25rem',
  'button-xl': '1.5rem',
}

function columnWidth(value: unknown): 'content' | 'reading' | 'fullBleed' | undefined {
  const key = clean(value)
  if (key === 'content' || key === 'reading' || key === 'fullBleed') return key
  return undefined
}

function buttonInk(value: unknown) {
  const key = clean(value)
  if (!key || !colorOf(value)) return undefined
  return LIGHT_BUTTONS.has(key) ? 'var(--color-earn-button-ink)' : 'var(--color-earn-paper)'
}

function buttonSize(value: unknown) {
  const key = clean(value)
  return BUTTON_MODULE_SIZE[key] ?? sizeOf(value)
}

function chosenColor(value: unknown): TextColorValue | undefined {
  const raw = stegaClean(typeof value === 'string' ? value : '').trim()
  if (!raw) return undefined
  if (raw in TEXT_COLOR_LEGACY_ALIASES || (TEXT_COLOR_VALUES as readonly string[]).includes(raw)) {
    return parseTextColor(raw, 'offWhite')
  }
  return undefined
}

function calloutPortable(linkColor?: TextColorValue): PortableTextComponents {
  const linkStyle = linkColor ? linkMarkProps(linkColor).style : undefined
  return {
    block: {
      normal: ({ children }) => <span className="block min-h-[1lh]">{children}</span>,
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

function textOrRich(value: unknown, linkColor: unknown) {
  if (typeof value === 'string') return clean(value)
  if (Array.isArray(value)) {
    return <PortableText value={value as PortableTextBlock[]} components={calloutPortable(chosenColor(linkColor))} />
  }
  return ''
}

export default function CalloutBlock({ block }: { block: Record<string, unknown> }) {
  return (
    <WorkSection
      eyebrow={clean(block.eyebrow)}
      heading={clean(block.heading)}
      headingLevel={parseSectionHeadingLevel(block.headingLevel, 'h2')}
      intro={textOrRich(block.intro, block.introLinkColor)}
      panelTitle={clean(block.panelTitle)}
      bodyLead={textOrRich(block.panelBody, block.panelBodyLinkColor)}
      action={clean(block.buttonLabel)}
      actionHref={clean(block.buttonUrl) || '#'}
      actionOpen={block.openInNewTab === true}
      showArrows={block.showArrows !== false}
      eyebrowStyle={toneStyle(block.eyebrowColor ?? block.textColor, block.eyebrowSize ?? block.textSize, '--eyebrow-color', '--eyebrow-size')}
      headingStyle={toneStyle(block.headingColor ?? block.textColor, block.headingSize ?? block.textSize, '--heading-color', '--heading-size')}
      introStyle={toneStyle(block.introColor ?? block.textColor, block.introSize ?? block.textSize, '--intro-color', '--intro-size')}
      panelTitleStyle={toneStyle(block.panelTitleColor ?? block.textColor, block.panelTitleSize ?? block.textSize, '--panel-title-color', '--panel-title-size')}
      bodyStyle={toneStyle(block.panelBodyColor ?? block.textColor, block.panelBodySize ?? block.textSize, '--body-color', '--body-size')}
      columnWidth={columnWidth(block.layoutWidth)}
      appearance={paintVars(areaStyle(block, 'textColor', false), {
        '--cms-text': colorOf(block.textColor),
        '--cms-copy-size': sizeOf(block.textSize),
        '--cms-button': colorOf(block.buttonColor),
        '--cms-button-ink': buttonInk(block.buttonColor),
        '--cms-button-size': buttonSize(block.buttonSize),
      })}
    />
  )
}
