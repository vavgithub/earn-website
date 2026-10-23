/**
 * Seeds the Site Footer singleton (`_id: siteFooter`) with the Earn Figma footer.
 * Skips if the document already exists, so Studio edits are never overwritten.
 * Pass --replace to overwrite it on purpose (Studio edits are lost).
 *
 * Usage: npm run seed:site-footer [-- --replace]
 *
 * `href: '#'` is a placeholder until real URLs exist; editors set them in Studio.
 * Copyright year is left empty so the site default applies.
 */
require('dotenv').config({ path: '.env.local' })
require('dotenv').config()

const { createClient } = require('@sanity/client')

const DOC_ID = 'siteFooter'
const REPLACE = process.argv.includes('--replace')

const links = (...labels) => labels.map((label) => ({ label, href: '#' }))
const group = (heading, linkLabels) => ({ heading, links: links(...linkLabels) })

const COLUMNS = [
  {
    heading: 'Solutions',
    groups: [
      group(undefined, [
        'Producers',
        'Midstream Operators',
        'Traders & Brokers',
        'LNG Importers',
        'Data Centers',
        'Sustainability\nand Reporting', // line break as in Figma
      ]),
    ],
  },
  {
    heading: 'Platform & Products',
    groups: [
      group('EarnDLT', ['Governed Infrastructure']),
      group('Energy Intelligence Graph', ['Gas-Day Traceability', 'Site Resilience Scoring']),
      group('Automation', ['Enterprise 10', 'Title Tokens']),
      group('Greentruth', ['QET Registry', 'QET Lookup', 'GasTrace', 'Project Registry', 'RNG Forwards']),
    ],
  },
  {
    heading: 'Resources',
    groups: [group(undefined, ['Insights & News', 'Governance Framework', 'API Documentation', 'MCP Documentation'])],
  },
  {
    heading: 'Company',
    groups: [group(undefined, ['About', 'Contact', 'Subscribe', 'Login', 'Privacy'])],
  },
]

/** Values carried over from the previous hardcoded footer. */
const SOCIAL_LINKS = [
  { platform: 'linkedin', url: 'https://www.linkedin.com/company/earndlt/' },
  { platform: 'x', url: 'https://x.com/earndlt/' },
]
const PHONE = '(+1) 877-905-EARN (3276)'
const COPYRIGHT_HOLDER = 'EarnDLT®'

/* ---- Map the readable data above to Sanity array members (_type + unique _key) ---- */

let keySeq = 0
const key = () => `ftr${(keySeq++).toString(36).padStart(4, '0')}`

const toColumn = (col) => ({
  _type: 'footerColumn',
  _key: key(),
  heading: col.heading,
  groups: col.groups.map((g) => ({
    _type: 'footerLinkGroup',
    _key: key(),
    ...(g.heading ? { heading: g.heading } : {}),
    links: g.links.map((l) => ({ _type: 'footerLink', _key: key(), label: l.label, href: l.href })),
  })),
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
    _type: 'siteFooter',
    title: 'Site Footer',
    columns: COLUMNS.map(toColumn),
    socialLinks: SOCIAL_LINKS.map((s) => ({ _type: 'footerSocialLink', _key: key(), ...s })),
    phone: PHONE,
    copyrightHolder: COPYRIGHT_HOLDER,
  }

  if (REPLACE) {
    await client.createOrReplace(doc)
    console.log('Replaced Site Footer with the Earn Figma footer.')
    return
  }

  const existing = await client.fetch(`*[_id == $id][0]._id`, { id: DOC_ID })
  if (existing) {
    console.log('Site Footer already exists — skipped (no changes). Use --replace to overwrite.')
    return
  }

  await client.create(doc)
  console.log('Created Site Footer with the Earn Figma footer.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
