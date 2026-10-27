import { type PortableTextComponents } from '@portabletext/react'
import type { CSSProperties, ReactNode } from 'react'
import { linkMarkProps, textColorStyle, type TextColorValue } from '@/lib/cmsTextColor'
import { PORTABLE_TEXT_INHERIT_MARKS, portableTextEmMark, portableTextStrongMark } from '@/lib/createColoredPortableText'
import { textSizeBodyClass, type TextSizeValue } from '@/lib/cmsTextSize'
import { portableTextLinkTargetAttrs } from '@/lib/portableTextLink'

const linkMark = (className: string, style: CSSProperties | undefined, linksOpenInNewTab: boolean) =>
  ({
    link: ({ value, children }: { value?: { href?: string }; children?: ReactNode }) => {
      const href = value?.href || '#'
      return (
        <a
          href={href}
          className={className}
          style={style}
          {...portableTextLinkTargetAttrs(linksOpenInNewTab)}
        >
          {children}
        </a>
      )
    },
  }) satisfies PortableTextComponents['marks']

export function getContentPanelBodyComponents(
  theme: 'light' | 'dark',
  bodyColor: TextColorValue,
  bodySize: TextSizeValue = 'md',
  linkColor: TextColorValue = 'brightYellow',
  linksOpenInNewTab = false,
): PortableTextComponents {
  const bodyStyle = textColorStyle(bodyColor, bodyColor)
  const sizeClass = textSizeBodyClass(bodySize, 'md')
  const bodyBase = `m-0 font-inter font-normal last:mb-0 ${sizeClass} ${PORTABLE_TEXT_INHERIT_MARKS}`
  const StrongMark = portableTextStrongMark(bodyStyle)
  const EmMark = portableTextEmMark(bodyStyle)
  const link =
    theme === 'dark' && linkColor === 'brightYellow'
      ? {
          className: 'underline underline-offset-2',
          style: { color: 'var(--color-earn-orange)', textDecorationColor: 'var(--color-earn-orange)' },
        }
      : linkMarkProps(linkColor)

  return {
    block: {
      normal: ({ children }) => (
        <p className={`${bodyBase} ${theme === 'light' ? 'mb-8' : 'mb-0'}`} style={bodyStyle}>
          {children}
        </p>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul
          className={`m-0 list-disc space-y-2 pl-6 ${sizeClass} ${theme === 'light' ? 'mb-8' : 'mb-0'}`}
          style={bodyStyle}
        >
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol
          className={`m-0 list-decimal space-y-2 pl-6 ${sizeClass} ${theme === 'light' ? 'mb-8' : 'mb-0'}`}
          style={bodyStyle}
        >
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      ...linkMark(link.className, link.style, linksOpenInNewTab),
      strong: StrongMark,
      em: EmMark,
    },
  }
}
