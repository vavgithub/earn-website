import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export const dynamic = 'force-dynamic'

const token = process.env.SANITY_API_READ_TOKEN?.trim()

const enableDraftGET = token
  ? defineEnableDraftMode({
      client: client.withConfig({ token, useCdn: false }),
    }).GET
  : null

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest: unknown }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  )
}

/**
 * Presentation calls this URL to turn on Next.js Draft Mode + preview cookies.
 * `next-sanity` validates the `sanity-preview-secret` using a tokenized client — without
 * `SANITY_API_READ_TOKEN` the handler cannot run (and Visual Editing will not connect).
 */
export async function GET(request: Request) {
  if (!enableDraftGET) {
    return new Response(
      [
        'Sanity draft mode is not configured on this server.',
        '',
        '1. Create an API token with Viewer role: https://www.sanity.io/manage → Project → API → Tokens',
        '2. Add SANITY_API_READ_TOKEN to your host (Vercel, Amplify env + amplify.yml .env.production, or .env.local)',
        '3. Redeploy / restart dev',
        '',
        'Also add this site origin in Sanity CORS with “Allow credentials”.',
      ].join('\n'),
      {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      },
    )
  }

  try {
    return await enableDraftGET(request)
  } catch (error) {
    // `redirect()` from `next/navigation` throws this — must propagate or the app breaks.
    if (isNextRedirect(error)) throw error

    console.error('[draft-mode/enable]', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        error: 'Draft mode enable failed',
        message,
        hint:
          'Common fixes: trim SANITY_API_READ_TOKEN in Vercel (no quotes/newlines); token must be Viewer for this project/dataset; redeploy after env changes.',
      },
      { status: 500 },
    )
  }
}
