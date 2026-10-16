/** Matches pre-Sanity footer when Studio has no links configured. */

export type FooterLink = {
  label: string
  href: string
}

export type SiteFooterDoc = {
  copyrightYear?: number
  column1?: Array<{ label?: string; href?: string } | null>
  column2?: Array<{ label?: string; href?: string } | null>
  column3?: Array<{ label?: string; href?: string } | null>
}

export const DEFAULT_FOOTER_COPYRIGHT_YEAR = 2026

function defaultAppLinks(): FooterLink[] {
  const links: FooterLink[] = []
  const registerUrl = process.env.NEXT_PUBLIC_APP_REGISTER_URL?.trim()
  const loginUrl = process.env.NEXT_PUBLIC_APP_LOGIN_URL?.trim()
  if (registerUrl) links.push({ label: 'Get Started', href: registerUrl })
  if (loginUrl) links.push({ label: 'Login', href: loginUrl })
  return links
}

export const DEFAULT_FOOTER_COLUMNS: [FooterLink[], FooterLink[], FooterLink[]] = [
  [
    { label: 'Home', href: '/' },
    { label: 'Resources', href: '/resources' },
  ],
  defaultAppLinks(),
  [],
]

function normalizeFooterLinks(raw: unknown): FooterLink[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(
      (it): it is FooterLink =>
        it != null &&
        typeof it === 'object' &&
        typeof (it as FooterLink).label === 'string' &&
        (it as FooterLink).label.trim() !== '' &&
        typeof (it as FooterLink).href === 'string' &&
        (it as FooterLink).href.trim() !== '',
    )
    .map((it) => ({ label: it.label.trim(), href: it.href.trim() }))
}

function resolveCopyrightYear(year: unknown): number {
  if (typeof year === 'number' && year >= 1900 && year <= 2100) return year
  return DEFAULT_FOOTER_COPYRIGHT_YEAR
}

/** If no document or all columns empty → default columns; year from Sanity when valid, else default. */
export function resolveFooterFromSanity(doc: SiteFooterDoc | null | undefined): {
  columns: [FooterLink[], FooterLink[], FooterLink[]]
  copyrightYear: number
} {
  const copyrightYear = resolveCopyrightYear(doc?.copyrightYear)
  const c1 = normalizeFooterLinks(doc?.column1)
  const c2 = normalizeFooterLinks(doc?.column2)
  const c3 = normalizeFooterLinks(doc?.column3)
  if (c1.length + c2.length + c3.length === 0) {
    return { columns: DEFAULT_FOOTER_COLUMNS, copyrightYear }
  }
  return { columns: [c1, c2, c3], copyrightYear }
}
