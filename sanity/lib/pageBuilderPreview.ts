import { PAGE_BUILDER_INNER_TYPES, type PageBuilderInnerType } from './pageBuilder'

const BLOCK_LABELS: Record<PageBuilderInnerType, string> = {
  heroBlog: 'Hero (blog)',
  multiColumnBlock: 'Two columns',
  gridBlock: 'Grid',
  ctaBlock: 'Call to action',
  buttonBlock: 'Button',
  richTextSection: 'Text & headings',
  accordionBlock: 'Accordion',
  tableBlock: 'Table',
  codeEmbedBlock: 'HTML embed',
  imageBlock: 'Image',
  howItWorksStepsBlock: 'How it works steps',
  hubspotFormBlock: 'HubSpot form',
  contentPanelBlock: 'Content panel',
  bannerBlock: 'Banner',
  ecosystemBlock: 'Ecosystem',
  filterCardsBlock: 'Filter cards',
  statementBlock: 'Statement',
  architectureBlock: 'Architecture',
  proofListBlock: 'Proof list',
  calloutBlock: 'Callout',
  insightCardsBlock: 'Insight cards',
}

export function pageBuilderBlockLabel(blockType: string): string {
  if ((PAGE_BUILDER_INNER_TYPES as readonly string[]).includes(blockType)) {
    return BLOCK_LABELS[blockType as PageBuilderInnerType]
  }
  return blockType
}

/**
 * Page builder list preview: keep content as title, always prefix subtitle with block type.
 */
export function pageBuilderBlockPreview(
  blockType: string,
  contentTitle?: string | null,
  detail?: string | null,
) {
  const label = pageBuilderBlockLabel(blockType)
  const title = contentTitle?.trim() || label
  const parts = [label]
  const detailTrim = detail?.trim()
  if (detailTrim && detailTrim !== title && detailTrim !== label) {
    parts.push(detailTrim)
  }
  return {
    title,
    subtitle: parts.join(' · '),
  }
}
