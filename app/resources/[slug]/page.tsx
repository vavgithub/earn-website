import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { BlogHeadInjector } from "@/components/blogs/BlogHeadInjector";
import { WebsiteChrome } from "@/components/website/WebsiteChrome";
import { resourcesArticlePath } from "@/lib/resourcePaths";
import { getCanonicalOrigin, resolveCanonicalUrl } from "@/lib/siteCanonical";
import { urlForImage } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
import { getCachedBlogPostPageData } from "@/sanity/lib/blogPostPageData";

export const revalidate = 60;

export async function generateStaticParams() {
  const query = `*[_type == "blogPost" && defined(slug.current)][]{
    "slug": slug.current
  }`;
  const posts = await client.fetch(query);

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { post, fetchError } = await getCachedBlogPostPageData(slug);

  if (fetchError) {
    return { title: "Resources" };
  }
  if (!post) {
    notFound();
  }

  let metadataBase: URL | undefined;
  try {
    metadataBase = new URL(getCanonicalOrigin());
  } catch {
    metadataBase = undefined;
  }

  const rawTitle = post.seo?.title || post.title || "Resources";
  const title = stegaClean(
    typeof rawTitle === "string" ? rawTitle : String(rawTitle),
  );

  const rawDesc = post.seo?.description || post.listingExcerpt;
  const description = rawDesc
    ? stegaClean(typeof rawDesc === "string" ? rawDesc : String(rawDesc))
    : undefined;

  const imageSource = post.seo?.ogImage || post.listingImage;
  const ogUrl = imageSource
    ? urlForImage(imageSource)?.width(1200).height(630).fit("crop").url()
    : undefined;

  const path = resourcesArticlePath(slug);

  const rawCanonical = post.seo?.canonicalUrl;
  const canonicalOverride = rawCanonical
    ? stegaClean(typeof rawCanonical === "string" ? rawCanonical : String(rawCanonical))
    : undefined;
  const canonical = resolveCanonicalUrl(path, canonicalOverride);

  return {
    title,
    description,
    ...(metadataBase ? { metadataBase } : {}),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      url: canonical,
      ...(ogUrl ? { images: [{ url: ogUrl, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: ogUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogUrl ? { images: [ogUrl] } : {}),
    },
  };
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  const { isDraft, studioBaseUrl, post, fetchError } =
    await getCachedBlogPostPageData(resolvedParams.slug);

  if (fetchError) {
    return (
      <article className="min-h-screen bg-[#FDFDFB] text-[#141d19]">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-4">
            Can’t load this article
          </h1>
          <p className="text-[#5b5f53] max-w-2xl mx-auto">
            We couldn’t reach Sanity from this server. Check your
            internet/VPN/firewall and try again.
          </p>
          <p className="text-xs text-[#7a7e70] mt-6 font-mono break-all">
            {String(fetchError?.message ?? fetchError)}
          </p>
        </div>
      </article>
    );
  }

  if (!post) {
    return notFound();
  }

  const headSnippet = post.seo?.headSnippet;

  return (
    <WebsiteChrome>
      {headSnippet?.trim() ? <BlogHeadInjector html={headSnippet} /> : null}
      <article className="min-h-screen bg-[#FDFDFB] text-[#141d19]">
        {post.pageBuilder && post.pageBuilder.length > 0 ? (
          <BlockRenderer
            blocks={post.pageBuilder}
            documentId={isDraft ? post._id : undefined}
            documentType={isDraft ? post._type : undefined}
            studioBaseUrl={studioBaseUrl}
          />
        ) : (
          <div className="container mx-auto px-4 py-20 text-center text-[#5b5f53]">
            This article has no content blocks yet.
          </div>
        )}
      </article>
    </WebsiteChrome>
  );
}
