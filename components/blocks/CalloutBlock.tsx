import { WorkSection } from '@/components/home/WorkSection'
import { areaStyle, clean, colorOf, paintVars, sizeOf, toneStyle } from '@/components/blocks/homeBlockValue'
import { parseSectionHeadingLevel } from '@/lib/cmsSectionHeadingLevel'

const LIGHT_BUTTONS = new Set(['brightYellow', 'yellow', 'offWhite', 'lightGrey'])

function buttonInk(value: unknown) {
  const key = clean(value)
  if (!key || !colorOf(value)) return undefined
  return LIGHT_BUTTONS.has(key) ? 'var(--color-earn-button-ink)' : 'var(--color-earn-paper)'
}

export default function CalloutBlock({ block }: { block: Record<string, unknown> }) {
  const body = clean(block.panelBody)

  return (
    <WorkSection
      eyebrow={clean(block.eyebrow)}
      heading={clean(block.heading)}
      headingLevel={parseSectionHeadingLevel(block.headingLevel, 'h2')}
      intro={clean(block.intro)}
      panelTitle={clean(block.panelTitle)}
      bodyLead={body}
      action={clean(block.buttonLabel)}
      actionHref={clean(block.buttonUrl) || '#'}
      actionOpen={block.openInNewTab === true}
      showArrows={block.showArrows !== false}
      eyebrowStyle={toneStyle(block.eyebrowColor ?? block.textColor, block.eyebrowSize ?? block.textSize, '--eyebrow-color', '--eyebrow-size')}
      headingStyle={toneStyle(block.headingColor ?? block.textColor, block.headingSize ?? block.textSize, '--heading-color', '--heading-size')}
      introStyle={toneStyle(block.introColor ?? block.textColor, block.introSize ?? block.textSize, '--intro-color', '--intro-size')}
      panelTitleStyle={toneStyle(block.panelTitleColor ?? block.textColor, block.panelTitleSize ?? block.textSize, '--panel-title-color', '--panel-title-size')}
      bodyStyle={toneStyle(block.panelBodyColor ?? block.textColor, block.panelBodySize ?? block.textSize, '--body-color', '--body-size')}
      appearance={paintVars(areaStyle(block, 'textColor', false), {
        '--cms-text': colorOf(block.textColor),
        '--cms-copy-size': sizeOf(block.textSize),
        '--cms-button': colorOf(block.buttonColor),
        '--cms-button-ink': buttonInk(block.buttonColor),
        '--cms-button-size': sizeOf(block.buttonSize),
      })}
    />
  )
}
