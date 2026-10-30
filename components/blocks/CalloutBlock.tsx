import { WorkSection } from '@/components/home/WorkSection'
import { areaStyle, clean, colorOf, paintVars, sizeOf } from '@/components/blocks/homeBlockValue'

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
      intro={clean(block.intro)}
      panelTitle={clean(block.panelTitle)}
      bodyLead={body}
      action={clean(block.buttonLabel)}
      actionHref={clean(block.buttonUrl) || '#'}
      actionOpen={block.openInNewTab === true}
      showArrows={block.showArrows !== false}
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
