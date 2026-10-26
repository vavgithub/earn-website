import type { CSSProperties, ReactNode } from 'react'
import { type PortableTextComponents } from '@portabletext/react'
import { linkMarkProps, textColorStyle, type TextColorValue } from '@/lib/cmsTextColor'
import { portableTextLinkTargetAttrs } from '@/lib/portableTextLink'
import { textSizeBodyClass, type TextSizeValue } from '@/lib/cmsTextSize'

/** Force bold/italic to match parent block CMS color (beats hardcoded `text-[#…]` on `<strong>`). */
export const PORTABLE_TEXT_INHERIT_MARKS =
  '[&_strong]:![color:inherit] [&_em]:![color:inherit] [&_b]:![color:inherit]' as const

function portableTextStrongMark(bodyStyle: CSSProperties) {
  return function StrongMark({ children }: { children?: ReactNode }) {
    return (
      <strong className="font-semibold" style={{ ...bodyStyle, fontWeight: 600 }}>
        {children}
      </strong>
    )
  }
}

function portableTextEmMark(bodyStyle: CSSProperties) {
  return function EmMark({ children }: { children?: ReactNode }) {
    return (
      <em className="italic" style={{ ...bodyStyle, fontStyle: 'italic' }}>
        {children}
      </em>
    )
  }
}

export { portableTextStrongMark, portableTextEmMark }

type ColoredPortableOptions = {
  bodyColor?: TextColorValue
  /** Heading blocks inside intro/body copy */
  headingColor?: TextColorValue
  /** Body paragraphs and lists only (not H1–H4). */
  bodySize?: TextSizeValue
  /** Default link color when `linkClassName` is not set. */
  linkColor?: TextColorValue
  linkClassName?: string
  /** From Studio “Open links in new tab” on the rich text row. */
  linksOpenInNewTab?: boolean
}

/** Portable Text for section intros and rich text blocks with a shared body color. */
export function createColoredPortableComponents({
  bodyColor = 'darkSlate',
  headingColor,
  bodySize = 'md',
  linkColor = 'brightYellow',
  linkClassName,
  linksOpenInNewTab = false,
}: ColoredPortableOptions): PortableTextComponents {
  const linkFromColor = linkMarkProps(linkColor)
  const resolvedLink = linkClassName
    ? { className: `font-inter ${linkClassName}`, style: undefined as undefined }
    : { className: `font-inter ${linkFromColor.className}`, style: linkFromColor.style }
  const bodyStyle = textColorStyle(bodyColor, bodyColor)
  const headingStyle = textColorStyle(headingColor ?? bodyColor, bodyColor)
  const bodySizeClass = textSizeBodyClass(bodySize, 'md')
  const bodyBase = `font-inter ${bodySizeClass} ${PORTABLE_TEXT_INHERIT_MARKS}`
  const StrongMark = portableTextStrongMark(bodyStyle)
  const EmMark = portableTextEmMark(bodyStyle)

  return {
    block: {
      normal: ({ children }) => (
        <p className={`m-0 mb-4 last:mb-0 ${bodyBase}`} style={bodyStyle}>
          {children}
        </p>
      ),
      h1: ({ children }) => (
        <h1
          className={`m-0 mb-4 font-mokoko text-4xl font-medium leading-tight md:text-5xl ${bodyBase}`}
          style={headingStyle}
        >
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2
          className={`m-0 mb-4 font-mokoko text-2xl font-medium leading-8 md:text-3xl ${bodyBase}`}
          style={headingStyle}
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3
          className={`m-0 mb-3 font-mokoko text-xl font-medium leading-7 ${bodyBase}`}
          style={headingStyle}
        >
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4
          className={`m-0 mb-2 font-mokoko text-lg font-medium leading-7 ${bodyBase}`}
          style={headingStyle}
        >
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote
          className={`m-0 mb-4 border-l-4 border-brand-green pl-4 italic last:mb-0 ${bodyBase}`}
          style={bodyStyle}
        >
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className={`m-0 mb-4 list-disc pl-6 last:mb-0 ${bodyBase}`} style={bodyStyle}>
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className={`m-0 mb-4 list-decimal pl-6 last:mb-0 ${bodyBase}`} style={bodyStyle}>
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className="mb-[0.4em] last:mb-0">{children}</li>,
      number: ({ children }) => <li className="mb-[0.4em] last:mb-0">{children}</li>,
    },
    marks: {
      link: ({ value, children }) => {
        const href = (value as { href?: string } | undefined)?.href || '#'
        return (
          <a
            href={href}
            className={resolvedLink.className}
            style={resolvedLink.style}
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
