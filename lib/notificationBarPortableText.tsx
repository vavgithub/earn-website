import { type PortableTextComponents } from '@portabletext/react'
import { linkMarkProps, textColorStyle, type TextColorValue } from '@/lib/cmsTextColor'
import {
  PORTABLE_TEXT_INHERIT_MARKS,
  portableTextEmMark,
  portableTextStrongMark,
} from '@/lib/createColoredPortableText'
import { portableTextLinkTargetAttrs } from '@/lib/portableTextLink'
import { textSizeBodyClass, type TextSizeValue } from '@/lib/cmsTextSize'

export type NotificationBarPortableOptions = {
  textSize?: TextSizeValue
  textColor?: TextColorValue
  linkColor?: TextColorValue
  linksOpenInNewTab?: boolean
}

export function getNotificationBarPortableComponents({
  textSize = 'xs',
  textColor = 'offWhite',
  linkColor = 'offWhite',
  linksOpenInNewTab = false,
}: NotificationBarPortableOptions): PortableTextComponents {
  const bodyStyle = textColorStyle(textColor, textColor)
  const linkMark = linkMarkProps(linkColor)
  const sizeClass = textSizeBodyClass(textSize, 'xs')
  const bodyBase = `font-inter font-medium ${sizeClass} ${PORTABLE_TEXT_INHERIT_MARKS}`
  const StrongMark = portableTextStrongMark(bodyStyle)
  const EmMark = portableTextEmMark(bodyStyle)

  return {
    block: {
      normal: ({ children }) => (
        <span className={bodyBase} style={bodyStyle}>
          {children}
        </span>
      ),
    },
    marks: {
      link: ({ value, children }) => {
        const href = (value as { href?: string } | undefined)?.href || '#'
        return (
          <a
            href={href}
            className={`${linkMark.className} ${bodyBase}`}
            style={linkMark.style}
            {...portableTextLinkTargetAttrs(linksOpenInNewTab)}
          >
            {children}
          </a>
        )
      },
      strong: StrongMark,
      em: EmMark,
    },
  }
}
