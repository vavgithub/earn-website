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
      <div className="bg-earn-med-slate">
        <section className="max-w-content mx-auto w-full px-5 md:px-10 lg:px-4 pt-15 pb-15 md:pt-25 xxl:pt-30">
          <h1 className="m-0 font-outfit text-resource-title font-medium text-earn-paper">
            Resources
          </h1>
        </section>

        <section className="w-full">
          <div className="max-w-content mx-auto w-full px-5 pb-0 md:px-10 lg:px-4">
            <BlogsIndexFeatured {...blogProps} />
          </div>
        </section>
      </div>

      <section className="bg-earn-med-slate w-full pt-25 xxl:pt-30">
        {useCmsTabs ? (
          <ResourcesCmsTabs
            tabs={resourcesHub!.tabs}
            items={resourcesHub!.items}
            newsInsightsPanel={<BlogsIndexTabPanel {...blogProps} />}
          />
        ) : (
          <div className="max-w-content mx-auto w-full px-5 md:px-10 lg:px-4">
            <BlogsIndexTabPanel {...blogProps} />
          </div>
        )}
      </section>
    </div>
  )
}
