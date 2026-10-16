import Script from 'next/script'

/**
 * Auth UI script — loaded once from the root layout on every route.
 *
 * Cookiebot + GA4 live in Sanity → Global head tags (`siteSettings.globalHeadSnippet`).
 */
export function WebsiteAnalytics() {
  return <Script src="/assets/js/auth.js" strategy="lazyOnload" />
}
