/**
 * Seeds the homepage page (`_id: homepage`) with the eight homepage blocks.
 * Copy and images match the current homepage, including product placeholders.
 * Skips if the document already exists, so Studio edits are never overwritten.
 * Pass --replace to overwrite it on purpose (Studio edits are lost).
 *
 * Usage: npm run seed:homepage [-- --replace]
 *
 * The site shows this document at /. The slug `home` is only the Studio address.
 */
require('dotenv').config({ path: '.env.local' })
require('dotenv').config()

const fs = require('fs')
const path = require('path')
const { createClient } = require('@sanity/client')

const DOC_ID = 'homepage'
const REPLACE = process.argv.includes('--replace')

let keySeq = 0
const key = () => `home${(keySeq++).toString(36).padStart(4, '0')}`

const uploaded = new Map()

function imagePath(publicPath) {
  return path.join(process.cwd(), 'public', publicPath.replace(/^\//, ''))
}

async function uploadImage(client, publicPath) {
  if (uploaded.has(publicPath)) return uploaded.get(publicPath)

  const abs = imagePath(publicPath)
  const filename = path.basename(abs)
  const contentType = filename.endsWith('.svg')
    ? 'image/svg+xml'
    : filename.endsWith('.png')
      ? 'image/png'
      : undefined

  console.log(`Uploading ${publicPath}`)
  const asset = await client.assets.upload('image', fs.createReadStream(abs), {
    filename,
    contentType,
  })
  const image = {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  }
  uploaded.set(publicPath, image)
  return image
}

function textCard(title, body) {
  return {
    _type: 'ecosystemCard',
    _key: key(),
    title,
    body,
    linkLabel: 'Learn More',
    linkUrl: '#',
    openInNewTab: false,
  }
}

function cardGroup(heading, cards) {
  return {
    _type: 'ecosystemCardGroup',
    _key: key(),
    heading,
    cards: cards.map(([title, body]) => textCard(title, body)),
  }
}

async function buildBlocks(client) {
  const hero = await uploadImage(client, '/assets/images/hero-platform.png')
  const rig = await uploadImage(client, '/assets/images/ecosystem/rig-sunset.png')
  const pipeline = await uploadImage(client, '/assets/images/ecosystem/pipeline-desert.png')
  const demand = await uploadImage(client, '/assets/images/ecosystem/demand.png')
  const logoGreentruth = await uploadImage(client, '/assets/images/products/logo-greentruth.svg')
  const logoEarn = await uploadImage(client, '/assets/images/products/logo-earn.svg')
  const logoE10 = await uploadImage(client, '/assets/images/products/logo-e10.svg')
  const logoEig = await uploadImage(client, '/assets/images/products/logo-eig.svg')
  const tallgrass = await uploadImage(client, '/assets/images/proof/tallgrass.svg')
  const proman = await uploadImage(client, '/assets/images/proof/proman.svg')
  const payne = await uploadImage(client, '/assets/images/proof/payne.png')
  const datacenter = await uploadImage(client, '/assets/images/reading/datacenter.png')
  const processing = await uploadImage(client, '/assets/images/reading/processing.png')
  const methodology = await uploadImage(client, '/assets/images/reading/methodology.png')

  const logos = {
    greentruth: logoGreentruth,
    earn: logoEarn,
    e10: logoE10,
    eig: logoEig,
  }

  const filterCard = (logo, brand, title, body, flags = {}) => ({
    _type: 'filterCard',
    _key: key(),
    iconMode: 'icon',
    icon: logos[logo],
    brand,
    title,
    body: body.join('\n\n'),
    linkKind: 'button',
    linkLabel: 'Learn more',
    linkUrl: '#',
    openInNewTab: false,
    chips: ['Chip Label'],
    wide: Boolean(flags.wide),
    wideOnLargestScreen: Boolean(flags.wideOnLargestScreen),
  })

  const proofItem = (logo, logoAlt, title, body, buttonLabel) => ({
    _type: 'proofItem',
    _key: key(),
    logo,
    logoAlt,
    title,
    body,
    buttonLabel,
    buttonUrl: '#',
    openInNewTab: false,
  })

  const insightCard = (image, kicker, title, body, linkLabel, extra = {}) => ({
    _type: 'insightCard',
    _key: key(),
    image,
    imageAlt: '',
    kicker,
    title,
    body,
    linkLabel,
    linkUrl: '#',
    openInNewTab: false,
    ...(extra.compactLinkLabel ? { compactLinkLabel: extra.compactLinkLabel } : {}),
    roundImage: Boolean(extra.roundImage),
  })

  const step = (stepId, index, title, kicker, body) => ({
    _type: 'architectureStep',
    _key: key(),
    stepId,
    index,
    title,
    kicker,
    body: body.join('\n\n'),
  })

  const part = (partId, image, tone, title, body, linkLabel, extra) => ({
    _type: 'ecosystemPart',
    _key: key(),
    part: partId,
    image,
    tone,
    title,
    body,
    linkLabel,
    linkUrl: '#',
    openInNewTab: false,
    ...(extra.leadTitle
      ? {
          leadTitle: extra.leadTitle,
          leadBody: extra.leadBody,
          leadLinkLabel: 'Learn More',
          leadLinkUrl: '#',
          leadOpenInNewTab: false,
        }
      : {}),
    groups: extra.groups,
    ...(extra.trailingTitle
      ? {
          trailingTitle: extra.trailingTitle,
          trailingBody: extra.trailingBody,
          trailingLinkLabel: 'Learn More',
          trailingLinkUrl: '#',
          trailingOpenInNewTab: false,
        }
      : {}),
  })

  return [
    {
      _type: 'bannerBlock',
      _key: key(),
      heading: 'Natural gas has to move.\nEarn makes it agent-ready.',
      body: [
        'Earn is the verification and settlement infrastructure for natural gas. We link measurement, emissions, and commercial data into a single auditable chain of custody — so every molecule carries proof of where it came from and how it was produced.',
        'That record satisfies the EU Methane Regulation by trace and claim — the route the Commission names first — or by book and claim where certification is the better fit. It is also what AI agents need to qualify, procure, and trade gas without a human in the loop.',
      ].join('\n\n'),
      backgroundMode: 'image',
      image: hero,
      imageFit: 'fillFit',
      imagePosition: 'center',
      fontColor: 'offWhite',
      fontSize: 'default',
      copyOpacity: 40,
      buttonKind: 'none',
    },
    {
      _type: 'ecosystemBlock',
      _key: key(),
      eyebrow: 'Earn EcoSystem',
      heading: 'Where energy stalls is where we work.',
      slides: [
        part(
          'production',
          rig,
          'soft',
          'For Producers: Chain of Custody from the Wellhead',
          'Once gas leaves the wellhead, its verified attributes get harder to hold onto. Producers and mineral rights owners need an unbroken chain of custody between what was measured at the source, what entered shared infrastructure, and what finally reaches market — so certified gas can still be proven certified at the point of sale.',
          'See how producers use Earn',
          {
            leadTitle: 'Mineral Rights Owner',
            leadBody: 'Consolidate, calculate, and verify every royalty payment automatically.',
            groups: [
              cardGroup('Producers', [
                [
                  'Natural Gas',
                  'Reduce administrative work on every deal, and trade routine volume programmatically.',
                ],
                [
                  'Renewable Natural Gas',
                  'Unlock new revenue from verified, tokenized, proof-of-custody RNG.',
                ],
              ]),
            ],
            trailingTitle: 'Gatherers + Processors',
            trailingBody: 'Preserve attribution and reconciliation from wellhead to finished product.',
          },
        ),
        part(
          'midstream',
          pipeline,
          'mid',
          'For Midstream: Attribution Through Commingled Streams',
          'Commingling, processing, storage, and transport split the physical molecule from the data that describes it. Operators need attribution and provenance to survive custody transfer — tracked by Gas-Day, across shared infrastructure, under mass-balance or trace-and-claim rules.',
          'See how midstream operators use Earn',
          {
            groups: [
              cardGroup('', [
                ['Pipelines', 'Prove network quality as a verifiable record, not an assertion.'],
                ['Storage', 'Maintain provable continuity across receipts, inventory, and withdrawals.'],
                ['LNG Liquefaction', 'Carry one verified record with every cargo, from origin to delivery.'],
              ]),
            ],
          },
        ),
        part(
          'demand',
          demand,
          'mid',
          'For Buyers and Importers: One Record, Every Reporting Regime',
          "Marketers, traders, and LNG importers need emissions data they can qualify, compare, and transact — against rules that keep multiplying. EU Methane Regulation, OGMP 2.0, and every counterparty's own reporting standard. One verified record should satisfy all of them.",
          'See how buyers and importers use Earn',
          {
            groups: [
              cardGroup('Intermediaries', [
                [
                  'Marketers',
                  'Match qualified supply to buyer requirements, and automate offer to invoice.',
                ],
                ['Traders', 'Automate the entire post-trade desk, from booked deal to settlement.'],
                ['LNG Importer', 'Qualify supply and assemble the compliance case in one step.'],
              ]),
              cardGroup('Buyers', [
                [
                  'Data centers/Hyperscalers',
                  'Source, verify, and optimize resilient energy, programmatically.',
                ],
                [
                  'Corporates/Industrial',
                  'Buy gas that already meets your operational and environmental bar.',
                ],
                ['Utilities', 'Choose better supply, then automate the commercial work behind it.'],
              ]),
            ],
          },
        ),
      ],
    },
    {
      _type: 'filterCardsBlock',
      _key: key(),
      eyebrow: 'Earn EcoSystem',
      heading: 'One verified record.\nEvery application built on top of it.',
      lead: "Earn products share a single source of verified energy data — so what you prove once counts everywhere it's needed.",
      showFilters: true,
      filterMenuLabel: 'Filter by Role',
      sectionBackground: 'medCoolGrey',
      filters: [
        'Mineral Rights Owner',
        'Natural Gas Producer',
        'RNG  Producer',
        'Gatherers + Processors',
        'Pipelines',
        'Storage',
        'LNG Liquefaction',
        'Marketers',
        'Traders',
        'LNG Importer',
        'Data Centers/Hyperscalers',
        'Corporates/Industrial',
        'Utilities',
      ].map((label) => ({ _type: 'filterOption', _key: key(), label })),
      cards: [
        filterCard(
          'greentruth',
          'Greentruth',
          'QET Registry',
          [
            'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
          ],
          { wide: true },
        ),
        filterCard(
          'earn',
          'EarnDLT',
          'Verified Energy Data Infrastructure',
          [
            'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci vel.',
            'Sed quia non numquam eius modi tempora incidunt.',
          ],
          { wideOnLargestScreen: true },
        ),
        filterCard(
          'e10',
          'Enterprise 10',
          'Trading Desk (ETRM) Automation',
          [
            't vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
            'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
          ],
        ),
        filterCard('eig', 'Energy Intelligence Graph', 'Gas-Day Traceability', [
          'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla.',
        ]),
        filterCard('eig', 'Energy Intelligence Graph', 'Data Center Site Resilience Scoring', [
          'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
        ]),
        filterCard('eig', 'Energy Intelligence Graph', 'Vessel Intelligence', [
          'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
        ]),
        filterCard('eig', 'Energy Intelligence Graph', 'Pipeline Pathway Mapping', [
          't vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
          'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
        ]),
        filterCard('greentruth', 'Greentruth', 'GasTrace', [
          'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
        ]),
        filterCard('greentruth', 'Greentruth', 'RNG Forwards', [
          'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
        ]),
      ],
    },
    {
      _type: 'statementBlock',
      _key: key(),
      eyebrow: 'The principle',
      eyebrowColor: 'offWhite',
      sectionBackground: 'medCoolGrey',
      subtitleColor: 'offWhite',
      heading: 'One verified record.\nBuilt to move across markets, standards, and systems.',
      subtitle:
        'Deployed on REX Piple — one governed record, held across 1,713 miles of commingled flow',
    },
    {
      _type: 'architectureBlock',
      _key: key(),
      eyebrow: 'The Architecture',
      heading: 'What makes the record portable.',
      lead: 'A verified record, a natural gas network model, a governance framework, and open agent access work together to make energy data portable across markets, standards, and systems.',
      steps: [
        step(
          'record',
          '01',
          'Governed Representation',
          'EarnDLT Registry + Interoperable Schema',
          [
            'EarnDLT maintains the governed record on the Hedera blockchain, preserving an immutable history that connects energy to its provenance, attributes, methodology, verification, ownership, and commercial context.',
            'An extensible schema lets that same representation move across commodities, methodologies, and market requirements without rebuilding the underlying record.',
          ],
        ),
        step(
          'network',
          '02',
          'Physical Intelligence',
          'Natural Gas Network Model',
          [
            'Earn maps natural gas infrastructure across the Lower 48 and the EU, connecting pipelines, supply basins, operators, meter points, and delivery pathways into a unified model of the physical system.',
            'The model grounds each governed representation in real-world context, connecting the record to where the gas originates, how it moves and changes, and where it is delivered.',
          ],
        ),
        step(
          'trust',
          '03',
          'Trust + Governance',
          'Governance Framework + Token Methodologies + Standards Alignment',
          [
            'EarnDLT defines and versions the methodologies, verification requirements, and governance rules used to structure, calculate, and interpret governed energy data, while aligning them with relevant external standards and reporting frameworks.',
            'This governing environment applies across both the governed representation and physical intelligence, preserving how data and derived outputs were produced, verified, and governed throughout their lifecycle. Together with the shared schema, it provides the trusted semantic and rules layer that forms the machine-operable foundation.',
          ],
        ),
        step(
          'machine',
          '04',
          'Governed Representation',
          'MCP + APIs + SDKs + CUA',
          [
            'Earn provides multiple ways to access and act on the platform, from APIs and human-directed interfaces through supervised agents to agentic automation, allowing organizations to evolve at their own pace without replacing the systems and workflows already in place.',
            'The Machine Interface connects the governed core to the outside ecosystem, exposing data and governance through a unified semantic model that preserves their meaning across systems.',
          ],
        ),
      ],
    },
    {
      _type: 'proofListBlock',
      _key: key(),
      eyebrow: 'Proof',
      heading: 'Proven across infrastructure, transactions,\nand published research.',
      sectionBackground: 'medCoolGrey',
      imageSize: 'default',
      items: [
        proofItem(
          tallgrass,
          'Tallgrass',
          'Deployed in real energy infrastructure',
          'Earn’s governed data infrastructure is deployed across the 1,713-mile Rockies Express Pipeline, connecting verified energy records to physical movement across an interstate network.',
          'View the deployment',
        ),
        proofItem(
          proman,
          'Proman',
          'Used in a real commercial transaction',
          'First tokenized methanol cargo — proof the model extends beyond natural gas.\n“…paves the way for tokenisation to become an integral part of future methanol transactions.” - Tim Cornelius, Proman',
          'Read the case study',
        ),
        proofItem(
          payne,
          'The Payne Institute for Public Policy',
          'Subject of published external research',
          'Research published by the Payne Institute examines QET-LNG against emerging regulatory, interoperability, and ISO-aligned requirements.',
          'Read the research',
        ),
      ],
    },
    {
      _type: 'calloutBlock',
      _key: key(),
      eyebrow: 'Work with Earn',
      heading: 'Take us where energy gets stuck.',
      intro:
        'We work at the points where data, regulation, physical infrastructure, and transactions slow energy down.',
      panelTitle: 'Explore a Deployment',
      panelBody:
        'Bring us the market requirement, data challenge, or opportunity.\nWe’ll work alongside your team to turn it into advantage.',
      buttonLabel: 'Start a conversation',
      buttonUrl: '#',
      openInNewTab: false,
      showArrows: true,
      sectionBackground: 'darkSlate',
    },
    {
      _type: 'insightCardsBlock',
      _key: key(),
      eyebrow: 'Further Reading',
      heading: 'Go deeper into the forces moving the energy markets.',
      imageProportion: 'default',
      linkKind: 'button',
      showConclusion: true,
      conclusionLabel: 'View all insights + resources',
      conclusionUrl: '#',
      conclusionNewTab: false,
      sectionBackground: 'darkSlate',
      cards: [
        insightCard(
          datacenter,
          'Market Analysis',
          'Hyperscalers need energy.\nThey also need the data.',
          'How differing buyer requirements are creating a new interoperability challenge for energy producers.',
          'Read the analysis',
        ),
        insightCard(
          processing,
          'Regulatory Deep Dive',
          'What the EU Methane Regulation actually requires of importers.',
          'From 1 January 2027, importers must supply verified methane data. How trace and claim, certification, and OGMP 2.0 reporting reshape the verification infrastructure needed to sell into Europe.',
          'Read the deep dive',
        ),
        insightCard(
          methodology,
          'Methodology',
          'How verified records hold up under audit.',
          'Explore the methodologies, verification requirements, versioning, and governance rules behind EarnDLT records.',
          'Explore our methodologies',
          { compactLinkLabel: 'Explore methodologies', roundImage: true },
        ),
      ],
    },
  ]
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  if (!projectId) {
    console.error(
      'Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Refusing to run so this cannot write to another Sanity project.',
    )
    process.exit(1)
  }

  const token =
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_AUTH_TOKEN ||
    process.env.SANITY_API_TOKEN

  let client
  if (token) {
    client = createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-04-22',
      token,
      useCdn: false,
      timeout: 180000,
    })
  } else {
    const { getCliClient } = require('sanity/cli')
    client = getCliClient({ apiVersion: '2024-04-22' })
  }

  const existing = await client.fetch(`*[_id == $id][0]._id`, { id: DOC_ID })
  if (existing && !REPLACE) {
    console.log('Homepage already exists — skipped (no changes). Use --replace to overwrite.')
    return
  }

  const pageBuilder = await buildBlocks(client)
  const doc = {
    _id: DOC_ID,
    _type: 'page',
    title: 'Home',
    slug: { _type: 'slug', current: 'home' },
    pageBuilder,
  }

  await client.createOrReplace(doc)
  console.log(existing ? 'Replaced the homepage in Sanity.' : 'Created the homepage in Sanity.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
