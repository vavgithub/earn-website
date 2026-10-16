import { redirect } from 'next/navigation'
import { resourcesArticlePath } from '@/lib/resourcePaths'

/** Permanent move: articles live at /resources/[slug]. */
export default async function BlogPostRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  redirect(resourcesArticlePath(slug))
}
