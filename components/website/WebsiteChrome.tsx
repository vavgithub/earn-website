import type { ReactNode } from 'react'
import { WebsiteFooter } from '@/components/website/WebsiteFooter'
import { WebsiteNavbar } from '@/components/website/WebsiteNavbar'
import { WebsiteNotificationBar } from '@/components/website/WebsiteNotificationBar'
import { resolveFooterFromSanity } from '@/components/website/footerData'
import { getSanityForRequest } from '@/sanity/lib/liveClient'
import { navKeyFromLabel } from '@/lib/navKeyFromLabel'

export type WebsiteChromeProps = {
  children: ReactNode
}

/**
 * Public Earn marketing shell: navbar, main content, footer.
 */
export async function WebsiteChrome({ children }: WebsiteChromeProps) {
  const { isDraft, sanityClient, studioBaseUrl } = await getSanityForRequest()

  const navQuery = `*[_type == "siteNavigation"] | order(length(items) desc, _updatedAt desc)[0]{
    _id,
    _type,
    items[]{
      label,
      key,
      href,
      dropdownKind,
      columns[]{
        items[]{
          label,
          href,
          subitems[]{label, href}
        }
      },
      items[]{
        label,
        href,
        subitems[]{label, href},
        introHeading,
        introBody
      },
      introHeading,
      introBody
    }
  }`

  const navDoc = await sanityClient.fetch(
    navQuery,
    {},
    isDraft ? ({ cache: 'no-store' } as const) : ({ next: { revalidate: 60 } } as const),
  )

  const footerQuery = `*[_type == "siteFooter"] | order(_updatedAt desc)[0]{
    _id,
    _type,
    columns[]{_key, heading, groups[]{_key, heading, links[]{_key, label, href}}},
    socialLinks[]{_key, platform, url},
    phone,
    copyrightHolder,
    copyrightYear
  }`

  const footerDoc = await sanityClient.fetch(
    footerQuery,
    {},
    isDraft ? ({ cache: 'no-store' } as const) : ({ next: { revalidate: 60 } } as const),
  )

  const notificationBarQuery = `*[_id == "siteNotificationBar"][0]{
    enabled,
    message,
    textSize,
    textColor,
    linkColor,
    linksOpenInNewTab,
    paddingTop,
    paddingBottom,
    sectionBackground
  }`

  const notificationBarDoc = await sanityClient.fetch(
    notificationBarQuery,
    {},
    isDraft ? ({ cache: 'no-store' } as const) : ({ next: { revalidate: 60 } } as const),
  )

  const navItems = normalizeNavigation(navDoc?.items)
  const footer = resolveFooterFromSanity(footerDoc)

  return (
    <>
      <WebsiteNavbar
        items={navItems}
        presentation={
          isDraft && navDoc?._id && navDoc?._type
            ? { documentId: navDoc._id, documentType: navDoc._type, studioBaseUrl }
            : undefined
        }
      />
      <WebsiteNotificationBar
        enabled={notificationBarDoc?.enabled === true}
        message={notificationBarDoc?.message}
        textSize={notificationBarDoc?.textSize}
        textColor={notificationBarDoc?.textColor}
        linkColor={notificationBarDoc?.linkColor}
        linksOpenInNewTab={notificationBarDoc?.linksOpenInNewTab}
        paddingTop={notificationBarDoc?.paddingTop}
        paddingBottom={notificationBarDoc?.paddingBottom}
        background={notificationBarDoc?.sectionBackground}
      />
      <main className="navbar-pinned-page flex-1">{children}</main>
      <WebsiteFooter
        footer={footer}
        presentation={
          isDraft && footerDoc?._id && footerDoc?._type
            ? { documentId: footerDoc._id, documentType: footerDoc._type, studioBaseUrl }
            : undefined
        }
      />
    </>
  )
}

function normalizeNavigation(items: any): any[] | undefined {
  if (!Array.isArray(items)) return undefined
  return items
    .filter((it) => it && typeof it === 'object' && typeof it.label === 'string' && it.label.trim())
    .map((it) => {
      const stableKey =
        typeof it.key === 'string' && it.key.trim() ? it.key.trim() : navKeyFromLabel(it.label)
      const dropdownKind = it.dropdownKind as string | undefined
      if (!dropdownKind || dropdownKind === 'none') {
        return { label: it.label, href: it.href, key: stableKey }
      }
      if (dropdownKind === 'multiColumn') {
        const columns = Array.isArray(it.columns)
          ? it.columns
              .filter((c: any) => c && typeof c === 'object')
              .map((c: any) => ({ items: normalizeRows(c.items) }))
              .filter((c: any) => c.items.length)
          : []
        return { label: it.label, href: it.href, key: stableKey, dropdown: { kind: 'multi-column', columns } }
      }
      if (dropdownKind === 'singleWithIntro') {
        const rows = normalizeRows(it.items)
        const legacyHeading =
          typeof it.introHeading === 'string' ? it.introHeading.trim() : ''
        const legacyBody = typeof it.introBody === 'string' ? it.introBody.trim() : ''
        return {
          label: it.label,
          href: it.href,
          key: stableKey,
          dropdown: {
            kind: 'single-with-intro',
            items: rows,
            intro: {
              heading: legacyHeading,
              body: legacyBody,
            },
          },
        }
      }
      return { label: it.label, href: it.href, key: stableKey }
    })
}

function normalizeRows(rows: any): any[] {
  if (!Array.isArray(rows)) return []
  return rows
    .filter((r) => r && typeof r === 'object' && typeof r.label === 'string' && r.label.trim())
    .map((r) => {
      const rowHeading = typeof r.introHeading === 'string' ? r.introHeading.trim() : ''
      const rowBody = typeof r.introBody === 'string' ? r.introBody.trim() : ''
      const intro =
        rowHeading || rowBody
          ? { heading: typeof r.introHeading === 'string' ? r.introHeading : '', body: typeof r.introBody === 'string' ? r.introBody : '' }
          : undefined
      return {
        label: r.label,
        href: r.href,
        intro,
        subitems: Array.isArray(r.subitems)
          ? r.subitems
              .filter((s: any) => s && typeof s === 'object' && typeof s.label === 'string' && s.label.trim())
              .map((s: any) => ({ label: s.label, href: s.href }))
          : undefined,
      }
    })
}
