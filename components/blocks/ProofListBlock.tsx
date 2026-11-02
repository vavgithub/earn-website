import { ProofSection } from '@/components/home/ProofSection'
import type { ProofItem } from '@/components/home/proofData'
import { areaStyle, clean, colorOf, imageUrl, paintVars, sizeOf, toneStyle } from '@/components/blocks/homeBlockValue'
import { parseSectionHeadingLevel } from '@/lib/cmsSectionHeadingLevel'

const LOGO_SIZE: Record<string, string | undefined> = {
  default: undefined,
  sm: '4rem',
  md: '6rem',
  lg: '8rem',
}

type ItemDoc = {
  _key?: string
  logo?: unknown
  logoAlt?: string
  title?: string
  titleColor?: string
  titleSize?: string
  body?: string
  bodyColor?: string
  bodySize?: string
  buttonLabel?: string
  buttonColor?: string
  buttonSize?: string
  buttonUrl?: string
  openInNewTab?: boolean
}

export default function ProofListBlock({ block }: { block: Record<string, unknown> }) {
  const docs = Array.isArray(block.items) ? (block.items as ItemDoc[]) : []
  const items: ProofItem[] | undefined =
    docs.length > 0
      ? docs.flatMap((item, index): ProofItem[] => {
          const title = clean(item.title)
          if (!title) return []
          return [
            {
              id: item._key || `proof-${index}`,
              logo: imageUrl(item.logo, 480) || '',
              logoAlt: clean(item.logoAlt),
              title,
              body: clean(item.body),
              action: clean(item.buttonLabel),
              href: clean(item.buttonUrl) || '#',
              openInNewTab: item.openInNewTab === true,
              titleStyle: toneStyle(item.titleColor, item.titleSize, '--title-color', '--title-size'),
              bodyStyle: toneStyle(item.bodyColor, item.bodySize, '--body-color', '--body-size'),
              buttonStyle: toneStyle(item.buttonColor, item.buttonSize, '--button-color', '--button-size'),
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
      logoSize={LOGO_SIZE[clean(block.imageSize)] }
      appearance={paintVars(areaStyle(block, 'textColor', false), {
        '--cms-text': colorOf(block.textColor),
        '--cms-copy-size': sizeOf(block.textSize),
        '--cms-button': colorOf(block.buttonColor),
        '--cms-button-size': sizeOf(block.buttonSize),
      })}
    />
  )
}
