/**
 * Creates Resource HubSpot forms settings (singleton) if missing. Does not touch cards or content.
 * Usage: npm run seed:hubspot-settings
 */
require('dotenv').config({ path: '.env.local' })
require('dotenv').config()

const { createClient } = require('@sanity/client')

const DOC_ID = 'resourcesHubSpotSettings'

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

  const existing = await client.fetch(`*[_id == $id][0]._id`, { id: DOC_ID })
  if (existing) {
    console.log('Resource HubSpot settings already exist — skipped (no changes).')
    return
  }

  await client.create({
    _id: DOC_ID,
    _type: 'resourcesHubSpotSettings',
  })
  console.log('Created Resource HubSpot forms settings in Studio.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
