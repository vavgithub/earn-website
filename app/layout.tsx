import type { Metadata, Viewport } from 'next'
import { connection } from 'next/server'
import { draftMode } from 'next/headers'
import VisualEditingBridge from '@/components/VisualEditing'
import { GlobalHeadSnippet } from '@/components/website/GlobalHeadSnippet'
import { WebsiteAnalytics } from '@/components/website/WebsiteAnalytics'
import { getCachedSiteSettings } from '@/sanity/lib/siteSettingsData'

export const metadata: Metadata = {
  title: 'Earn',
  description: 'Earn',
  manifest: '/assets/favicon/site.webmanifest',
  icons: {
    icon: [
      { url: '/assets/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/assets/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/assets/favicon/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await connection()
  const { isEnabled: isDraft } = await draftMode()
  const { settings: siteSettings } = await getCachedSiteSettings()
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/assets/css/tailwind.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans:wght@600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="m-0 font-inter text-earn-work bg-earn-paper flex flex-col min-h-screen overflow-x-hidden">
        <WebsiteAnalytics />
        <GlobalHeadSnippet html={siteSettings?.globalHeadSnippet} />
        {children}
        {isDraft ? <VisualEditingBridge /> : null}
      </body>
    </html>
  )
}
