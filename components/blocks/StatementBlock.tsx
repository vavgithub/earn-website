import { PrincipleSection } from '@/components/home/PrincipleSection'
import { areaStyle, clean, textStyle } from '@/components/blocks/homeBlockValue'

export default function StatementBlock({ block }: { block: Record<string, unknown> }) {
  const heading = clean(block.heading)
  const [lead, ...rest] = heading.split('\n').map((line) => line.trim()).filter(Boolean)
  const tail = rest.join('\n')

  return (
    <PrincipleSection
      eyebrow={clean(block.eyebrow)}
      eyebrowStyle={textStyle(block.eyebrowColor, block.eyebrowSize)}
      headingLead={lead}
      headingTail={heading ? tail : ""}
      headingStyle={textStyle(block.headingColor, block.headingSize)}
      line={clean(block.subtitle)}
      subtitleStyle={textStyle(block.subtitleColor, block.subtitleSize)}
      appearance={areaStyle(block)}
    />
  )
}
