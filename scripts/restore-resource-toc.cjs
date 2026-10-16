/**
 * Restores table of contents ONLY for resourceItem docs (from ResourcesBody.tsx).
 * Does not change modal body sections, hero copy, or card fields.
 *
 * Usage: npm run restore:resource-toc
 * Requires SANITY_API_WRITE_TOKEN in .env.local (or Sanity CLI login).
 */
require('dotenv').config({ path: '.env.local' })
require('dotenv').config()

const fs = require('fs')
const path = require('path')
const { createClient } = require('@sanity/client')

const ROOT = path.join(__dirname, '..')
const BODY_PATH = path.join(ROOT, 'components', 'page-bodies', 'ResourcesBody.tsx')

const MODAL_IDS = [
  'governance-1',
  'qet',
  'low-carbon-qet',
  'ethanol-qet',
  'ccs-qet',
  'sol-qet',
  'rng-qet',
  'transport-distances',
  'dynamic-allocation-pipeline',
  'qet-elec',
  'guide-1',
  'guide-2',
  'guide-3',
]

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
}

function jsxInnerText(raw) {
  if (!raw) return ''
  let t = raw
  t = t.replace(/<br\s*\/?>/gi, '\n')
  t = t.replace(/<[^>]+>/g, ' ')
  t = t.replace(/\{['"]\s*['"]\}/g, ' ')
  t = t.replace(/\{`([\s\S]*?)`\}/g, '$1')
  t = t.replace(/\{([^}]+)\}/g, (_, inner) => {
    const m = inner.match(/^['"]([\s\S]*)['"]$/)
    return m ? m[1] : ' '
  })
  t = decodeEntities(t)
  return t
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')
    .trim()
}

function extractDialog(source, modalId) {
  const openRe = new RegExp(`<dialog\\s+[^>]*id="${modalId}"[\\s\\S]*?>`, 'm')
  const openMatch = openRe.exec(source)
  if (!openMatch) return null
  const start = openMatch.index
  const closeIdx = source.indexOf('</dialog>', start)
  if (closeIdx < 0) return null
  return source.slice(start, closeIdx + '</dialog>'.length)
}

function extractTableOfContents(chunk) {
  const contentsIdx = chunk.search(/>\s*Contents\s*</i)
  if (contentsIdx < 0) return []
  const after = chunk.slice(contentsIdx)
  const olMatch = after.match(/<ol[^>]*>([\s\S]*?)<\/ol>/i)
  if (!olMatch) return []
  const entries = []
  const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi
  let m
  while ((m = liRe.exec(olMatch[1]))) {
    const spans = [...m[1].matchAll(/<span[^>]*>([\s\S]*?)<\/span>/gi)].map((s) => jsxInnerText(s[1]))
    if (!spans[0]) continue
    entries.push({ label: spans[0], page: spans[1] || '' })
  }
  return entries
}

function entriesToText(entries) {
  return entries
    .map((e) => {
      const label = e.label.trim()
      const page = (e.page || '').trim()
      return page ? `${label} | ${page}` : label
    })
    .join('\n')
}

function createClientFromEnv() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  if (!projectId) {
    throw new Error(
      'Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Refusing to run so this cannot write to another Sanity project.',
    )
  }
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const token =
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_AUTH_TOKEN ||
    process.env.SANITY_API_TOKEN

  if (token) {
    return createClient({
      projectId,
      dataset,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-04-22',
      token,
      useCdn: false,
    })
  }
  const { getCliClient } = require('sanity/cli')
  return getCliClient()
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const source = fs.readFileSync(BODY_PATH, 'utf8')
  const client = createClientFromEnv()

  let restored = 0
  let skipped = 0

  for (const modalId of MODAL_IDS) {
    const chunk = extractDialog(source, modalId)
    if (!chunk) {
      console.warn(`Skip (no dialog in ResourcesBody): ${modalId}`)
      skipped++
      continue
    }

    const entries = extractTableOfContents(chunk)
    if (!entries.length) {
      console.warn(`Skip (no TOC in ResourcesBody): ${modalId}`)
      skipped++
      continue
    }

    const docIds = await client.fetch(
      `*[_type == "resourceItem" && modalId.current == $modalId]._id`,
      { modalId },
    )
    if (!docIds?.length) {
      console.warn(`Skip (no Sanity doc): ${modalId}`)
      skipped++
      continue
    }

    const tableOfContentsText = entriesToText(entries)

    if (dryRun) {
      console.log(`[dry-run] ${modalId}: ${entries.length} chapters (${docIds.length} doc(s))`)
      restored++
      continue
    }

    for (const docId of docIds) {
      await client
        .patch(docId)
        .set({ tableOfContentsText })
        .unset(['tableOfContents'])
        .commit()
    }

    console.log(
      `  Restored TOC: ${modalId} (${entries.length} chapters, ${docIds.length} doc(s))`,
    )
    restored++
  }

  console.log(
    `\nDone. ${restored} updated, ${skipped} skipped.` +
      (dryRun ? ' (dry run — no writes)' : ' Refresh Studio and /resources modals.'),
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
