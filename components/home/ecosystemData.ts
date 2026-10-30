export type EcosystemCard = {
  title: string
  body: string
  linkLabel?: string
  href?: string
  openInNewTab?: boolean
}

export type EcosystemGroup = {
  heading: string
  cards: EcosystemCard[]
}

export type EcosystemSlide = {
  id: string
  image: string
  tone: "soft" | "mid"
  title: string
  body: string
  cta?: string
  ctaHref?: string
  ctaOpen?: boolean
  lead?: EcosystemCard
  groups: EcosystemGroup[]
  trailing?: EcosystemCard
}

const learnMore = "Learn More →"

export const ECOSYSTEM_EYEBROW = "Earn EcoSystem"
export const ECOSYSTEM_HEADING = "Where energy stalls is where we work."
export const ECOSYSTEM_LINK_LABEL = learnMore

export const ECOSYSTEM_SLIDES: EcosystemSlide[] = [
  {
    id: "production",
    image: "/assets/images/ecosystem/rig-sunset.png",
    tone: "soft",
    title: "For Producers: Chain of Custody from the Wellhead",
    body: "Once gas leaves the wellhead, its verified attributes get harder to hold onto. Producers and mineral rights owners need an unbroken chain of custody between what was measured at the source, what entered shared infrastructure, and what finally reaches market — so certified gas can still be proven certified at the point of sale.",
    cta: "See how producers use Earn →",
    lead: {
      title: "Mineral Rights Owner",
      body: "Consolidate, calculate, and verify every royalty payment automatically.",
    },
    groups: [
      {
        heading: "Producers",
        cards: [
          {
            title: "Natural Gas",
            body: "Reduce administrative work on every deal, and trade routine volume programmatically.",
          },
          {
            title: "Renewable Natural Gas",
            body: "Unlock new revenue from verified, tokenized, proof-of-custody RNG.",
          },
        ],
      },
    ],
    trailing: {
      title: "Gatherers + Processors",
      body: "Preserve attribution and reconciliation from wellhead to finished product.",
    },
  },
  {
    id: "midstream",
    image: "/assets/images/ecosystem/pipeline-desert.png",
    tone: "mid",
    title: "For Midstream: Attribution Through Commingled Streams",
    body: "Commingling, processing, storage, and transport split the physical molecule from the data that describes it. Operators need attribution and provenance to survive custody transfer — tracked by Gas-Day, across shared infrastructure, under mass-balance or trace-and-claim rules.",
    cta: "See how midstream operators use Earn →",
    groups: [
      {
        heading: "",
        cards: [
          {
            title: "Pipelines",
            body: "Prove network quality as a verifiable record, not an assertion.",
          },
          {
            title: "Storage",
            body: "Maintain provable continuity across receipts, inventory, and withdrawals.",
          },
          {
            title: "LNG Liquefaction",
            body: "Carry one verified record with every cargo, from origin to delivery.",
          },
        ],
      },
    ],
  },
  {
    id: "demand",
    image: "/assets/images/ecosystem/demand.png",
    tone: "mid",
    title: "For Buyers and Importers: One Record, Every Reporting Regime",
    body: "Marketers, traders, and LNG importers need emissions data they can qualify, compare, and transact — against rules that keep multiplying. EU Methane Regulation, OGMP 2.0, and every counterparty's own reporting standard. One verified record should satisfy all of them.",
    cta: "See how buyers and importers use Earn →",
    groups: [
      {
        heading: "Intermediaries",
        cards: [
          {
            title: "Marketers",
            body: "Match qualified supply to buyer requirements, and automate offer to invoice.",
          },
          {
            title: "Traders",
            body: "Automate the entire post-trade desk, from booked deal to settlement.",
          },
          {
            title: "LNG Importer",
            body: "Qualify supply and assemble the compliance case in one step.",
          },
        ],
      },
      {
        heading: "Buyers",
        cards: [
          {
            title: "Data centers/Hyperscalers",
            body: "Source, verify, and optimize resilient energy, programmatically.",
          },
          {
            title: "Corporates/Industrial",
            body: "Buy gas that already meets your operational and environmental bar.",
          },
          {
            title: "Utilities",
            body: "Choose better supply, then automate the commercial work behind it.",
          },
        ],
      },
    ],
  },
]
