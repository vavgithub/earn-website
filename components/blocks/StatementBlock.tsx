import { PrincipleSection } from '@/components/home/PrincipleSection'
import { areaStyle, clean, toneStyle } from '@/components/blocks/homeBlockValue'
import { parseSectionHeadingLevel } from '@/lib/cmsSectionHeadingLevel'

export default function StatementBlock({ block }: { block: Record<string, unknown> }) {
  const heading = clean(block.heading)
  const [lead, ...rest] = heading.split('\n').map((line) => line.trim()).filter(Boolean)
  const tail = rest.join('\n')

  return (
    <PrincipleSection
      eyebrow={clean(block.eyebrow)}
      eyebrowStyle={toneStyle(block.eyebrowColor, block.eyebrowSize, '--eyebrow-color', '--eyebrow-size')}
      headingLead={lead}
      headingTail={heading ? tail : ""}
      headingStyle={toneStyle(block.headingColor, block.headingSize, '--heading-color', '--heading-size')}
      headingLevel={parseSectionHeadingLevel(block.headingLevel, 'h2')}
      line={clean(block.subtitle)}
      subtitleStyle={toneStyle(block.subtitleColor, block.subtitleSize, '--line-color', '--line-size')}
      appearance={areaStyle(block)}
    />
  )
}
