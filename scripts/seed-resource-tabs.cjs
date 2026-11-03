/**
 * Seeds the Resources tabs and the methodology cards from the Figma covers.
 * News & Insights stays the article list (seed:resources). This script does not
 * replace those articles.
 *
 * Re-running updates these tab and card ids only.
 *
 * Usage: npm run seed:resource-tabs
 */
require('dotenv').config({ path: '.env.local', quiet: true })
require('dotenv').config({ quiet: true })

const fs = require('fs')
const path = require('path')
const { createClient } = require('@sanity/client')

const BLOCKED_PROJECT_ID = 'wm8t0eow'

const TABS = [
  {
    _id: 'resourceTab-governance',
    title: 'Governance',
    tabHash: 'governance',
    tabKey: 'governance',
    gridLayout: 'singleWide',
    orderRank: '0|100010:',
  },
  {
    _id: 'resourceTab-methodologies',
    title: 'Methodologies',
    tabHash: 'methodologies',
    tabKey: 'methodologies',
    gridLayout: 'twoColumn',
    orderRank: '0|100020:',
  },
  {
    _id: 'resourceTab-guides',
    title: 'Guides',
    tabHash: 'guides',
    tabKey: 'guides',
    gridLayout: 'twoColumn',
    orderRank: '0|100030:',
  },
  {
    _id: 'resourceTab-case-studies',
    title: 'Case Studies',
    tabHash: 'casestudies',
    tabKey: 'case-studies',
    gridLayout: 'twoColumn',
    orderRank: '0|100040:',
  },
  {
    _id: 'resourceTab-developers',
    title: 'Developers',
    tabHash: 'developers',
    tabKey: 'developers',
    gridLayout: 'twoColumn',
    orderRank: '0|100050:',
  },
]

const CTA = 'Preview this methodologies →'

