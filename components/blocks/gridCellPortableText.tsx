import Image from 'next/image'
import { type PortableTextComponents } from '@portabletext/react'
import { urlForImage } from '@/sanity/lib/image'
import type { GridCellSurface } from '@/components/blocks/layoutSlotVariant'
import { linkMarkProps, textColorStyle, type TextColorValue } from '@/lib/cmsTextColor'
import { PORTABLE_TEXT_INHERIT_MARKS, portableTextEmMark, portableTextStrongMark } from '@/lib/createColoredPortableText'
import { textSizeBodyClass, type TextSizeValue } from '@/lib/cmsTextSize'
import { portableTextLinkTargetAttrs } from '@/lib/portableTextLink'

const bodyP = {
  dark: 'font-inter text-base font-normal leading-7 text-earn-paper',
  transparent: 'font-inter text-base font-normal leading-7 text-earn-work',
} as const

const headingP = {
  dark: 'text-xl font-bold leading-7 text-earn-paper',
  transparent: 'text-xl font-bold leading-7 text-earn-work',
} as const

const listUl = {
  dark: 'list-disc space-y-2 pl-6 text-base font-normal leading-7 text-earn-paper',
  transparent: 'list-disc space-y-1 pl-6 text-base font-normal leading-7 text-earn-work',
} as const

const listOl = {
  dark: 'list-decimal space-y-2 pl-6 text-base font-normal leading-7 text-earn-paper',
  transparent: 'list-decimal space-y-1 pl-6 text-base font-normal leading-7 text-earn-work',
} as const

const linkClass = {
  dark: 'text-earn-paper underline decoration-earn-paper/50 underline-offset-2 hover:decoration-earn-paper',
  transparent:
    'text-earn-gold underline decoration-earn-gold/50 underline-offset-2 hover:decoration-earn-gold',
} as const

const strongClass = {
  dark: 'font-bold text-earn-paper',
  transparent: 'font-semibold text-earn-work',
} as const

function buildGridCellPortableComponents(
  surface: GridCellSurface,
  contentColor?: TextColorValue,
  contentSize: TextSizeValue = 'md',
  linkColor?: TextColorValue,
  linksOpenInNewTab = false,
): PortableTextComponents {
  const link =
    linkColor != null
      ? linkMarkProps(linkColor)
      : { className: linkClass[surface], style: undefined }
  const bodyStyle = contentColor != null ? textColorStyle(contentColor, contentColor) : undefined
  const inheritMarks = contentColor != null ? PORTABLE_TEXT_INHERIT_MARKS : ''
  const StrongMark = bodyStyle ? portableTextStrongMark(bodyStyle) : null
  const EmMark = bodyStyle ? portableTextEmMark(bodyStyle) : null
  const body =
    contentColor != null
      ? `font-inter font-normal ${textSizeBodyClass(contentSize, 'md')} ${inheritMarks}`
      : bodyP[surface]
  const heading =
    contentColor != null
      ? 'text-xl font-bold leading-7'
      : headingP[surface]
  const list =
    contentColor != null
      ? `list-disc space-y-1 pl-6 font-normal ${textSizeBodyClass(contentSize, 'md')} ${inheritMarks}`
      : listUl[surface]
  const listNumber =
    contentColor != null
      ? `list-decimal space-y-1 pl-6 font-normal ${textSizeBodyClass(contentSize, 'md')} ${inheritMarks}`
      : listOl[surface]

  return {
    block: {
      normal: ({ children }) => (
        <p className={body} style={bodyStyle}>
          {children}
        </p>
      ),
      h1: ({ children }) => (
        <p className={heading} style={bodyStyle}>
          {children}
        </p>
      ),
      h2: ({ children }) => (
        <p className={heading} style={bodyStyle}>
          {children}
        </p>
      ),
      h3: ({ children }) => (
        <p className={heading} style={bodyStyle}>
          {children}
        </p>
      ),
      h4: ({ children }) => (
        <p className={heading} style={bodyStyle}>
          {children}
        </p>
      ),
      blockquote: ({ children }) => (
        <blockquote
          className={
            surface === 'dark'
              ? 'border-l-4 border-earn-paper/40 pl-4 text-base font-normal leading-7 text-earn-paper/90 italic'
              : 'border-l-4 border-earn-orange pl-4 text-base font-normal leading-7 text-earn-gray-700 italic'
          }
        >
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className={list} style={bodyStyle}>
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className={listNumber} style={bodyStyle}>
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      link: ({ value, children }) => {
        const href = (value as { href?: string } | undefined)?.href || '#'
        return (
          <a
            href={href}
            className={link.className}
            style={link.style}
            {...portableTextLinkTargetAttrs(linksOpenInNewTab)}
          >
            {children}
          </a>
        )
      },
      strong: ({ children }) =>
        StrongMark ? (
          <StrongMark>{children}</StrongMark>
        ) : (
          <strong className={strongClass[surface]}>{children}</strong>
        ),
      em: ({ children }) =>
        EmMark ? <EmMark>{children}</EmMark> : <em className="italic">{children}</em>,
    },
    types: {
      image: ({ value }) => {
        if (!value?.asset) return null
        const url = urlForImage(value)?.url()
        if (!url) return null
        return (
          <figure className="w-full overflow-hidden rounded-2xl">
            <div className="relative aspect-video w-full">
              <Image
                src={url}
                alt={value.alt || ''}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </figure>
        )
      },
    },
  }
}

/** @deprecated Use getGridCellPortableComponents(surface) */
export const gridCellPortableComponents = buildGridCellPortableComponents('dark')

export function getGridCellPortableComponents(
  surface: GridCellSurface,
  contentColor?: TextColorValue,
  contentSize: TextSizeValue = 'md',
  linkColor?: TextColorValue,
  linksOpenInNewTab = false,
): PortableTextComponents {
  return buildGridCellPortableComponents(
    surface,
    contentColor,
    contentSize,
    linkColor,
    linksOpenInNewTab,
  )
}
