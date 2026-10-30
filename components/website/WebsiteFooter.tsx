import Link from 'next/link'
import type {
  FooterColumn,
  FooterLink,
  FooterSocialPlatform,
  ResolvedFooter,
} from '@/components/website/footerData'
import type { Path, PathSegment } from '@sanity/client/csm'
import { createDataAttribute } from 'next-sanity'
import styles from '@/components/website/WebsiteFooter.module.css'

export type WebsiteFooterProps = {
  footer: ResolvedFooter
  presentation?: { documentId: string; documentType: string; studioBaseUrl?: string }
}

type PresentationProps = (path: Path) => Record<string, string>

const SOCIAL_ICONS: Record<FooterSocialPlatform, { src: string; alt: string }> = {
  linkedin: { src: '/assets/footer/linkedin-icon.svg', alt: 'LinkedIn' },
  x: { src: '/assets/footer/x-icon.svg', alt: 'X' },
}

/** Array member path segment: Sanity `_key` when present, else the index. */
const seg = (key: string | undefined, index: number): PathSegment => (key ? { _key: key } : index)

const isExternal = (href: string) => /^https?:\/\//i.test(href)

/**
 * Column heading and group sub-heading share one text style. Measured from the Figma footer:
 * 12px Plex Mono at its default 1.3 line height, 10.8px between rows, ~13px from an underline to the next row.
 * The column heading underline spans the column; the sub-heading underline spans its text.
 */
const footerHeadingText = 'text-xs leading-plex font-medium text-earn-gray-200 pb-0.75 border-b border-earn-gray-550'

function FooterAnchor({ link, attrs }: { link: FooterLink; attrs: Record<string, string> }) {
  const className =
    'block whitespace-pre-line text-xs leading-plex font-medium text-earn-orange hover:text-earn-white transition-colors'
  if (isExternal(link.href)) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className} {...attrs}>
        {link.label}
      </a>
    )
  }
  return (
    <Link href={link.href} className={className} {...attrs}>
      {link.label}
    </Link>
  )
}

function FooterColumnBlock({
  column,
  path,
  presentationProps,
}: {
  column: FooterColumn
  path: Path
  presentationProps: PresentationProps
}) {
  return (
    <div className="min-w-0">
      <p className={`m-0 ${footerHeadingText}`} {...presentationProps([...path, 'heading'])}>
        {column.heading}
      </p>
      <div className="mt-3.25 flex flex-col gap-footer-row">
        {column.groups.map((group, g) => {
          const groupPath: Path = [...path, 'groups', seg(group._key, g)]
          return (
            <div key={group._key ?? g} className="flex flex-col gap-footer-row">
              {group.heading ? (
                <span
                  className={`self-start mb-0.5 ${footerHeadingText}`}
                  {...presentationProps([...groupPath, 'heading'])}
                >
                  {group.heading}
                </span>
              ) : null}
              {group.links.map((link, l) => (
                <FooterAnchor
                  key={link._key ?? l}
                  link={link}
                  attrs={presentationProps([...groupPath, 'links', seg(link._key, l)])}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function WebsiteFooter({ footer, presentation }: WebsiteFooterProps) {
  const studioBaseUrl = presentation?.studioBaseUrl

  const presentationProps: PresentationProps = (path) => {
    if (!presentation?.documentId || !presentation?.documentType || !studioBaseUrl) return {}
    const attr = createDataAttribute({
      id: presentation.documentId,
      type: presentation.documentType,
      baseUrl: studioBaseUrl,
      path,
    })
    return { 'data-sanity': attr.toString() }
  }

  return (
    <footer className="bg-earn-ink-deep font-plex-mono pt-15 pb-5">
      <div className={`${styles.inner} px-5 md:px-10 xl:px-0`}>
        <div className={styles.row}>
          <div className={styles.brand}>
            <div className={styles.mark}>
              <Link href="/">
                <img src="/assets/images/earn-logo.svg" alt="Earn" className="block h-9 w-auto" />
              </Link>
              {footer.socialLinks.length ? (
                <div className={styles.social} {...presentationProps(['socialLinks'])}>
                  {footer.socialLinks.map((social, i) => (
                    <a
                      key={social._key ?? i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                      {...presentationProps(['socialLinks', seg(social._key, i)])}
                    >
                      <img
                        src={SOCIAL_ICONS[social.platform].src}
                        alt={SOCIAL_ICONS[social.platform].alt}
                        className="block size-6"
                      />
                    </a>
                  ))}
                </div>
              ) : null}
              {footer.phone ? (
                <p
                  className={`${styles.phone} font-inter text-2xs leading-4 whitespace-nowrap text-earn-gray-600`}
                  {...presentationProps(['phone'])}
                >
                  {footer.phone}
                </p>
              ) : null}
            </div>
          </div>

          <div className={styles.columns}>
            {footer.columns.map((column, c) => (
              <FooterColumnBlock
                key={column._key ?? c}
                column={column}
                path={['columns', seg(column._key, c)]}
                presentationProps={presentationProps}
              />
            ))}
          </div>
        </div>

        <div className="mt-10.75 border-t border-earn-gray-800" />
        <p
          className="m-0 pt-3.5 text-center font-inter text-3xs leading-4 text-earn-gray-700"
          {...presentationProps(['copyrightYear'])}
        >
          &copy; {footer.copyrightYear} {footer.copyrightHolder}. All Rights Reserved
        </p>
      </div>
    </footer>
  )
}
