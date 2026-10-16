/**
 * One-time seed: default blog categories matching the /blogs Figma tabs.
 * "All" is not a document — it is only a UI filter on the site.
 *
 * Usage (requires write token):
 *   Set SANITY_API_WRITE_TOKEN in .env.local (or pass env), then:
 *   npm run seed:blog-categories
 */
require('dotenv').config({ path: '.env.local' })
require('dotenv').config()

const { createClient } = require('@sanity/client')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_AUTH_TOKEN ||
  process.env.SANITY_API_TOKEN

const CATEGORIES = [
  { title: 'News', slug: 'news', sortOrder: 10 },
  { title: 'Analysis & Insights', slug: 'analysis-insights', sortOrder: 20 },
  { title: 'Press Releases', slug: 'press-releases', sortOrder: 30 },
]

async function main() {
  if (!projectId) {
    console.error(
      'Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Refusing to run so this cannot write to another Sanity project.',
    )
    process.exit(1)
  }

  if (!token) {
    console.error(
      'Missing SANITY_API_WRITE_TOKEN (or SANITY_AUTH_TOKEN). Add it to .env.local with Editor permissions, then re-run.',
    )
    process.exit(1)
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-04-22',
    token,
    useCdn: false,
  })

  for (const cat of CATEGORIES) {
    const existing = await client.fetch(
      `*[_type == "blogCategory" && slug.current == $slug][0]._id`,
      { slug: cat.slug },
    )
    if (existing) {
      console.log(`Skip (exists): ${cat.slug}`)
      continue
    }
    await client.create({
      _type: 'blogCategory',
      title: cat.title,
      slug: { _type: 'slug', current: cat.slug },
      sortOrder: cat.sortOrder,
    })
    console.log(`Created: ${cat.title} (${cat.slug})`)
  }

  console.log('Done.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
