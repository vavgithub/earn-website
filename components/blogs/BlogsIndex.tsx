import Image from 'next/image'
import Link from 'next/link'
import { stegaClean } from 'next-sanity'
import { ButtonLink } from '@/components/ui/Button'
import {
  buildResourcesIndexHref,
  resourcesArticlePath,
} from '@/lib/resourcePaths'
import { urlForImage } from '@/sanity/lib/image'

/** When no Sanity image is available (post + site default). */
export const BLOG_LISTING_PLACEHOLDER_SRC = '/assets/images/resources/blog-default-listing.jpg'

export { buildResourcesIndexHref, buildResourcesIndexHref as buildBlogsIndexHref } from '@/lib/resourcePaths'

function clean(s: unknown) {
  return stegaClean(typeof s === 'string' ? s : String(s ?? ''))
}

function imageUrlFromSanity(source: unknown): string | null {
  if (!source) return null
  try {
    return urlForImage(source)?.url() ?? null
  } catch {
    return null
  }
}

export function resolveListingImageUrl(
  thumbnail: unknown,
  defaultListingImage: unknown,
): string {
  return (
    imageUrlFromSanity(thumbnail) ??
    imageUrlFromSanity(defaultListingImage) ??
    BLOG_LISTING_PLACEHOLDER_SRC
  )
}

type RefSlug = { title?: string; slug?: string } | null

export type BlogIndexPost = {
  _id: string
  title?: string
  slug?: string
  publishedAt?: string
  excerpt?: string
  category?: RefSlug
  tags?: RefSlug[]
  thumbnail?: unknown
}

