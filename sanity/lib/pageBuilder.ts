/** Block types available in `pageBuilder` on blog posts and CMS pages. */
export const PAGE_BUILDER_INNER_TYPES = [
  'heroBlog',
  'multiColumnBlock',
  'gridBlock',
  'ctaBlock',
  'buttonBlock',
  'richTextSection',
  'accordionBlock',
  'tableBlock',
  'codeEmbedBlock',
  'imageBlock',
  'howItWorksStepsBlock',
  'hubspotFormBlock',
  'contentPanelBlock',
  'bannerBlock',
  'ecosystemBlock',
  'filterCardsBlock',
  'statementBlock',
  'architectureBlock',
  'proofListBlock',
  'calloutBlock',
  'insightCardsBlock',
] as const

export type PageBuilderInnerType = (typeof PAGE_BUILDER_INNER_TYPES)[number]

export const pageBuilderInnerTypeRefs = PAGE_BUILDER_INNER_TYPES.map((type) => ({ type }))
