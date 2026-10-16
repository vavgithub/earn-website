/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...index]]\page.tsx` route
 */

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { defineDocuments, presentationTool } from "sanity/presentation";
import {
  ComposeIcon,
  DocumentsIcon,
  MenuIcon,
  EarthGlobeIcon,
  CodeIcon,
  ThListIcon,
  BellIcon,
} from "@sanity/icons";

import {
  apiVersion,
  dataset,
  presentationAllowOrigins,
  projectId,
  sitePreviewOrigin,
} from "./sanity/env";
import { buildResourcesPageDeskItems } from "./sanity/desk/resourcesDeskStructure";
import { resourceItemForTabTemplate } from "./sanity/lib/resourceItemTemplate";
import { PresentationPreviewHeader } from "./sanity/presentation/PresentationPreviewHeader";
import { presentationLocations } from "./sanity/presentation/presentationLocations";
import { schema } from "./sanity/schema";
import "./sanity/studio/textColorPairFieldsets.css";
import StudioLayout from "./sanity/studio/StudioLayout";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  studio: {
    components: {
      layout: StudioLayout,
    },
  },
  // Content Releases (Enterprise); hide tab when not used — https://www.sanity.io/docs/studio/content-releases-configuration
  releases: {
    enabled: false,
  },
  // Scheduled drafts (Growth+); hide when not used — https://www.sanity.io/docs/studio/scheduled-drafts
  scheduledDrafts: {
    enabled: false,
  },
  // Add and edit the content schema in the './sanity/schema' folder
  schema: {
    types: schema.types,
    templates: (prev) => [
      ...prev.filter((template) => template.schemaType !== "siteNotificationBar"),
      resourceItemForTabTemplate,
    ],
  },
  plugins: [
    // Structure first: with Presentation first, some setups never finish loading document lists.
    structureTool({
      structure: async (S, context) => {
        const client = context.getClient({ apiVersion });
        /** Prefer the document that actually has nav rows (handles early “wrong” _id docs). */
        const siteNavId = await client.fetch<string | null>(
          `*[_type == "siteNavigation"] | order(length(items) desc, _updatedAt desc)[0]._id`,
        );
        const siteNavDocumentId = siteNavId ?? "siteNavigation";

        const siteFooterId = await client.fetch<string | null>(
          `*[_type == "siteFooter"] | order(_updatedAt desc)[0]._id`,
        );
        const siteFooterDocumentId = siteFooterId ?? "siteFooter";

        const siteSettingsId = await client.fetch<string | null>(
          `*[_type == "siteSettings"] | order(_updatedAt desc)[0]._id`,
        );
        const siteSettingsDocumentId = siteSettingsId ?? "siteSettings";

        return S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site")
              .id("site-section")
              .icon(EarthGlobeIcon)
              .child(
                S.list()
                  .title("Site")
                  .items([
                    S.listItem()
                      .title("Site navigation")
                      .id("site-navigation")
                      .icon(MenuIcon)
                      .schemaType("siteNavigation")
                      .child(
                        S.document()
                          .schemaType("siteNavigation")
                          .documentId(siteNavDocumentId)
                          .title("Site navigation"),
                      ),
                    S.listItem()
                      .title("Site footer")
                      .id("site-footer")
                      .icon(ComposeIcon)
                      .schemaType("siteFooter")
                      .child(
                        S.document()
                          .schemaType("siteFooter")
                          .documentId(siteFooterDocumentId)
                          .title("Site footer"),
                      ),
                    S.listItem()
                      .title("Sitewide Notification Bar")
                      .id("site-notification-bar")
                      .icon(BellIcon)
                      .child(
                        S.document()
                          .schemaType("siteNotificationBar")
                          .documentId("siteNotificationBar")
                          .title("Sitewide Notification Bar"),
                      ),
                    S.listItem()
                      .title("Global head tags")
                      .id("global-head-tags")
                      .icon(CodeIcon)
                      .schemaType("siteSettings")
                      .child(
                        S.document()
                          .schemaType("siteSettings")
                          .documentId(siteSettingsDocumentId)
                          .title("Global head tags"),
                      ),
                  ]),
              ),
            S.listItem()
              .title("Resources")
              .id("resources-section")
              .icon(ThListIcon)
              .child(
                S.list()
                  .title("Resources (/resources page)")
                  .items(await buildResourcesPageDeskItems(S, context, apiVersion)),
              ),
            S.listItem()
              .title("Pages")
              .id("site-pages")
              .icon(DocumentsIcon)
              .schemaType("page")
              .child(S.documentTypeList("page").title("Pages")),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) =>
                Boolean(listItem.getId()) &&
                ![
                  "blogPost",
                  "page",
                  "post",
                  "siteNavigation",
                  "siteFooter",
                  "siteSettings",
                  "blogCategory",
                  "blogTag",
                  "blogSettings",
                  "resourceTab",
                  "resourceItem",
                  "resourcesHubSpotSettings",
                  "siteNotificationBar",
                ].includes(listItem.getId() || ""),
            ),
          ]);
      },
    }),
    presentationTool({
      previewUrl: {
        // Full URL (worked before 1179fbd). Do not split into deprecated `origin` + path — that broke the default preview route.
        initial: `${sitePreviewOrigin}/resources`,
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      allowOrigins: [...presentationAllowOrigins],
      components: {
        unstable_header: {
          component: PresentationPreviewHeader,
        },
      },
      resolve: {
        locations: presentationLocations,
        mainDocuments: defineDocuments([
          {
            route: "/resources",
            filter: `_type == "blogSettings" && _id == "blogSettings"`,
          },
          {
            route: "/resources/:slug",
            filter: `_type == "blogPost" && slug.current == $slug`,
          },
          {
            route: "/:slug",
            resolve: ({ params }) => ({
              filter: `_type == "page" && slug.current == $slug`,
              params: { slug: params.slug },
            }),
          },
        ]),
      },
    }),
  ],
});
