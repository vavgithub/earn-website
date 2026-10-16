import { ResourcesMergedPage } from '@/components/resources/ResourcesMergedPage'
import { ResourcesHubSpotForms } from '@/components/resources/ResourcesHubSpotForms'
import { ResourcesHubSpotFormsLegacy } from '@/components/resources/ResourcesHubSpotFormsLegacy'
import { HashDialogManager } from '@/components/website/HashDialogManager'
import { ResourcesTabs } from '@/components/website/ResourcesTabs'
import { WebsiteChrome } from '@/components/website/WebsiteChrome'
import { getSanityForRequest } from '@/sanity/lib/liveClient'
import { blogIndexQuery } from '@/sanity/lib/blogListingQuery'
import { resourcesHubQuery } from '@/sanity/lib/resourcesQuery'
import type { ResourcesHubData } from '@/types/resources'
import { RESOURCES_INDEX_PATH } from '@/lib/resourcePaths'
import { canonicalUrl } from '@/lib/siteCanonical'
import { pageMetadata } from '@/lib/sitePageMetadata'
import type { Metadata } from 'next'

const description =
  'Methodologies, framework reporting guides (SBTi, CDP, TCR), case studies, and industry analysis on verified emissions data, QETs, and the EarnDLT registry.'

const socialDescription =
  'Methodologies, framework reporting guides (SBTi, CDP, TCR), case studies, governance documentation, and industry analysis on verified emissions data, Quantified Emissions Tokens (QETs), and the EarnDLT registry.'

const socialTitle = 'Earn Resources'

export const metadata: Metadata = pageMetadata(RESOURCES_INDEX_PATH, {
  title: 'Resources | Earn',
  description,
  openGraph: {
    type: 'website',
    siteName: 'Earn',
    locale: 'en_US',
    title: socialTitle,
    description: socialDescription,
    url: canonicalUrl(RESOURCES_INDEX_PATH),
  },
  twitter: {
    card: 'summary_large_image',
    site: '@earndlt',
    title: socialTitle,
    description: socialDescription,
  },
})

function resourcesJsonLd() {
  const pageUrl = canonicalUrl(RESOURCES_INDEX_PATH)
  const homeUrl = canonicalUrl('/')
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': pageUrl + '#webpage',
        url: pageUrl,
        name: socialTitle,
        description: socialDescription,
        isPartOf: { '@id': homeUrl + '#website' },
        inLanguage: 'en-US',
      },
      {
        '@type': 'WebSite',
        '@id': homeUrl + '#website',
        url: homeUrl,
        name: 'Earn',
        inLanguage: 'en-US',
      },
    ],
  }
}

/** Avoid ISR serving a non-draft page before Presentation sets the draft cookie. */
export const dynamic = 'force-dynamic'

type Search = { category?: string; tag?: string }

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const sp = await searchParams
  const categorySlug =
    typeof sp.category === 'string' && sp.category.trim() ? sp.category.trim() : null
  const tagSlug = typeof sp.tag === 'string' && sp.tag.trim() ? sp.tag.trim() : null

  const { isDraft, sanityClient } = await getSanityForRequest()

  let bundle: {
    settings: any
    categories: any[]
    tags: any[]
    posts: any[]
  } | null = null
  let resourcesHub: ResourcesHubData | null = null
  let fetchError: unknown = null

  const fetchOpts = isDraft ? { cache: 'no-store' as const } : { next: { revalidate: 60 } }

  try {
    const [blogBundle, hub] = await Promise.all([
      sanityClient.fetch(blogIndexQuery, {}, fetchOpts),
      sanityClient.fetch<ResourcesHubData>(resourcesHubQuery, {}, fetchOpts),
    ])
    bundle = blogBundle
    resourcesHub = hub
  } catch (err) {
    fetchError = err
  }

  const hasPosts = (bundle?.posts?.length ?? 0) > 0
  const useCmsResourceTabs = (resourcesHub?.tabs?.length ?? 0) > 0

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resourcesJsonLd()) }}
      />
      <WebsiteChrome>
      {fetchError ? (
        <div className="min-h-screen bg-[#fdfdfb] px-5 md:px-10 lg:px-[100px] py-20 max-w-content mx-auto">
          <div className="rounded-lg border border-red-100 bg-white p-8 md:p-10 text-center">
            <h2 className="font-mokoko text-2xl text-[#141d19] mb-3">Can’t load resources right now</h2>
            <p className="font-inter text-[#5b5f53] max-w-2xl mx-auto">
              We couldn’t reach Sanity from this dev server. This is usually a network, VPN, or firewall issue.
            </p>
            <p className="mt-6 text-sm text-[#7a7e70]">
              Try checking your connection, then restart <code className="font-mono text-[#141d19]">npm run dev</code>.
            </p>
          </div>
        </div>
      ) : !hasPosts ? (
        <>
          <div className="min-h-screen bg-[#fdfdfb]">
            <section className="max-w-content mx-auto w-full px-5 md:px-10 lg:px-[100px] pt-10 md:pt-16 pb-3 md:pb-4">
              <h1 className="font-mokoko font-medium text-[36px] leading-[38px] text-brand-red m-0">
                Resources
              </h1>
            </section>
            <p className="py-12 text-center font-inter text-[#5b5f53]">
              No articles yet. Add blog posts in Sanity Studio.
            </p>
          </div>
          <ResourcesTabs />
          <HashDialogManager />
          {useCmsResourceTabs ? (
            <ResourcesHubSpotForms
              items={resourcesHub?.items}
              hubspotSettings={resourcesHub?.hubspotSettings}
            />
          ) : (
            <ResourcesHubSpotFormsLegacy />
          )}
        </>
      ) : (
        <>
          <ResourcesMergedPage
            settings={bundle?.settings ?? null}
            categories={bundle?.categories ?? []}
            tags={bundle?.tags ?? []}
            posts={bundle?.posts ?? []}
            categorySlug={categorySlug}
            tagSlug={tagSlug}
            resourcesHub={resourcesHub}
          />
          <ResourcesTabs />
          <HashDialogManager />
          {useCmsResourceTabs ? (
            <ResourcesHubSpotForms
              items={resourcesHub?.items}
              hubspotSettings={resourcesHub?.hubspotSettings}
            />
          ) : (
            <ResourcesHubSpotFormsLegacy />
          )}
        </>
      )}
      </WebsiteChrome>
    </>
  )
}
