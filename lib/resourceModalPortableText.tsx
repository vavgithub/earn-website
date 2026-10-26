import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { linkMarkProps } from '@/lib/cmsTextColor'
import { portableTextLinkTargetAttrs } from '@/lib/portableTextLink'
import { textSizeBodyClass, type TextSizeValue } from '@/lib/cmsTextSize'
import type { NestedRichTextRowSettings } from '@/lib/nestedRichTextRow'

export type ResourceModalPortableTextOptions = Partial<NestedRichTextRowSettings>

/** Portable Text styles matching legacy Resources modal body copy. */
export function getResourceModalPortableTextComponents(
  options: ResourceModalPortableTextOptions = {},
): PortableTextComponents {
  const {
    textSize = 'md',
    linkColor = 'yellow',
    linksOpenInNewTab = false,
  } = options

  const linkMark = linkMarkProps(linkColor)
  const sizeClass = textSizeBodyClass(textSize, 'md')
  const bodyClass = `font-inter mt-4 first:mt-0 ${sizeClass}`

  return {
    block: {
      normal: ({ children }) => (
        <p className={bodyClass}>
          {children}
        </p>
      ),
      h3: ({ children }) => (
        <h3 className="font-mokoko text-[20px] md:text-[26px] font-regular text-[#141d19] leading-[1.2] mt-0">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="font-mokoko text-lg font-medium text-[#141d19] mt-4">{children}</h4>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className={`font-inter ${sizeClass} list-disc flex flex-col gap-2 mt-4 pl-6`}>
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className={`font-inter ${sizeClass} list-decimal flex flex-col gap-2 mt-4 pl-6`}>
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className={`font-inter ${sizeClass}`}>{children}</li>,
      number: ({ children }) => <li className={`font-inter ${sizeClass}`}>{children}</li>,
    },
    marks: {
      link: ({ children, value }) => {
        const href = (value as { href?: string } | undefined)?.href || '#'
        return (
          <a
            href={href}
            className={`font-inter underline hover:opacity-80 ${linkMark.className}`}
            style={linkMark.style}
            {...portableTextLinkTargetAttrs(linksOpenInNewTab)}
          >
            {children}
          </a>
        )
      },
    },
  }
}

/** @deprecated Use options from CMS via ResourceModalPortableText props. */
export const resourceModalPortableTextComponents =
  getResourceModalPortableTextComponents()

export function ResourceModalPortableText({
  value,
  options,
}: {
  value?: PortableTextBlock[] | null
  options?: ResourceModalPortableTextOptions
}) {
  if (!value?.length) return null
  return (
    <PortableText
      value={value}
      components={getResourceModalPortableTextComponents(options)}
    />
  )
}
