import { WebsiteChrome } from "@/components/website/WebsiteChrome";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getCachedHomepage } from "@/sanity/lib/cmsPagePageData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Page() {
  const { isDraft, studioBaseUrl, page, fetchError } = await getCachedHomepage();
  const blocks = page?.pageBuilder;
  const hasBlocks = !fetchError && Array.isArray(blocks) && blocks.length > 0;

  return (
    <WebsiteChrome>
      {hasBlocks ? (
        <BlockRenderer
          blocks={blocks as never[]}
          documentId={isDraft ? page?._id : undefined}
          documentType={isDraft ? page?._type : undefined}
          studioBaseUrl={studioBaseUrl}
        />
      ) : null}
    </WebsiteChrome>
  );
}
