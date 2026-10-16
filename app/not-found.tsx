import Link from 'next/link'
import type { Metadata } from 'next'
import { WebsiteChrome } from '@/components/website/WebsiteChrome'

export const metadata: Metadata = {
  title: 'Earn | Page Not Found',
}

/** Mirrors the main block from legacy `public/legacy/404.html` (pre-migration static page). */
export default async function NotFound() {
  return (
    <WebsiteChrome>
      <main className="min-h-screen pt-[60px] md:pt-[130px] bg-[#141d19]">
        <div className="max-w-content mx-auto px-5 md:px-10 lg:px-[100px]">
          <h1 className="text-[72px] md:text-[96px] leading-[96px] text-[#FF7E6C] font-mokoko font-bold">
            404
          </h1>
          <p className="text-[36px] md:text-[48px] leading-[40px] md:leading-[52px] text-[#FF7E6C] font-mokoko font-normal mb-[48px]">
            Page Not Found
          </p>
          <p className="text-[16px] md:text-[24px] leading-[24px] md:leading-[32px] text-[#A4DEC2] font-inter font-normal mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <p className="text-[16px] md:text-[24px] leading-[24px] md:leading-[32px] text-[#A4DEC2] font-inter font-normal mb-6">
            If you typed the URL manually, check for errors.
            <br />
            Otherwise, return to the homepage.
          </p>
          <Link
            href="/"
            className="bg-[#155C3A] inline-block text-white text-[16px] md:text-[20px] leading-[24px] md:leading-[20px] font-mokoko font-medium py-2 md:py-[14px] px-5 md:px-9 rounded-full transition-colors duration-200 w-auto"
          >
            Go to Homepage
          </Link>
        </div>
      </main>
    </WebsiteChrome>
  )
}
