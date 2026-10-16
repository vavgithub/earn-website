'use client'

import { useEffect } from 'react'
import { stegaClean } from 'next-sanity'

/**
 * Appends trusted snippet nodes to document.head (script, link, meta, style, noscript).
 * Recreates <script> elements so external and inline scripts actually run.
 */
function injectHeadSnippet(html: string) {
  const trimmed = html.trim()
  if (!trimmed) return () => {}

  const parser = new DOMParser()
  const doc = parser.parseFromString(
    `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${trimmed}</body></html>`,
    'text/html',
  )
  const children = Array.from(doc.body.children)
  const injected: ChildNode[] = []

  for (const el of children) {
    const tag = el.tagName.toUpperCase()
    if (tag === 'SCRIPT') {
      const s = document.createElement('script')
      for (const attr of Array.from(el.attributes)) {
        if (attr.name === 'text') continue
        if (attr.name === 'crossorigin') {
          s.crossOrigin = attr.value === 'use-credentials' ? 'use-credentials' : 'anonymous'
          continue
        }
        s.setAttribute(attr.name, attr.value)
      }
      if (!el.getAttribute('src')) {
        s.textContent = el.textContent
      }
      document.head.appendChild(s)
      injected.push(s)
    } else if (tag === 'LINK' || tag === 'META' || tag === 'STYLE' || tag === 'NOSCRIPT') {
      const clone = document.importNode(el, true)
      document.head.appendChild(clone)
      injected.push(clone)
    }
  }

  return () => {
    for (const node of injected) {
      node.parentNode?.removeChild(node)
    }
  }
}

type Props = {
  /** Raw HTML from CMS; stega encoding is stripped before inject. */
  html: string | null | undefined
}

export function BlogHeadInjector({ html }: Props) {
  useEffect(() => {
    if (!html?.trim()) return
    const cleaned = stegaClean(html)
    return injectHeadSnippet(cleaned)
  }, [html])

  return null
}
