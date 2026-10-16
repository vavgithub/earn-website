'use client'

/**
 * Trusted CMS HTML/CSS/JS. Scripts are stripped from the HTML string before
 * `dangerouslySetInnerHTML` (browsers drop or inert `<script>` from innerHTML),
 * then re-created as real `<script>` nodes so HubSpot and similar embeds work.
 * External `src` scripts are awaited in order before the next script runs.
 *
 * `suppressHydrationWarning` — CMS HTML / post-inject DOM can differ from SSR.
 *
 * **Security:** `markup` is fully trusted.
 */

import { useEffect, useMemo, useRef } from 'react'

const SCRIPT_BLOCK_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
const SELF_CLOSING_SCRIPT_RE = /<script\b([^>]*?)\s*\/>/gi

export type ScriptPayload = {
  attrSource: string
  body: string
}

function stripNullBytes(s: string): string {
  return s.replace(/\u0000/g, '')
}

/** `<script .../>` → `<script ...></script>` so one parser handles both */
function normalizeSelfClosingScripts(markup: string): string {
  return markup.replace(SELF_CLOSING_SCRIPT_RE, '<script$1></script>')
}

export function extractScriptPayloads(markup: string): ScriptPayload[] {
  const normalized = normalizeSelfClosingScripts(stripNullBytes(markup))
  const out: ScriptPayload[] = []
  const re = new RegExp(SCRIPT_BLOCK_RE.source, SCRIPT_BLOCK_RE.flags)
  for (const m of normalized.matchAll(re)) {
    out.push({
      attrSource: (m[1] ?? '').trim(),
      body: m[2] ?? '',
    })
  }
  return out
}

export function stripScriptBlocks(markup: string): string {
  const normalized = normalizeSelfClosingScripts(stripNullBytes(markup))
  return normalized.replace(new RegExp(SCRIPT_BLOCK_RE.source, SCRIPT_BLOCK_RE.flags), '')
}

function applyScriptAttributes(el: HTMLScriptElement, attrSource: string) {
  const src = attrSource.trim()
  if (!src) return

  const pairRe =
    /([^\s=]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g
  let m: RegExpExecArray | null
  while ((m = pairRe.exec(src))) {
    const name = m[1]
    const value = (m[3] ?? m[4] ?? m[5] ?? '').trim()
    try {
      el.setAttribute(name, value)
    } catch {
      /* ignore invalid attribute names from messy CMS paste */
    }
  }

  const boolRe = /\b(async|defer|nomodule)\b/gi
  let b: RegExpExecArray | null
  while ((b = boolRe.exec(src))) {
    const name = b[1].toLowerCase()
    if (!el.hasAttribute(name)) {
      try {
        el.setAttribute(name, '')
      } catch {
        /* ignore */
      }
    }
  }
}

function promoteStylesheetLinks(container: HTMLElement): HTMLLinkElement[] {
  const added: HTMLLinkElement[] = []
  try {
    const links = Array.from(
      container.querySelectorAll('link[rel="stylesheet"][href]'),
    ) as HTMLLinkElement[]
    for (const link of links) {
      const href = link.getAttribute('href')?.trim()
      if (!href) continue
      const clone = document.createElement('link')
      clone.rel = 'stylesheet'
      clone.href = href
      clone.setAttribute('data-marketing-code-embed', '1')
      document.head.appendChild(clone)
      added.push(clone)
    }
  } catch {
    /* ignore */
  }
  return added
}

type CodeEmbedBlockProps = {
  markup: string
  className?: string
}

export function CodeEmbedBlock({
  markup,
  className = '',
}: CodeEmbedBlockProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const safeMarkup = typeof markup === 'string' ? markup : ''
  const html = useMemo(() => stripScriptBlocks(safeMarkup), [safeMarkup])
  const scriptPayloads = useMemo(
    () => extractScriptPayloads(safeMarkup),
    [safeMarkup],
  )

  const headLinksRef = useRef<HTMLLinkElement[]>([])

  useEffect(() => {
    const wrap = wrapperRef.current
    const content = contentRef.current
    if (!wrap || !content) return

    let dead = false
    headLinksRef.current = []

    const cleanupInjected = () => {
      wrap.querySelectorAll('script[data-code-embed-injected]').forEach((n) => {
        n.remove()
      })
    }

    const run = async () => {
      try {
        cleanupInjected()
        if (dead) return

        headLinksRef.current = promoteStylesheetLinks(content)

        for (const payload of scriptPayloads) {
          if (dead) return
          const s = document.createElement('script')
          s.setAttribute('data-code-embed-injected', '1')
          applyScriptAttributes(s, payload.attrSource)
          s.textContent = payload.body
          wrap.appendChild(s)

          const src = s.getAttribute('src')?.trim()
          if (src) {
            await new Promise<void>((resolve) => {
              s.addEventListener('load', () => resolve(), { once: true })
              s.addEventListener('error', () => resolve(), { once: true })
            })
            if (dead) return
          }
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[CodeEmbed] script injection failed', e)
        }
      }
    }

    void run()

    return () => {
      dead = true
      cleanupInjected()
      for (const l of headLinksRef.current) {
        try {
          l.remove()
        } catch {
          /* ignore */
        }
      }
      headLinksRef.current = []
    }
  }, [safeMarkup, html, scriptPayloads])

  return (
    <div
      ref={wrapperRef}
      className={`marketing-code-embed [&_*]:max-w-none ${className}`.trim()}
    >
      <div
        ref={contentRef}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
