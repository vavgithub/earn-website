/**
 * Cookiebot rejects postMessage from http://localhost (Presentation preview).
 * Its uc.js logs "Ignoring Unsecure message event origin" repeatedly; Next.js dev
 * forwards those [browser] lines to the terminal. Harmless on production (HTTPS).
 */
export function sanitizeGlobalHeadForLocalDev(html: string): string {
  if (process.env.NODE_ENV !== 'development') return html

  return html
    .replace(
      /<script\b[^>]*\bsrc=["'][^"']*cookiebot\.com[^"']*["'][^>]*>\s*<\/script>/gi,
      '',
    )
    .replace(/<script\b[^>]*\bsrc=["'][^"']*cookiebot\.com[^"']*["'][^>]*\/?>/gi, '')
}
