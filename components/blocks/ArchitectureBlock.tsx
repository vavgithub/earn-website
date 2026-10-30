import { ArchitectureSection } from '@/components/home/ArchitectureSection'
import type { ArchitectureStep } from '@/components/home/architectureData'
import { areaStyle, clean, paragraphs } from '@/components/blocks/homeBlockValue'

type StepDoc = { stepId?: string; index?: string; title?: string; kicker?: string; body?: string }
const STEP_IDS = ['record', 'network', 'trust', 'machine'] as const

export default function ArchitectureBlock({ block }: { block: Record<string, unknown> }) {
  const docs = Array.isArray(block.steps) ? (block.steps as StepDoc[]) : []
  const steps = docs.flatMap((doc): ArchitectureStep[] => {
    const id = clean(doc.stepId)
    if (!STEP_IDS.includes(id as (typeof STEP_IDS)[number])) return []
    const body = paragraphs(clean(doc.body))
    return [
      {
        id: id as ArchitectureStep['id'],
        index: clean(doc.index),
        title: clean(doc.title),
        kicker: clean(doc.kicker),
        body: [body[0] || '', body[1] || ''],
      },
    ]
  })

  return (
    <ArchitectureSection
      eyebrow={clean(block.eyebrow)}
      heading={clean(block.heading)}
      lead={clean(block.lead)}
      steps={steps}
      appearance={areaStyle(block)}
    />
  )
}
