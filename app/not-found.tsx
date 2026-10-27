import Link from 'next/link'
import type { Metadata } from 'next'
import { WebsiteChrome } from '@/components/website/WebsiteChrome'

export const metadata: Metadata = {
  title: 'Earn | Page Not Found',
}

export default async function NotFound() {
  return (
    <WebsiteChrome>
      <div className="min-h-screen bg-earn-work">
        <div className="max-w-content mx-auto px-6 py-20 md:px-10">
          <h1 className="text-7xl md:text-8xl leading-none text-earn-paper font-plex-sans font-bold">
            404
          </h1>
          <p className="text-4xl md:text-5xl leading-tight text-earn-paper font-plex-sans font-normal mb-12">
            Page Not Found
          </p>
          <p className="text-base md:text-2xl leading-normal text-earn-paper font-inter font-normal mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <p className="text-base md:text-2xl leading-normal text-earn-paper font-inter font-normal mb-6">
            If you typed the URL manually, check for errors.
            <br />
            Otherwise, return to the homepage.
          </p>
          <Link
            href="/"
            className="inline-block border border-earn-paper bg-transparent text-earn-paper text-base md:text-xl leading-normal font-plex-sans font-medium py-2 md:py-3.5 px-5 md:px-9 rounded-full transition-colors duration-200 hover:bg-earn-paper hover:text-earn-work"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </WebsiteChrome>
  )
}
