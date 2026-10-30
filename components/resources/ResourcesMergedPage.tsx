import {
  BlogsIndexFeatured,
  BlogsIndexTabPanel,
  type BlogIndexProps,
} from '@/components/blogs/BlogsIndex'
import { ResourcesCmsTabs } from '@/components/resources/ResourcesCmsTabs'
import type { ResourcesHubData } from '@/types/resources'

type Props = BlogIndexProps & {
  resourcesHub?: ResourcesHubData | null
}

/** Merged /resources: featured + News & Insights (Sanity) + CMS resource tabs. */
export function ResourcesMergedPage({ resourcesHub, ...blogProps }: Props) {
  const useCmsTabs = (resourcesHub?.tabs?.length ?? 0) > 0

  return (
    <div className="min-h-screen bg-earn-work text-earn-paper">
      <section className="max-w-content mx-auto w-full px-5 md:px-10 lg:px-[100px] pt-10 md:pt-16 pb-3 md:pb-4">
        <h1 className="m-0 font-plex-sans text-ecosystem-mobile font-semibold text-earn-paper md:text-ecosystem">
          Resources
        </h1>
      </section>

      <section className="bg-earn-work w-full">
        <div className="max-w-content mx-auto w-full px-5 pt-10 pb-0 md:px-10 md:pt-14 lg:px-[100px] lg:pt-16">
          <BlogsIndexFeatured {...blogProps} />
        </div>
        {useCmsTabs ? (
          <ResourcesCmsTabs
            tabs={resourcesHub!.tabs}
            items={resourcesHub!.items}
            newsInsightsPanel={<BlogsIndexTabPanel {...blogProps} />}
          />
        ) : (
          <div className="max-w-content mx-auto w-full px-5 md:px-10 lg:px-[100px]">
            <BlogsIndexTabPanel {...blogProps} />
          </div>
        )}
      </section>
    </div>
  )
}