const CARDS = [
  {
    _id: 'resourceItem-qet',
    modalId: 'qet',
    image: 'qet.png',
    alt: 'QET methodology cover',
    source: 'QET',
    title:
      'Methodology for the Production and Verification of Natural Gas Quantified Emissions Tokens® (QETs) in Accordance with ISO 14064-3',
    excerpt:
      'This methodology establishes standardized processes for quantifying emissions factors, enabling verification while remaining agnostic to the measurement methodologies employed by producers of natural gas and other commodities.',
  },
  {
    _id: 'resourceItem-low-carbon-qet',
    modalId: 'low-carbon-qet',
    image: 'lcfs.png',
    alt: 'QET-LCFS methodology cover',
    source: 'QET-LCFS',
    title:
      'Methodology for the Production and Verification of Low Carbon Fuel Standard Quantified Emissions Tokens® (QET-LCFS) in Accordance with ISO 14064-3',
    excerpt:
      'This methodology defines procedures for producing and verifying QET-LCFS for California LCFS compliance, extending the core QET framework to incorporate LCFS-specific carbon intensity, fuel pathway, and CARB verification requirements.',
  },
  {
    _id: 'resourceItem-ethanol-qet',
    modalId: 'ethanol-qet',
    image: 'ethanol.png',
    alt: 'QET-Ethanol methodology cover',
    source: 'QET-Ethanol',
    title:
      'Methodology for the Production and Verification of Ethanol Quantified Emissions Tokens® (QET-Ethanol) in Accordance with ISO 14064-3',
    excerpt:
      'This methodology extends the core QET framework to ethanol production, addressing process-specific characteristics including biological fermentation, synthetic production pathways, and diverse feedstock sources.',
  },
  {
    _id: 'resourceItem-ccs-qet',
    modalId: 'ccs-qet',
    image: 'ccs.png',
    alt: 'QET-CCS methodology cover',
    source: 'QET-CCS',
    title:
      'Methodology for the Production and Verification of Carbon Capture and Sequestration Quantified Emissions Tokens® (QET-CCS) — kgCO₂e Removed',
    excerpt:
      'This methodology defines a framework for QET-CCS, where each token represents 1 kgCO₂e permanently removed and immutably tracked via the EarnDLT registry. It remains compatible with established carbon removal standards while anchored to ISO as the primary normative reference.',
  },
  {
    _id: 'resourceItem-sol-qet',
    modalId: 'sol-qet',
    image: 'sol.png',
    alt: 'QET-SOL methodology cover',
    source: 'QET-SOL',
    title:
      'Methodology for the Production and Verification of Solid Fuel Thermal Quantified Emissions Tokens (QET-SOL) — kgCO₂e/MMBtu',
    excerpt:
      'This methodology defines procedures for producing, quantifying, disclosing, and verifying QET-SOL, with GHG intensity standardized to kgCO₂e/MMBtu. It enables QET-SOL to function as audit-ready environmental attribute certificates aligned with ISO 14064-3 and referencing the EarnDLT QET core methodology.',
  },
  {
    _id: 'resourceItem-rng-qet',
    modalId: 'rng-qet',
    image: 'rng.png',
    alt: 'QET-RNG methodology cover',
    source: 'QET-RNG',
    title:
      'Methodology for the Production and Verification of Renewable Natural Gas Quantified Emission Token Thermal Certificates (QET-RNG) — kgCO₂e/MMBtu',
    excerpt:
      'This methodology defines QET-RNG Thermal Certificates, measuring GHG intensity in kgCO₂e/MMBtu, with each token representing 1 MMBtu of verified renewable natural gas. Tokens are issued and tracked through the EarnDLT registry, providing immutable records and transparent chain-of-custody.',
  },
  {
    _id: 'resourceItem-transport-distances',
    modalId: 'transport-distances',
    image: 'transport.png',
    alt: 'Transport distance methodology cover',
    source: 'QET-TRANSPORT',
    title: 'Methodology for Deriving Transport Distances Along the U.S. Natural Gas Pipeline Network',
    excerpt:
      'This methodology defines a standardized approach to deriving hypothetical transport distances for natural gas and renewable natural gas using a verified U.S. network model. It ensures transparent, reproducible, and spatially accurate calculations for ISO 14064-3 verification, modeling pathways rather than physical flow to support consistent emission allocation.',
  },
  {
    _id: 'resourceItem-dynamic-allocation-pipeline',
    modalId: 'dynamic-allocation-pipeline',
    image: 'transport-pipeline.png',
    alt: 'Pipeline allocation methodology cover',
    source: 'QET-TRANSPORT-US',
    title:
      'Methodology for the Dynamic Allocation of GHG Emissions to Natural Gas and Renewable Natural Gas Pipeline Transportation - US Edition',
    excerpt:
      'This document defines EarnDLT’s approach to dynamically allocating GHG emissions to pipeline transport of natural gas, including renewable sources. Emissions are calculated based on transport distance across the U.S. pipeline network and assigned per MMBtu. It applies to natural gas produced and transported within the United States.',
  },
  {
    _id: 'resourceItem-qet-elec',
    modalId: 'qet-elec',
    image: 'elec.png',
    alt: 'QET-ELEC methodology cover',
    source: 'QET-ELEC',
    title:
      'Methodology for the Production and Verification of Electricity Quantified Emissions Tokens® (QET-ELEC) — kgCO₂e per kilowatt-hour',
    excerpt:
      'This methodology defines a standardized system to measure and verify electricity emissions at the 1 kWh level, aligned with ISO 14064-3. It tracks carbon intensity (kgCO₂e/kWh) across all generation sources. It enables transparent attribution and bundling with carbon removal credits for carbon-neutral or carbon-negative delivery.',
  },
]

const DEVELOPER_CARDS = [
  {
    _id: 'resourceItem-api-documentation',
    modalId: 'api-documentation',
    image: 'qet.png',
    alt: 'EarnDLT API documentation',
    title: 'API Documentation',
    excerpt:
      'Integrate organizations, energy data, token transactions, production workflows, and marketplace operations with the EarnDLT API.',
    url: 'https://earndlt.com/api-documentation',
  },
  {
    _id: 'resourceItem-mcp-documentation',
    modalId: 'mcp-documentation',
    image: 'elec.png',
    alt: 'EarnDLT MCP documentation',
    title: 'MCP Documentation',
    excerpt:
      'Connect an AI assistant to EarnDLT to review token holdings, search the marketplace, manage carts, and place approved purchases.',
    url: 'https://earndlt.com/mcp-documentation',
  },
]

let keySeq = 0
const key = () => `tab${(keySeq++).toString(36).padStart(4, '0')}`

function paragraph(text) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }
}

