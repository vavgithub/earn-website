'use client'

import { usePathname } from 'next/navigation'
import { BlogHeadInjector } from '@/components/blogs/BlogHeadInjector'
import { sanitizeGlobalHeadForLocalDev } from '@/lib/devHeadSnippet'

type Props = {
  html: string | null | undefined
}

/** Site-wide head snippet from Sanity; skipped on `/studio`. */
export function GlobalHeadSnippet({ html }: Props) {
  const pathname = usePathname()

  if (pathname?.startsWith('/studio')) {
    return null
  }

  const snippet = sanitizeGlobalHeadForLocalDev(html)
  if (!snippet.trim()) {
    return null
  }

  return <BlogHeadInjector html={snippet} />
}
