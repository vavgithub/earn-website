/** Footer shape read from the Sanity `siteFooter` singleton, plus the fallback used when Studio is empty. */

/** `_key` is the Sanity array key, used for Presentation click-to-edit paths. */
export type FooterLink = {
  _key?: string
  label: string
  href: string
}

export type FooterLinkGroup = {
  _key?: string
  heading?: string
  links: FooterLink[]
}

export type FooterColumn = {
  _key?: string
  heading: string
  groups: FooterLinkGroup[]
}

export type FooterSocialPlatform = 'linkedin' | 'x'

export type FooterSocialLink = {
  _key?: string
  platform: FooterSocialPlatform
  url: string
}

export type ResolvedFooter = {
  columns: FooterColumn[]
  socialLinks: FooterSocialLink[]
  phone: string
  copyrightHolder: string
  copyrightYear: number
}

export type SiteFooterDoc = {
  columns?: Array<{
    _key?: string
    heading?: string
    groups?: Array<{
      _key?: string
      heading?: string
      links?: Array<{ _key?: string; label?: string; href?: string } | null>
    } | null>
  } | null>
  socialLinks?: Array<{ _key?: string; platform?: string; url?: string } | null>
  phone?: string
  copyrightHolder?: string
  copyrightYear?: number
}

export const DEFAULT_FOOTER_COPYRIGHT_HOLDER = 'EarnDLT®'

function defaultAppLinks(): FooterLink[] {
  const links: FooterLink[] = []
  const registerUrl = process.env.NEXT_PUBLIC_APP_REGISTER_URL?.trim()
  const loginUrl = process.env.NEXT_PUBLIC_APP_LOGIN_URL?.trim()
  if (registerUrl) links.push({ label: 'Get Started', href: registerUrl })
  if (loginUrl) links.push({ label: 'Login', href: loginUrl })
  return links
}

/** Fallback when Studio has no footer columns yet. Keep it minimal; real content lives in Sanity. */
export const DEFAULT_FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: 'Earn',
    groups: [
      {
        links: [
          { label: 'Home', href: '/' },
          { label: 'Resources', href: '/resources' },
          ...defaultAppLinks(),
        ],
      },
    ],
  },
]

const trimmed = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

function normalizeLinks(raw: unknown): FooterLink[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((it) => ({ _key: it?._key, label: trimmed(it?.label), href: trimmed(it?.href) }))
    .filter((it) => it.label && it.href)
}

function normalizeColumns(raw: SiteFooterDoc['columns']): FooterColumn[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((col) => ({
      _key: col?._key,
      heading: trimmed(col?.heading),
      groups: (Array.isArray(col?.groups) ? col.groups : [])
        .map((g) => ({ _key: g?._key, heading: trimmed(g?.heading) || undefined, links: normalizeLinks(g?.links) }))
        .filter((g) => g.heading || g.links.length),
    }))
    .filter((col) => col.heading)
}

function normalizeSocialLinks(raw: SiteFooterDoc['socialLinks']): FooterSocialLink[] {
  if (!Array.isArray(raw)) return []
  const links: FooterSocialLink[] = []
  for (const it of raw) {
    const platform = trimmed(it?.platform)
    const url = trimmed(it?.url)
    if ((platform === 'linkedin' || platform === 'x') && url) links.push({ _key: it?._key, platform, url })
  }
  return links
}

function resolveCopyrightYear(year: unknown): number {
  if (typeof year === 'number' && year >= 1900 && year <= 2100) return year
  return new Date().getFullYear()
}

/** No document or no columns → default columns. Other fields fall back individually. */
export function resolveFooterFromSanity(doc: SiteFooterDoc | null | undefined): ResolvedFooter {
  const columns = normalizeColumns(doc?.columns)
  return {
    columns: columns.length ? columns : DEFAULT_FOOTER_COLUMNS,
    socialLinks: normalizeSocialLinks(doc?.socialLinks),
    phone: trimmed(doc?.phone),
    copyrightHolder: trimmed(doc?.copyrightHolder) || DEFAULT_FOOTER_COPYRIGHT_HOLDER,
    copyrightYear: resolveCopyrightYear(doc?.copyrightYear),
  }
}
