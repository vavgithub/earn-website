import type { PortableTextBlock } from '@portabletext/types'

export type SanityImageRef = {
  asset?: { _ref?: string; _type?: string }
  alt?: string
}

export type ResourceTabRecord = {
  _id: string
  title: string
  tabHashValue: string
  tabKey: string
  gridLayout?: 'twoColumn' | 'twoColumnWithDivider' | 'singleWide' | null
  orderRank?: string
}

export type ResourceModalLayoutValue =
  | 'governance'
  | 'guides'
  | 'methodology'
  | 'caseStudy'
  | 'documentPreview'
  | string

export type ResourceItemRecord = {
  _id: string
  modalIdValue: string
  cardTitle: string
  cardExcerpt: string
  cardImage?: SanityImageRef | null
  cardImageAlt?: string | null
  cardCtaLabel?: string | null
  modalLayout: ResourceModalLayoutValue
  modalHeroTitle: string
  modalHeroSubtitle?: string | null
  modalHeroEyebrow?: string | null
  modalHeroIntro?: PortableTextBlock[] | null
  modalHeroIntroTextSize?: string | null
  modalHeroIntroTextColor?: string | null
  modalHeroIntroLinkColor?: string | null
  modalHeroIntroLinksOpenInNewTab?: boolean | null
  modalHeroImage?: SanityImageRef | null
  modalSections?: {
    heading?: string | null
    content?: PortableTextBlock[] | null
    contentTextSize?: string | null
    contentTextColor?: string | null
    contentLinkColor?: string | null
    contentLinksOpenInNewTab?: boolean | null
  }[] | null
  tableOfContents?: { label?: string | null; page?: string | null }[] | null
  tableOfContentsText?: string | null
  caseStudySecondaryImage?: SanityImageRef | null
  caseStudySecondaryBody?: string | null
  footerHeading?: string | null
  footerIntro?: string | null
  footerFormPrompt?: string | null
  requiresLoginBeforeForm?: boolean | null
  loginStepLabel?: string | null
  loginPrompt?: string | null
  hubspotFormKind?: 'governance' | 'guide' | 'methodology' | 'tallgrass' | 'mcp' | 'none' | null
  hubspotFormId?: string | null
  hubspotSource?: string | null
  hubspotTitle?: string | null
  orderRank?: string | null
  tab?: ResourceTabRecord | null
}

/** @deprecated Legacy array shape — still read if present in Sanity. */
export type ResourceHubSpotFormTypeRecord = {
  kind?: string | null
  formId?: string | null
}

export type ResourceHubSpotSettingsRecord = {
  portalId?: string | null
  governanceFormId?: string | null
  methodologyFormId?: string | null
  guideFormId?: string | null
  caseStudyFormId?: string | null
  mcpFormId?: string | null
  forms?: ResourceHubSpotFormTypeRecord[] | null
}

export type ResourcesHubData = {
  tabs: ResourceTabRecord[]
  items: ResourceItemRecord[]
  hubspotSettings?: ResourceHubSpotSettingsRecord | null
}
