/**
 * GROQ for /resources CMS tabs, cards, and modal content.
 */

const resourceItemProjection = `
  _id,
  modalId,
  "modalIdValue": modalId.current,
  cardTitle,
  cardExcerpt,
  cardImage,
  cardImageAlt,
  cardCtaLabel,
  modalLayout,
  modalHeroTitle,
  modalHeroSubtitle,
  modalHeroEyebrow,
  modalHeroIntro,
  modalHeroIntroTextSize,
  modalHeroIntroTextColor,
  modalHeroIntroLinkColor,
  modalHeroIntroLinksOpenInNewTab,
  modalHeroImage,
  modalSections[]{
    heading,
    content,
    contentTextSize,
    contentTextColor,
    contentLinkColor,
    contentLinksOpenInNewTab
  },
  tableOfContents[]{
    label,
    page
  },
  tableOfContentsText,
  caseStudySecondaryImage,
  caseStudySecondaryBody,
  footerHeading,
  footerIntro,
  footerFormPrompt,
  requiresLoginBeforeForm,
  loginStepLabel,
  loginPrompt,
  hubspotFormKind,
  hubspotFormId,
  hubspotSource,
  hubspotTitle,
  orderRank
`

const hubspotSettingsProjection = `
  portalId,
  governanceFormId,
  methodologyFormId,
  guideFormId,
  caseStudyFormId,
  mcpFormId,
  forms[]{ kind, formId }
`

export const resourcesHubQuery = `{
  "tabs": *[_type == "resourceTab"] | order(orderRank) {
    _id,
    title,
    tabHash,
    "tabHashValue": tabHash.current,
    tabKey,
    gridLayout,
    orderRank
  },
  "items": *[_type == "resourceItem" && defined(tab._ref)] | order(orderRank) {
    ${resourceItemProjection},
    "tab": tab->{ _id, tabKey, "tabHashValue": tabHash.current, title, gridLayout }
  },
  "hubspotSettings": *[_type == "resourcesHubSpotSettings"] | order(_updatedAt desc)[0]{
    ${hubspotSettingsProjection}
  }
}`
