import {
  DocumentTextIcon,
  EnvelopeIcon,
  ListIcon,
  StarIcon,
  TagsIcon,
  ThListIcon,
} from '@sanity/icons'
import type { ConfigContext } from 'sanity'
import type { StructureBuilder } from 'sanity/structure'

import { orderableDocumentListDeskItemFixed } from './orderableDocumentListDeskItemFixed'

type ResourceTabRow = {
  _id: string
  title: string
  tabKey: string
  tabHash: string | null
}

/** News & Insights tab on /resources (blog posts, featured hero, filters). */
export function buildNewsInsightsDeskItems(S: StructureBuilder, context: ConfigContext) {
  return [
    orderableDocumentListDeskItemFixed({
      type: 'blogPost',
      title: 'All articles',
      id: 'blog-posts',
      icon: DocumentTextIcon,
      S,
      context,
    }),
    S.listItem()
      .title('Featured resource (hero)')
      .id('blog-settings')
      .icon(StarIcon)
      .schemaType('blogSettings')
      .child(
        S.document()
          .schemaType('blogSettings')
          .documentId('blogSettings')
          .title('Featured resource (hero)'),
      ),
    S.listItem()
      .title('Categories (All, Analysis, News, …)')
      .id('blog-categories')
      .icon(ListIcon)
      .schemaType('blogCategory')
      .child(S.documentTypeList('blogCategory').title('News & Insights categories')),
    S.listItem()
      .title('Tags')
      .id('blog-tags')
      .icon(TagsIcon)
      .schemaType('blogTag')
      .child(S.documentTypeList('blogTag').title('News & Insights tags')),
  ]
}

async function buildResourceTabsAndCardsDeskItems(
  S: StructureBuilder,
  context: ConfigContext,
  apiVersion: string,
) {
  const client = context.getClient({ apiVersion })
  const tabs = await client.fetch<ResourceTabRow[]>(
    `*[_type == "resourceTab"] | order(orderRank) {
      _id,
      title,
      tabKey,
      "tabHash": tabHash.current
    }`,
  )

  const cardsByTab =
    tabs.length > 0
      ? tabs.map((tab) => {
          const hashLabel = tab.tabHash ? `#${tab.tabHash}` : tab.tabKey
          return orderableDocumentListDeskItemFixed({
            type: 'resourceItem',
            title: `${tab.title} (${hashLabel})`,
            id: `resource-items-${tab.tabKey}`,
            icon: DocumentTextIcon,
            filter: '_type == "resourceItem" && tab._ref == $tabId',
            params: { tabId: tab._id },
            createIntent: false,
            menuItems: [
              S.menuItem()
                .title(`Add card to ${tab.title}`)
                .icon(DocumentTextIcon)
                .intent({
                  type: 'create',
                  params: {
                    type: 'resourceItem',
                    template: 'resourceItem-for-tab',
                    tabId: tab._id,
                  },
                })
                .serialize(),
            ],
            S,
            context,
          })
        })
      : [
          S.listItem()
            .title('No tabs yet — create tabs first')
            .id('resource-items-no-tabs')
            .child(S.documentTypeList('resourceTab').title('Tabs')),
        ]

  const tabOrderList = (id: string, title: string) =>
    orderableDocumentListDeskItemFixed({
      type: 'resourceTab',
      title,
      id,
      icon: ThListIcon,
      S,
      context,
    })

  const hubspotSettingsId = await client.fetch<string | null>(
    `*[_type == "resourcesHubSpotSettings"] | order(_updatedAt desc)[0]._id`,
  )

  const hubspotItem = S.listItem()
    .title('HubSpot form IDs')
    .id('resources-hubspot-settings')
    .icon(EnvelopeIcon)
    .child(
      S.document()
        .schemaType('resourcesHubSpotSettings')
        .documentId(hubspotSettingsId ?? 'resourcesHubSpotSettings')
        .title('HubSpot form IDs'),
    )

  return [
    S.listItem()
      .title('Resource tabs (Governance, Methodologies…)')
      .id('resource-cards-by-tab')
      .icon(ThListIcon)
      .child(
        S.list()
          .title('Resource tabs')
          .items([
            tabOrderList('resource-tabs', 'Tab order — drag to reorder'),
            S.divider(),
            ...cardsByTab,
            S.divider(),
            hubspotItem,
          ]),
      ),
  ]
}

/** Full /resources page: News & Insights + governance/methodology tabs & cards. */
export async function buildResourcesPageDeskItems(
  S: StructureBuilder,
  context: ConfigContext,
  apiVersion: string,
) {
  return [
    S.listItem()
      .title('News & Insights')
      .id('resources-news-insights')
      .icon(DocumentTextIcon)
      .child(
        S.list()
          .title('News & Insights')
          .items(buildNewsInsightsDeskItems(S, context)),
      ),
    S.divider(),
    ...(await buildResourceTabsAndCardsDeskItems(S, context, apiVersion)),
  ]
}

/** @deprecated Use buildResourcesPageDeskItems */
export async function buildResourcesDeskItems(
  S: StructureBuilder,
  context: ConfigContext,
  apiVersion: string,
) {
  return buildResourcesPageDeskItems(S, context, apiVersion)
}