export type BlogIndexProps = {
  settings: {
    featuredPost?: BlogIndexPost | null
    defaultListingImage?: unknown
  } | null
  categories: { _id: string; title?: string; slug?: string }[]
  tags: { _id: string; title?: string; slug?: string }[]
  posts: BlogIndexPost[]
  categorySlug: string | null
  tagSlug: string | null
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Featured block above main tabs on /resources. */
export function BlogsIndexFeatured({
  settings,
}: Pick<BlogIndexProps, 'settings'>) {
  const defaultListingImage = settings?.defaultListingImage
  const featured = settings?.featuredPost ?? null

  if (!featured || !clean(featured.slug)) return null

  return (
    <article className="mb-12 md:mb-16 lg:mb-20">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-[60px]">
        <div className="flex-1 min-w-0 max-w-[640px]">
          <p className="m-0 mb-2 text-[20px] leading-6 font-semibold font-inter text-[#808080]">
            Featured Resource
          </p>
          <h2
            className={`m-0 font-mokoko font-medium text-[22px] md:text-[26px] leading-7 md:leading-8 text-[#1a1a1a] ${
              featured.excerpt ? 'mb-12' : 'mb-6'
            }`}
          >
            {clean(featured.title)}
          </h2>
          {featured.excerpt && (
            <p className="m-0 mb-6 max-w-[400px] font-inter text-base leading-6 text-[#141d19] whitespace-pre-wrap">
              {clean(featured.excerpt)}
            </p>
          )}
          <ButtonLink
            href={resourcesArticlePath(clean(featured.slug))}
            variant="outline"
            size="sm"
            shape="pill"
          >
            Read Now
          </ButtonLink>
        </div>
        <div className="flex-1 min-w-0 w-full lg:max-w-[592px]">
          <div className="relative w-full aspect-[592/400] min-h-[220px] rounded-lg overflow-hidden bg-[#d4d4c4]">
            <Image
              src={resolveListingImageUrl(featured.thumbnail, defaultListingImage)}
              alt={clean(featured.title)}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 592px"
              priority
            />
          </div>
        </div>
      </div>
    </article>
  )
}

/** Category links, tag chips, and article grid inside the News & Insights tab. */
export function BlogsIndexTabPanel({
  settings,
  categories,
  tags,
  posts,
  categorySlug,
  tagSlug,
}: BlogIndexProps) {
  const defaultListingImage = settings?.defaultListingImage

  const filtered = posts.filter((p) => {
    if (categorySlug && clean(p.category?.slug) !== categorySlug) return false
    if (tagSlug) {
      const slugs = (p.tags ?? []).map((t) => clean(t?.slug))
      if (!slugs.includes(tagSlug)) return false
    }
    return true
  })

  return (
    <div className="pt-6 md:pt-8">
      <nav
        className="flex flex-wrap gap-x-10 md:gap-x-12 gap-y-3 mb-6 font-mokoko text-[20px] leading-5 text-[#5b5f53]"
        aria-label="Blog categories"
      >
        <Link
          href={buildResourcesIndexHref({ tag: tagSlug })}
          scroll={false}
          className={`hover:text-brand-red transition-colors ${!categorySlug ? 'text-brand-red' : ''}`}
        >
          All
        </Link>
        {categories.map((c) => {
          const slug = clean(c.slug)
          const active = categorySlug === slug
          return (
            <Link
              key={c._id}
              href={buildResourcesIndexHref({ category: slug, tag: tagSlug })}
              scroll={false}
              className={`hover:text-brand-red transition-colors ${active ? 'text-brand-red' : ''}`}
            >
              {clean(c.title)}
            </Link>
          )
        })}
      </nav>

      <div className="h-px w-full bg-transparent mb-6" aria-hidden />

      <div
        className="flex flex-wrap gap-2.5 mb-12 font-inter text-base"
        role="toolbar"
        aria-label="Blog tags"
      >
        <Link
          href={buildResourcesIndexHref({ category: categorySlug })}
          scroll={false}
          className={`inline-flex h-9 items-center rounded-lg px-4 transition-colors ${
            !tagSlug ? 'bg-brand-red text-[#e9e9d7]' : 'bg-[#f7fbeb] text-[#141d19] hover:opacity-90'
          }`}
        >
          All
        </Link>
        {tags.map((t) => {
          const slug = clean(t.slug)
          const active = tagSlug === slug
          return (
            <Link
              key={t._id}
              href={buildResourcesIndexHref({ category: categorySlug, tag: slug })}
              scroll={false}
              className={`inline-flex h-9 items-center rounded-lg px-4 transition-colors ${
                active ? 'bg-brand-red text-[#e9e9d7]' : 'bg-[#f7fbeb] text-[#141d19] hover:opacity-90'
              }`}
            >
              {clean(t.title)}
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center font-inter text-[#5b5f53]">No articles match these filters.</p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 items-start justify-items-start gap-y-10 gap-x-0 p-0 md:grid-cols-2 md:gap-x-[60px] md:gap-y-20 xl:grid-cols-3 xl:gap-y-[140px]">
          {filtered.map((post) => {
            const slug = clean(post.slug)
            const title = clean(post.title)
            const excerpt = clean(post.excerpt)
            const catTitle = clean(post.category?.title)
            const src = resolveListingImageUrl(post.thumbnail, defaultListingImage)
            return (
              <li key={post._id} className="min-w-0 w-full max-w-[362px]">
                <Link
                  href={resourcesArticlePath(slug)}
                  className="group block w-full max-w-[362px] no-underline text-inherit"
                >
                  <article className="flex w-full max-w-[362px] flex-col gap-9">
                    <div className="relative aspect-[362/241] w-full overflow-hidden rounded-lg bg-[#d4d4c4]">
                      <Image
                        src={src}
                        alt={title || 'Article'}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) min(100vw, 362px), (max-width: 1280px) 50vw, 362px"
                      />
                    </div>
                    <div className="flex flex-col">
                      {catTitle ? (
                        <p className="m-0 mb-2 font-inter text-sm font-bold leading-4 text-[#7a7e70]">
                          {catTitle}
                        </p>
                      ) : null}
                      <h3
                        className={`m-0 font-mokoko text-[22px] font-medium leading-7 text-[#141d19] transition-colors overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] group-hover:text-brand-red ${
                          excerpt ? 'mb-6' : 'mb-5'
                        }`}
                      >
                        {title}
                      </h3>
                      {excerpt ? (
                        <p className="m-0 mb-5 font-inter text-base leading-6 text-[#141d19] overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:7]">
                          {excerpt}
                        </p>
                      ) : null}
                      <span className="inline-flex items-center gap-1 font-mokoko text-base text-brand-red">
                        Read more
                        <ChevronRight />
                      </span>
                    </div>
                  </article>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      <div className="w-full border-b border-[#7A7E70] pt-[60px]" aria-hidden />
      <div className="h-[60px] shrink-0" aria-hidden />
    </div>
  )
}

/** Standalone listing (used only if /blogs redirect target is bypassed). */
export function BlogsIndex(props: BlogIndexProps) {
  return (
    <div className="min-h-screen bg-[#fdfdfb] text-[#141d19]">
      <section className="max-w-content mx-auto w-full px-5 md:px-10 lg:px-[100px] pt-10 md:pt-16 pb-3 md:pb-4">
        <h1 className="font-mokoko font-medium text-[36px] leading-[38px] text-brand-red m-0">
          Resources
        </h1>
      </section>
      <section className="bg-[#e9e9d7] w-full">
        <div className="max-w-content mx-auto w-full px-5 pt-10 pb-0 md:px-10 md:pt-14 lg:px-[100px] lg:pt-16">
          <BlogsIndexFeatured {...props} />
          <BlogsIndexTabPanel {...props} />
        </div>
      </section>
    </div>
  )
}
