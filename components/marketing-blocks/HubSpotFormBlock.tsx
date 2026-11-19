'use client'

import { HubSpotFormEmbed } from '@/components/website/HubSpotFormEmbed'
import { linkMarkProps, parseTextColor, textColorStyle, type TextColorValue } from '@/lib/cmsTextColor'
import { portableTextLinkTargetAttrs } from '@/lib/portableTextLink'
import { TEXT_COLOR_LEGACY_ALIASES, TEXT_COLOR_VALUES } from '@/sanity/lib/textColorField'
import { optionalTextSizeClass, textSizeBodyClass, type TextSizeValue } from '@/lib/cmsTextSize'
import { eyebrowTextClassName, eyebrowTextStyle } from '@/lib/eyebrowTypography'
import { parseBlockContentAlignment, type BlockContentAlignment } from '@/lib/blockContentAlignment'
import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react'
import { stegaClean } from 'next-sanity'

export type HubSpotFormBlockProps = {
  eyebrow?: string
  eyebrowColor?: TextColorValue
  eyebrowTextSize?: unknown
  heading?: string
  headingColor?: TextColorValue
  headingLevel?: unknown
  headingTextSize?: unknown
  description?: string | PortableTextBlock[]
  descriptionColor?: TextColorValue
  descriptionTextSize?: TextSizeValue
  descriptionLinkColor?: unknown
  descriptionLinksOpenInNewTab?: boolean
  portalId: string
  formId: string
  region?: string
  alignment?: BlockContentAlignment
}

function headingTag(value: unknown): 'h1' | 'h2' | 'h3' {
  const level = stegaClean(typeof value === 'string' ? value : '').trim()
  if (level === 'h1' || level === 'h2' || level === 'h3') return level
  return 'h2'
}

function chosenLinkColor(value: unknown): TextColorValue | undefined {
  const raw = stegaClean(typeof value === 'string' ? value : '').trim()
  if (!raw) return undefined
  if (raw in TEXT_COLOR_LEGACY_ALIASES || (TEXT_COLOR_VALUES as readonly string[]).includes(raw)) {
    return parseTextColor(raw, 'offWhite')
  }
  return undefined
}

function descriptionPortable(linkColor: unknown, openInNewTab?: boolean): PortableTextComponents {
  const color = chosenLinkColor(linkColor)
  const linkStyle = color ? linkMarkProps(color).style : undefined
  const target = portableTextLinkTargetAttrs(openInNewTab)
  return {
    block: {
      normal: ({ children }) => <span className="block">{children}</span>,
    },
    list: {
      bullet: ({ children }) => <ul className="m-0 list-disc pl-5">{children}</ul>,
      number: ({ children }) => <ol className="m-0 list-decimal pl-5">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      link: ({ children, value }) => {
        const href = stegaClean(typeof value?.href === 'string' ? value.href : '').trim() || '#'
        return (
          <a href={href} className="underline underline-offset-2" style={linkStyle} {...target}>
            {children}
          </a>
        )
      },
    },
  }
}

export function HubSpotFormBlock({
  eyebrow,
  eyebrowColor = 'yellow',
  eyebrowTextSize,
  heading,
  headingColor = 'offWhite',
  headingLevel,
  headingTextSize,
  description,
  descriptionColor = 'offWhite',
  descriptionTextSize = 'md',
  descriptionLinkColor,
  descriptionLinksOpenInNewTab = false,
  portalId,
  formId,
  region = 'na1',
  alignment = 'left',
}: HubSpotFormBlockProps) {
  const hasEyebrowOrHeading = Boolean(eyebrow?.trim() || heading?.trim())
  const isCenter = parseBlockContentAlignment(alignment) === 'center'
  const copyColumnClass = isCenter
    ? 'flex min-w-0 flex-1 flex-col items-center text-center'
    : 'flex min-w-0 flex-1 flex-col items-start text-left'
  const HeadingTag = headingTag(headingLevel)
  const headingSizeClass = optionalTextSizeClass(headingTextSize)
  const descriptionClass = `m-0 max-w-[592px] font-inter font-normal ${textSizeBodyClass(descriptionTextSize, 'md')}`
  const descriptionStyle = textColorStyle(descriptionColor, 'offWhite')
  const hasDescription = typeof description === 'string' ? Boolean(description.trim()) : Array.isArray(description) && description.length > 0

  return (
    <div className="flex flex-col items-stretch gap-[60px] lg:flex-row lg:items-start">
      <div className={copyColumnClass}>
        {hasEyebrowOrHeading ? (
          <div className="w-full max-w-[592px] pb-12">
            {eyebrow?.trim() ? (
              <p
                className={eyebrowTextClassName(eyebrowColor, {
                  extra: 'pb-2',
                  sizeClass: optionalTextSizeClass(eyebrowTextSize),
                })}
                style={eyebrowTextStyle(eyebrowColor).style}
              >
                {eyebrow}
              </p>
            ) : null}
            {heading?.trim() ? (
              <HeadingTag
                className={
                  headingSizeClass
                    ? `m-0 font-plex-sans font-normal ${headingSizeClass}`
                    : 'm-0 font-plex-sans text-[36px] font-normal leading-[42px] md:text-[48px] md:leading-[52px]'
                }
                style={textColorStyle(headingColor, 'offWhite')}
              >
                {heading}
              </HeadingTag>
            ) : null}
          </div>
        ) : null}
        {hasDescription ? (
          typeof description === 'string' ? (
            <p className={descriptionClass} style={descriptionStyle}>
              {description}
            </p>
          ) : (
            <div className={descriptionClass} style={descriptionStyle}>
              <PortableText
                value={description as PortableTextBlock[]}
                components={descriptionPortable(descriptionLinkColor, descriptionLinksOpenInNewTab)}
              />
            </div>
          )
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col pt-0 lg:pt-11">
        <HubSpotFormEmbed
          portalId={portalId}
          formId={formId}
          region={region}
          lazy
          className="w-full"
        />
      </div>
    </div>
  )
}
