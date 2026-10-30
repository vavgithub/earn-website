import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { stegaClean } from 'next-sanity'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import { BlogHeadInjector } from '@/components/blogs/BlogHeadInjector'
import { WebsiteChrome } from '@/components/website/WebsiteChrome'
import { client } from '@/sanity/lib/client'
import { getCachedCmsPageData } from '@/sanity/lib/cmsPagePageData'
import { getCanonicalOrigin, resolveCanonicalUrl } from '@/lib/siteCanonical'
import { urlForImage } from '@/sanity/lib/image'

export const revalidate = 60

export async function generateStaticParams() {
  const query = `*[_type == "page" && defined(slug.current)][]{
    "slug": slug.current
  }`
  const rows = await client.fetch(query)
  return rows
    .filter((row: { slug: string }) => row.slug !== 'home')
    .map((row: { slug: string }) => ({ slug: row.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  if (slug === 'home') {
    notFound()
  }
  const { page, fetchError } = await getCachedCmsPageData(slug)

  if (fetchError) {
    return { title: 'Page' }
  }
  if (!page) {
    notFound()
  }

  let metadataBase: URL | undefined
  try {
    metadataBase = new URL(getCanonicalOrigin())
  } catch {
    metadataBase = undefined
  }

  const rawTitle = page.seo?.title || page.title || 'Page'
  const title = stegaClean(typeof rawTitle === 'string' ? rawTitle : String(rawTitle))

  const rawDesc = page.seo?.description
  const description = rawDesc
    ? stegaClean(typeof rawDesc === 'string' ? rawDesc : String(rawDesc))
    : undefined

  const rawCanonical = page.seo?.canonicalUrl
  const canonicalOverride = rawCanonical
    ? stegaClean(typeof rawCanonical === 'string' ? rawCanonical : String(rawCanonical))
    : undefined

  const ogUrl = page.seo?.ogImage
    ? urlForImage(page.seo.ogImage)?.width(1200).height(630).fit('crop').url()
    : undefined

  const path = `/${slug}`
  const canonical = resolveCanonicalUrl(path, canonicalOverride)

  return {
    title,
    description,
    ...(metadataBase ? { metadataBase } : {}),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      ...(ogUrl ? { images: [{ url: ogUrl, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: ogUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(ogUrl ? { images: [ogUrl] } : {}),
    },
  }
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (slug === 'home') {
    notFound()
  }
  const { isDraft, studioBaseUrl, page, fetchError } = await getCachedCmsPageData(slug)

  if (fetchError) {
    return (
      <main className="min-h-screen bg-earn-paper">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Can’t load this page</h1>
          <p className="text-gray-600">We couldn’t reach Sanity. Check your connection and try again.</p>
        </div>
      </main>
    )
  }

  if (!page) {
    notFound()
  }

  const headSnippet = page.seo?.headSnippet

  return (
    <WebsiteChrome>
      {headSnippet?.trim() ? <BlogHeadInjector html={headSnippet} /> : null}
      <div className="min-h-screen bg-earn-paper">
        {page.pageBuilder && page.pageBuilder.length > 0 ? (
          <BlockRenderer
            blocks={page.pageBuilder as any[]}
            documentId={isDraft ? page._id : undefined}
            documentType={isDraft ? page._type : undefined}
            studioBaseUrl={studioBaseUrl}
          />
        ) : (
          <div className="container mx-auto px-4 py-20 text-center text-gray-500">
            This page has no content blocks yet.
          </div>
        )}
      </div>
    </WebsiteChrome>
  )
}
