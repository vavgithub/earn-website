import { type PortableTextComponents } from '@portabletext/react'
import { linkMarkProps, type TextColorValue } from '@/lib/cmsTextColor'
import { portableTextLinkTargetAttrs } from '@/lib/portableTextLink'
import { PORTABLE_TEXT_INHERIT_MARKS } from '@/lib/createColoredPortableText'
import { textSizeBodyClass, type TextSizeValue } from '@/lib/cmsTextSize'

const heading = 'm-0 font-mokoko text-xl font-bold leading-8 text-inherit [&+p]:mt-4'

/** Step body copy — inherits section text color from CMS background. */
export function getHowItWorksStepsPortableComponents(
  bodySize: TextSizeValue = 'md',
  linkColor: TextColorValue = 'brightYellow',
  linksOpenInNewTab = false,
): PortableTextComponents {
  const linkMark = linkMarkProps(linkColor)
  const sizeClass = textSizeBodyClass(bodySize, 'md')
  const body = `m-0 font-inter font-normal ${sizeClass} text-inherit [&+p]:mt-4 ${PORTABLE_TEXT_INHERIT_MARKS}`

  return {
    block: {
      normal: ({ children }) => <p className={body}>{children}</p>,
      h1: ({ children }) => <p className={heading}>{children}</p>,
      h2: ({ children }) => <p className={heading}>{children}</p>,
      h3: ({ children }) => <p className={heading}>{children}</p>,
      h4: ({ children }) => <p className={heading}>{children}</p>,
      blockquote: ({ children }) => (
        <blockquote
          className={`m-0 border-l-4 border-current/40 pl-4 font-inter italic opacity-90 ${sizeClass} text-inherit [&+p]:mt-4`}
        >
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul
          className={`m-0 list-disc space-y-0 pl-6 font-inter font-normal ${sizeClass} text-inherit [&+p]:mt-4`}
        >
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol
          className={`m-0 list-decimal space-y-0 pl-6 font-inter font-normal ${sizeClass} text-inherit [&+p]:mt-4`}
        >
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className="font-inter leading-7">{children}</li>,
      number: ({ children }) => <li className="font-inter leading-7">{children}</li>,
    },
    marks: {
      link: ({ value, children }) => {
        const href = (value as { href?: string } | undefined)?.href || '#'
        return (
          <a
            href={href}
            className={`font-inter ${linkMark.className}`}
            style={linkMark.style}
            {...portableTextLinkTargetAttrs(linksOpenInNewTab)}
          >
            {children}
          </a>
        )
      },
      strong: ({ children }) => (
        <strong className="font-bold" style={{ color: 'inherit', fontWeight: 700 }}>
          {children}
        </strong>
      ),
      em: ({ children }) => (
        <em className="italic" style={{ color: 'inherit', fontStyle: 'italic' }}>
          {children}
        </em>
      ),
    },
  }
}
