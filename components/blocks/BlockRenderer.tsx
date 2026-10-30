import type { ComponentType } from 'react'
import type { Path } from '@sanity/client/csm'
import { createDataAttribute } from 'next-sanity'
import { presentationStudioBaseUrl } from '@/sanity/lib/client'
import HeroBlog from './HeroBlog'
import MultiColumnBlock from './MultiColumnBlock'
import GridBlock from './GridBlock'
import CtaBlock from './CtaBlock'
import ButtonBlock from './ButtonBlock'
import RichTextSection from './RichTextSection'
import AccordionBlockEntry from './AccordionBlockEntry'
import TableBlockEntry from './TableBlockEntry'
import CodeEmbedBlockEntry from './CodeEmbedBlockEntry'
import ImageBlockEntry from './ImageBlockEntry'
import HowItWorksStepsBlockEntry from './HowItWorksStepsBlockEntry'
import HubSpotFormBlockEntry from './HubSpotFormBlockEntry'
import ContentPanelBlockEntry from './ContentPanelBlockEntry'
import BannerBlock from './BannerBlock'
import EcosystemBlock from './EcosystemBlock'
import FilterCardsBlock from './FilterCardsBlock'
import StatementBlock from './StatementBlock'
import ArchitectureBlock from './ArchitectureBlock'
import ProofListBlock from './ProofListBlock'
import CalloutBlock from './CalloutBlock'
import InsightCardsBlock from './InsightCardsBlock'

function blockPresentationProps(
  documentId: string | undefined,
  documentType: string | undefined,
  path: Path,
  studioBaseUrl: string,
): Record<string, string> {
  if (!documentId || !documentType) return {}
  const attr = createDataAttribute({
    id: documentId,
    type: documentType,
    baseUrl: studioBaseUrl,
    path,
  })
  return {
    'data-sanity': attr.toString(),
  }
}

const blockComponents: Record<string, ComponentType<{ block: any }>> = {
  heroBlog: HeroBlog,
  multiColumnBlock: MultiColumnBlock,
  gridBlock: GridBlock,
  ctaBlock: CtaBlock,
  buttonBlock: ButtonBlock,
  richTextSection: RichTextSection,
  accordionBlock: AccordionBlockEntry,
  tableBlock: TableBlockEntry,
  codeEmbedBlock: CodeEmbedBlockEntry,
  imageBlock: ImageBlockEntry,
  howItWorksStepsBlock: HowItWorksStepsBlockEntry,
  hubspotFormBlock: HubSpotFormBlockEntry,
  contentPanelBlock: ContentPanelBlockEntry,
  bannerBlock: BannerBlock,
  ecosystemBlock: EcosystemBlock,
  filterCardsBlock: FilterCardsBlock,
  statementBlock: StatementBlock,
  architectureBlock: ArchitectureBlock,
  proofListBlock: ProofListBlock,
  calloutBlock: CalloutBlock,
  insightCardsBlock: InsightCardsBlock,
}

export default function BlockRenderer({
  blocks,
  documentId,
  documentType,
  studioBaseUrl,
}: {
  blocks: any[]
  documentId?: string
  documentType?: string
  /** Request-scoped studio URL in draft mode (from `getSanityForRequest`). */
  studioBaseUrl?: string
}) {
  if (!blocks || blocks.length === 0) return null
  const base = studioBaseUrl ?? presentationStudioBaseUrl

  return (
    <>
      {blocks.map((block) => {
        const blockPath: Path = ['pageBuilder', { _key: block._key }]
        const presentationProps = blockPresentationProps(
          documentId,
          documentType,
          blockPath,
          base,
        )

        const Component = blockComponents[block._type]
        if (!Component) {
          return (
            <div
              key={block._key}
              className="p-4 border border-red-500 bg-transparent text-red-700 my-4 text-center"
              {...presentationProps}
            >
              Unknown block type: {block._type}
            </div>
          )
        }

        return (
          <div key={block._key} {...presentationProps}>
            <Component block={block} />
          </div>
        )
      })}
    </>
  )
}
