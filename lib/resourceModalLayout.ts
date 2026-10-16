/** Normalized modal layout keys (stored in Sanity `modalLayout`). */
export type ResourceModalLayout =
  | 'governance'
  | 'guides'
  | 'methodology'
  | 'caseStudy'

export function normalizeResourceModalLayout(
  raw: string | null | undefined,
  hubspotFormKind?: string | null,
): ResourceModalLayout {
  if (raw === 'governance' || raw === 'guides' || raw === 'methodology' || raw === 'caseStudy') {
    return raw
  }
  if (raw === 'documentPreview') {
    if (hubspotFormKind === 'guide') return 'guides'
    return 'governance'
  }
  if (hubspotFormKind === 'methodology') return 'methodology'
  if (hubspotFormKind === 'tallgrass') return 'caseStudy'
  if (hubspotFormKind === 'guide') return 'guides'
  return 'governance'
}

export function isMethodologyModalLayout(layout: ResourceModalLayout) {
  return layout === 'methodology'
}

export function isCaseStudyModalLayout(layout: ResourceModalLayout) {
  return layout === 'caseStudy'
}

export function isGuidesModalLayout(layout: ResourceModalLayout) {
  return layout === 'guides'
}

/** Methodology cards use a wider thumbnail on the listing grid. */
export function useMethodologyCardImage(layout: ResourceModalLayout) {
  return layout === 'methodology'
}
