/**
 * Seeds the resources page from the homepage insight cards.
 * One featured article, plus the same three cards in the list below.
 * Re-running replaces only these three articles and the featured pointer.
 *
 * Usage: npm run seed:resources
 */
require('dotenv').config({ path: '.env.local', quiet: true })
require('dotenv').config({ quiet: true })

const fs = require('fs')
const path = require('path')
const { createClient } = require('@sanity/client')

const SETTINGS_ID = 'blogSettings'
const FEATURED_ID = 'blogPost-hyperscalers'

const LEGACY_IDS = [
  'blogPost.hyperscalers',
  'blogPost.eu-methane',
  'blogPost.verified-records',
  'blogCategory.market-analysis',
  'blogCategory.regulatory-deep-dive',
  'blogCategory.methodology',
]

const CATEGORIES = [
  { _id: 'blogCategory-market-analysis', title: 'Market Analysis', slug: 'market-analysis', sortOrder: 10 },
  {
    _id: 'blogCategory-regulatory-deep-dive',
    title: 'Regulatory Deep Dive',
    slug: 'regulatory-deep-dive',
    sortOrder: 20,
  },
  { _id: 'blogCategory-methodology', title: 'Methodology', slug: 'methodology', sortOrder: 30 },
]

const ARTICLES = [
  {
    _id: FEATURED_ID,
    slug: 'hyperscalers-need-energy',
    title: 'Hyperscalers need energy. They also need the data.',
    categoryId: 'blogCategory-market-analysis',
    image: '/assets/images/reading/datacenter.png',
    imageAlt: 'Industrial cooling towers and energy infrastructure',
    excerpt:
      'How differing buyer requirements are creating a new interoperability challenge for energy producers.',
    orderRank: '0|10000o:',
    publishedAt: '2026-10-28T12:00:00.000Z',
  },
  {
    _id: 'blogPost-eu-methane',
    slug: 'eu-methane-regulation-importers',
    title: 'What the EU Methane Regulation actually requires of importers.',
    categoryId: 'blogCategory-regulatory-deep-dive',
    image: '/assets/images/reading/processing.png',
    imageAlt: 'Aerial view of an energy processing facility at night',
    excerpt:
      'From 1 January 2027, importers must supply verified methane data. How trace and claim, certification, and OGMP 2.0 reporting reshape the verification infrastructure needed to sell into Europe.',
    orderRank: '0|100014:',
    publishedAt: '2026-10-29T12:00:00.000Z',
  },
  {
    _id: 'blogPost-verified-records',
    slug: 'how-verified-records-hold-up-under-audit',
    title: 'How verified records hold up under audit.',
    categoryId: 'blogCategory-methodology',
    image: '/assets/images/reading/methodology.png',
    imageAlt: 'Earn mark on a blue field',
    excerpt:
      'Explore the methodologies, verification requirements, versioning, and governance rules behind EarnDLT records.',
    orderRank: '0|10001k:',
    publishedAt: '2026-10-30T12:00:00.000Z',
  },
]

let keySeq = 0
const key = () => `res${(keySeq++).toString(36).padStart(4, '0')}`

function imagePath(publicPath) {
  return path.join(process.cwd(), 'public', publicPath.replace(/^\//, ''))
}

async function uploadImage(client, publicPath) {
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
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  }
}

function paragraph(text) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }
}

function articleBlocks(article, image) {
  return [
    {
      _type: 'imageBlock',
      _key: key(),
      image,
      alt: article.imageAlt,
      aspectRatio: '16:9',
      objectFit: 'cover',
      objectPosition: 'center',
      sectionBackground: 'offWhite',
    },
    {
      _type: 'richTextSection',
      _key: key(),
      eyebrow: CATEGORIES.find((category) => category._id === article.categoryId).title,
      eyebrowColor: 'brightYellow',
      sectionHeading: article.title,
      sectionHeadingLevel: 'h1',
      sectionHeadingColor: 'darkSlate',
      content: [paragraph(article.excerpt)],
      contentTextColor: 'grey',
      alignment: 'left',
      sectionBackground: 'offWhite',
    },
  ]
}

async function ensureCategory(client, category) {
  const existingId = await client.fetch(
    `*[_type == "blogCategory" && slug.current == $slug && !(_id in $legacy)][0]._id`,
    { slug: category.slug, legacy: LEGACY_IDS },
  )
  if (existingId) {
    console.log(`Category exists: ${category.title}`)
    return existingId
  }

  await client.create({
    _id: category._id,
    _type: 'blogCategory',
    title: category.title,
    slug: { _type: 'slug', current: category.slug },
    sortOrder: category.sortOrder,
  })
  console.log(`Created category: ${category.title}`)
  return category._id
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN

  if (!projectId) {
    console.error(
      'Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Refusing to run so this cannot write to another Sanity project.',
    )
    process.exit(1)
  }

  if (!token) {
    console.error(
      'Missing SANITY_API_WRITE_TOKEN. Add it to .env.local with Editor permissions, then re-run.',
    )
    process.exit(1)
  }

  const client = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-04-22',
    token,
    useCdn: false,
  })

  for (const id of LEGACY_IDS) {
    await client.delete(id).catch(() => {})
  }

  const categoryIds = {}
  for (const category of CATEGORIES) {
    categoryIds[category._id] = await ensureCategory(client, category)
  }

  const images = {}
  for (const article of ARTICLES) {
    images[article.image] = images[article.image] || (await uploadImage(client, article.image))
  }

  for (const article of ARTICLES) {
    const image = images[article.image]
    await client.createOrReplace({
      _id: article._id,
      _type: 'blogPost',
      orderRank: article.orderRank,
      title: article.title,
      slug: { _type: 'slug', current: article.slug },
      category: { _type: 'reference', _ref: categoryIds[article.categoryId] },
      listingImage: image,
      listingExcerpt: article.excerpt,
      publishedAt: article.publishedAt,
      pageBuilder: articleBlocks(article, image),
    })
    console.log(`Saved article: ${article.title}`)
  }

  await client.createIfNotExists({
    _id: SETTINGS_ID,
    _type: 'blogSettings',
  })
  await client
    .patch(SETTINGS_ID)
    .set({
      featuredPost: { _type: 'reference', _ref: FEATURED_ID },
      defaultListingImage: images[ARTICLES[0].image],
    })
    .commit()
  console.log('Featured resource set to the hyperscalers article.')
  console.log('Done.')
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