function imagePath(filename) {
  return path.join(process.cwd(), 'public', 'assets', 'images', 'resources', filename)
}

async function uploadImage(client, filename) {
  const abs = imagePath(filename)
  console.log(`Uploading ${filename}`)
  const asset = await client.assets.upload('image', fs.createReadStream(abs), {
    filename,
    contentType: 'image/png',
  })
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  }
}

async function publishedId(client, query, params, fallbackId) {
  const existing = await client.fetch(query, params)
  if (!existing || typeof existing !== 'string') return fallbackId
  return existing.startsWith('drafts.') ? existing.slice('drafts.'.length) : existing
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN

  if (!projectId || projectId === BLOCKED_PROJECT_ID) {
    console.error('Refusing to write. This seed only runs against the Earn Sanity project.')
    process.exit(1)
  }

  if (!token) {
    console.error('Missing SANITY_API_WRITE_TOKEN. Add it to .env.local with Editor permissions, then re-run.')
    process.exit(1)
  }

  const client = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-04-22',
    token,
    useCdn: false,
  })

  const tabIds = {}
  for (const tab of TABS) {
    const _id = await publishedId(
      client,
      `*[_type == "resourceTab" && tabKey == $tabKey][0]._id`,
      { tabKey: tab.tabKey },
      tab._id,
    )
    await client.createOrReplace({
      _id,
      _type: 'resourceTab',
      title: tab.title,
      tabHash: { _type: 'slug', current: tab.tabHash },
      tabKey: tab.tabKey,
      gridLayout: tab.gridLayout,
      orderRank: tab.orderRank,
    })
    tabIds[tab.tabKey] = _id
    console.log(`Saved tab: ${tab.title}`)
  }

  const methodologiesId = tabIds.methodologies
  for (const [index, card] of CARDS.entries()) {
    const image = await uploadImage(client, card.image)
    const _id = await publishedId(
      client,
      `*[_type == "resourceItem" && modalId.current == $modalId][0]._id`,
      { modalId: card.modalId },
      card._id,
    )
    await client.createOrReplace({
      _id,
      _type: 'resourceItem',
      orderRank: `0|2000${String(index + 1).padStart(2, '0')}:`,
      tab: { _type: 'reference', _ref: methodologiesId },
      modalId: { _type: 'slug', current: card.modalId },
      modalLayout: 'methodology',
      cardTitle: card.title,
      cardExcerpt: card.excerpt,
      cardImage: image,
      cardImageAlt: card.alt,
      cardCtaLabel: CTA,
      modalHeroTitle: card.title,
      modalHeroIntro: [paragraph(card.excerpt)],
      modalHeroImage: image,
      footerHeading: 'Continue Reading',
      footerIntro: "You've reached the end of the preview.",
      footerFormPrompt: 'Please fill out the form to download the document.',
      requiresLoginBeforeForm: true,
      loginStepLabel: 'Step 1 of 2',
      loginPrompt: 'Create an account or log in to access the full methodology document.',
      hubspotFormKind: 'methodology',
      hubspotSource: card.source,
      hubspotTitle: card.title,
    })
    console.log(`Saved card: ${card.modalId}`)
  }

  const developersId = tabIds.developers
  for (const [index, card] of DEVELOPER_CARDS.entries()) {
    const image = await uploadImage(client, card.image)
    const _id = await publishedId(
      client,
      `*[_type == "resourceItem" && modalId.current == $modalId][0]._id`,
      { modalId: card.modalId },
      card._id,
    )
    await client.createOrReplace({
      _id,
      _type: 'resourceItem',
      orderRank: `0|3000${String(index + 1).padStart(2, '0')}:`,
      tab: { _type: 'reference', _ref: developersId },
      modalId: { _type: 'slug', current: card.modalId },
      modalLayout: 'documentPreview',
      cardTitle: card.title,
      cardExcerpt: card.excerpt,
      cardImage: image,
      cardImageAlt: card.alt,
      cardCtaLabel: 'Read documentation →',
      externalUrl: card.url,
      modalHeroTitle: card.title,
      modalHeroIntro: [paragraph(card.excerpt)],
      hubspotFormKind: 'none',
    })
    console.log(`Saved developer card: ${card.modalId}`)
  }

  console.log('Done. Governance, Guides, and Case Studies are tabs with no cards yet.')
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
