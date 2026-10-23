/**
 * Seeds the Site Navigation singleton (`_id: siteNavigation`) with the Earn Figma menu.
 * Skips if the document already exists, so Studio edits are never overwritten.
 * Pass --replace to overwrite it on purpose (Studio edits are lost).
 *
 * Usage: npm run seed:site-navigation [-- --replace]
 *
 * `href: '#'` is a placeholder until real URLs exist; editors set them in Studio.
 * Rows without `href` render as grey headings with no orange bar (Figma "Automation", "Developers").
 */
require('dotenv').config({ path: '.env.local' })
require('dotenv').config()

const { createClient } = require('@sanity/client')

const DOC_ID = 'siteNavigation'
const REPLACE = process.argv.includes('--replace')

const LOREM_HEADING = 'Lorem ipsum dolor sit amet'
const LOREM_BODY =
  'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

/** Row helper: `link('Label')` → placeholder link, `heading('Label')` → no URL. */
const link = (label, subitems) => ({ label, href: '#', subitems })
const heading = (label, subitems) => ({ label, subitems })

const NAV = [
  {
    label: 'Capabilities',
    dropdownKind: 'singleWithIntro',
    introHeading: LOREM_HEADING,
    introBody: LOREM_BODY,
    items: [
      link('Source-to-Delivery Traceability'),
      link('Commodity Differentiation'),
      link('Data Interoperability'),
      link('Supply Resilience'),
      link('Trading Desk (ETRM) Automation'),
      link('Emissions Provenance'),
    ],
  },
  {
    label: 'Solutions',
    dropdownKind: 'singleWithIntro',
    introHeading: LOREM_HEADING,
    introBody: LOREM_BODY,
    items: [
      link('Producers'),
      link('Midstream Operators'),
      link('LNG Importers'),
      link('Traders & Brokers'),
      link('Data Centers'),
      link('ESG & Sustainability Teams'),
    ],
  },
  {
    label: 'Ecosystem',
    dropdownKind: 'singleWithIntro',
    introHeading: LOREM_HEADING,
    introBody: LOREM_BODY,
    items: [
      link('EarnDLT'),
      link('Energy Intelligence Graph', [
        link('Molecular Traceability'),
        link('Resiliency Scoring'),
        link('Vessel Intelligence'),
      ]),
      heading('Automation', [link('Enterprise 10'), link('Title Tokens')]),
      link('Greentruth', [
        link('GasTrace'),
        link('Registry'),
        link('QET Lookup'),
        link('RNG Forwards'),
      ]),
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    dropdownKind: 'multiColumn',
    columns: [
      [link('News & Insights', [link('Article 1'), link('Article 2'), link('Article 3')])],
      [
        link('Methodologies', [
          link('QET-NG'),
          link('QET-RNG'),
          link('QET-ELECT'),
          link('QET-SOL'),
          link('QET-CSS'),
          link('QET-Ethanol'),
        ]),
      ],
      [link('Frameworks & Guides', [link('Governance'), link('SBTi'), link('TCR'), link('CDR')])],
      [link('Case Studies', [link('Tallgrass'), link('Proman')])],
      [heading('Developers', [link('API Documentation'), link('MCP Documentation')])],
    ],
  },
  { label: 'About', href: '#', dropdownKind: 'none' },
  { label: 'Greentruth ↗', href: '#', dropdownKind: 'none' },
]

/* ---- Map the readable data above to Sanity array members (_type + unique _key) ---- */

let keySeq = 0
const key = () => `nav${(keySeq++).toString(36).padStart(4, '0')}`

const toSubRow = (s) => ({ _type: 'navSubRow', _key: key(), label: s.label, ...(s.href ? { href: s.href } : {}) })

const toRow = (r) => ({
  _type: 'navRow',
  _key: key(),
  label: r.label,
  ...(r.href ? { href: r.href } : {}),
  ...(r.subitems?.length ? { subitems: r.subitems.map(toSubRow) } : {}),
})

const toNavItem = (it) => ({
  _type: 'navItem',
  _key: key(),
  label: it.label,
  dropdownKind: it.dropdownKind,
  ...(it.href ? { href: it.href } : {}),
  ...(it.dropdownKind === 'singleWithIntro'
    ? { items: it.items.map(toRow), introHeading: it.introHeading, introBody: it.introBody }
    : {}),
  ...(it.dropdownKind === 'multiColumn'
    ? { columns: it.columns.map((rows) => ({ _type: 'navColumn', _key: key(), items: rows.map(toRow) })) }
    : {}),
})

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
    })
  } else {
    const { getCliClient } = require('sanity/cli')
    client = getCliClient()
  }

  const doc = {
    _id: DOC_ID,
    _type: 'siteNavigation',
    title: 'Site Navigation',
    items: NAV.map(toNavItem),
  }

  if (REPLACE) {
    await client.createOrReplace(doc)
    console.log('Replaced Site Navigation with the Earn Figma menu.')
    return
  }

  const existing = await client.fetch(`*[_id == $id][0]._id`, { id: DOC_ID })
  if (existing) {
    console.log('Site Navigation already exists — skipped (no changes). Use --replace to overwrite.')
    return
  }

  await client.create(doc)
  console.log('Created Site Navigation with the Earn Figma menu.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
