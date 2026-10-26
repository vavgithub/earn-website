import { stegaClean } from 'next-sanity'
import { HubSpotFormBlock } from '@/components/marketing-blocks/HubSpotFormBlock'
import PageBlockLayout from '@/components/blocks/PageBlockLayout'
import PageBlockSection from '@/components/blocks/PageBlockSection'
import { blockContentAlignmentClass, parseBlockContentAlignment } from '@/lib/blockContentAlignment'
import { parseTextColor } from '@/lib/cmsTextColor'
import { parseTextSize } from '@/lib/cmsTextSize'

function clean(s: unknown) {
  return stegaClean(typeof s === 'string' ? s : String(s ?? '')).trim()
}

export default function HubSpotFormBlockEntry({ block }: { block: Record<string, unknown> }) {
  const portalId = clean(block.portalId)
  const formId = clean(block.formId)
  const region = clean(block.region) || 'na1'
  const eyebrow = clean(block.eyebrow) || undefined
  const heading = clean(block.heading) || undefined
  const description = clean(block.description) || undefined

  if (!portalId && !formId && !eyebrow && !heading && !description) {
    return null
  }

  const alignClass = blockContentAlignmentClass(block?.alignment)

  return (
    <PageBlockSection
      block={block}
      blockType="hubspotFormBlock"
      defaultBackground="yellow"
    >
      <PageBlockLayout
        layoutWidth={block.layoutWidth ?? 'content'}
        className={alignClass}
      >
        <HubSpotFormBlock
          eyebrow={eyebrow}
          eyebrowColor={parseTextColor(block.eyebrowColor, 'yellow')}
          heading={heading}
          headingColor={parseTextColor(block.headingColor, 'offWhite')}
          description={description}
          descriptionColor={parseTextColor(block.descriptionColor, 'offWhite')}
          descriptionTextSize={parseTextSize(block.descriptionTextSize, 'md')}
          portalId={portalId}
          formId={formId}
          region={region}
          alignment={parseBlockContentAlignment(block?.alignment)}
        />
      </PageBlockLayout>
    </PageBlockSection>
  )
}
