/**
 * GROQ bundle for /resources index: settings (featured + default image), categories, tags, posts.
 *
 * Tags: all `blogTag` docs are listed as chips (even if no post uses them yet). Clicking such a
 * tag shows “No articles match” until a post references it.
 */

const postCardProjection = `
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  listingImage,
  listingExcerpt,
  "category": category->{ title, "slug": slug.current },
  "tags": tags[]->{ title, "slug": slug.current },
  "thumbnail": coalesce(
    listingImage,
    pageBuilder[0].column2[_type == "imageBlock"][0].image,
    pageBuilder[0].column1[_type == "imageBlock"][0].image,
    pageBuilder[0].items[0].blocks[_type == "imageBlock"][0].image,
    pageBuilder[0].items[_type == "imageBlock"][0].image,
    pageBuilder[0].image,
    pageBuilder[0].column1.imageContent,
    pageBuilder[0].items[0].image,
    pageBuilder[0].blocks[0].column2[_type == "imageBlock"][0].image,
    pageBuilder[0].blocks[0].column1[_type == "imageBlock"][0].image,
    pageBuilder[0].blocks[0].items[0].blocks[_type == "imageBlock"][0].image,
    pageBuilder[0].blocks[0].items[_type == "imageBlock"][0].image,
    pageBuilder[0].blocks[0].image,
    pageBuilder[0].blocks[0].column1.imageContent,
    pageBuilder[0].blocks[0].items[0].image
  ),
  "excerpt": coalesce(
    listingExcerpt,
    pt::text(pageBuilder[0].column1[_type == "richTextSection"][0].content),
    pt::text(pageBuilder[0].column2[_type == "richTextSection"][0].content),
    pt::text(pageBuilder[0].intro),
    pageBuilder[0].heading,
    pageBuilder[0].description,
    pageBuilder[0].items[0].description,
    pt::text(pageBuilder[0].items[0].blocks[_type == "richTextSection"][0].content),
    pt::text(pageBuilder[0].items[_type == "richTextSection"][0].content),
    pt::text(pageBuilder[0].content),
    pt::text(pageBuilder[0].column1.textContent),
    pt::text(pageBuilder[0].blocks[0].column1[_type == "richTextSection"][0].content),
    pt::text(pageBuilder[0].blocks[0].column2[_type == "richTextSection"][0].content),
    pt::text(pageBuilder[0].blocks[0].intro),
    pageBuilder[0].blocks[0].heading,
    pageBuilder[0].blocks[0].description,
    pageBuilder[0].blocks[0].items[0].description,
    pt::text(pageBuilder[0].blocks[0].items[0].blocks[_type == "richTextSection"][0].content),
    pt::text(pageBuilder[0].blocks[0].items[_type == "richTextSection"][0].content),
    pt::text(pageBuilder[0].blocks[0].content),
    pt::text(pageBuilder[0].blocks[0].column1.textContent)
  )
`

export const blogIndexQuery = `{
  "settings": *[_type == "blogSettings"] | order(_updatedAt desc)[0]{
    featuredPost->{ ${postCardProjection} },
    defaultListingImage
  },
  "categories": *[_type == "blogCategory"] | order(sortOrder asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    sortOrder
  },
  "tags": *[_type == "blogTag"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  },
  "posts": *[_type == "blogPost" && defined(slug.current)] | order(orderRank) {
    ${postCardProjection}
  }
}`
