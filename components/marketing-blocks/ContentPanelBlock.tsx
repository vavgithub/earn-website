'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { getContentPanelBodyComponents } from '@/components/blocks/contentPanelPortableText'
import { LinkRuleChevron } from '@/components/ui/Button'
import { textColorStyle, type TextColorValue } from '@/lib/cmsTextColor'
import { textSizeBodyClass, type TextSizeValue } from '@/lib/cmsTextSize'
import { eyebrowTextClassName, eyebrowTextStyle } from '@/lib/eyebrowTypography'

export type ContentPanelVariant = 'mediaTextLight' | 'mediaTextDark' | 'actionPromo'

export type ContentPanelLink = {
  label: string
  href: string
  openInNewTab?: boolean
}

export type ContentPanelButton = {
  label: string
  href: string
  openInNewTab?: boolean
}

export type ContentPanelBlockProps = {
  variant: ContentPanelVariant
  heading?: string
  headingColor?: TextColorValue
  eyebrow?: string
  eyebrowColor?: TextColorValue
  body?: PortableTextBlock[]
  bodyTextColor?: TextColorValue
  bodyTextSize?: TextSizeValue
  bodyLinkColor?: TextColorValue
  bodyLinksOpenInNewTab?: boolean
  description?: string
  descriptionColor?: TextColorValue
  descriptionTextSize?: TextSizeValue
  imageUrl?: string
  imageAlt?: string
  link?: ContentPanelLink | null
  primaryButton?: ContentPanelButton | null
  secondaryButton?: ContentPanelButton | null
}

function isExternalHref(href: string) {
  const t = href.trim()
  return (
    /^https?:\/\//i.test(t) ||
    t.startsWith('mailto:') ||
    t.startsWith('tel:') ||
    t.startsWith('//')
  )
}

function normalizeInternalPath(href: string) {
  const t = href.trim()
  if (!t) return '/'
  if (isExternalHref(t)) return t
  return t.startsWith('/') ? t : `/${t}`
}

function PanelTextLink({
  label,
  href,
  openInNewTab,
  theme,
}: ContentPanelLink & { theme: 'light' | 'dark' }) {
  const className =
    theme === 'dark'
      ? 'inline-flex items-center gap-0 font-mokoko text-xl font-medium leading-5 text-[#1AAC66] no-underline transition-opacity hover:opacity-90'
      : 'inline-flex items-center gap-0 font-mokoko text-xl font-medium leading-5 text-[#142D21] no-underline transition-opacity hover:opacity-90'

  const content = (
    <>
      {label}
      <LinkRuleChevron />
    </>
  )

  if (isExternalHref(href) || openInNewTab) {
    return (
      <a
        href={href}
        className={className}
        {...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={normalizeInternalPath(href)} className={className}>
      {content}
    </Link>
  )
}

const promoButtonBase =
  'box-border flex w-full min-h-12 h-auto items-center justify-center rounded-[24px] px-6 py-3.5 text-center font-mokoko text-xl font-medium leading-6 text-balance whitespace-normal no-underline transition-opacity hover:opacity-90 sm:inline-flex sm:w-auto sm:max-w-full'

function PromoButton({
  button,
  variant,
}: {
  button: ContentPanelButton
  variant: 'primary' | 'secondary'
}) {
  const href = button.href.trim()
  const label = button.label.trim()
  const external = isExternalHref(href)
  const className =
    variant === 'primary'
      ? `${promoButtonBase} bg-[#155C3A] text-[#FDFDFB] sm:px-9`
      : `${promoButtonBase} border-2 border-solid border-[#F5F5ED] bg-transparent px-5 text-[#F5F5ED] sm:px-6`

  if (external || button.openInNewTab) {
    return (
      <a
        href={href}
        className={className}
        {...(button.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {label}
      </a>
    )
  }

  return (
    <Link href={normalizeInternalPath(href)} className={className}>
      {label}
    </Link>
  )
}

const panelShell: Record<ContentPanelVariant, string> = {
  mediaTextLight: 'bg-[#F7FBEB] text-[#141D19]',
  mediaTextDark: 'bg-[#142D21] text-[#FDFDFB]',
  actionPromo: 'bg-brand-red text-[#FDFDFB]',
}

function MediaTextPanel({
  variant,
  heading,
  headingColor = 'coral',
  body,
  bodyTextColor = 'blackGreen',
  bodyTextSize = 'md',
  bodyLinkColor = 'green',
  bodyLinksOpenInNewTab = false,
  imageUrl,
  imageAlt,
  link,
}: {
  variant: 'mediaTextLight' | 'mediaTextDark'
  heading?: string
  headingColor?: TextColorValue
  body?: PortableTextBlock[]
  bodyTextColor?: TextColorValue
  bodyTextSize?: TextSizeValue
  bodyLinkColor?: TextColorValue
  bodyLinksOpenInNewTab?: boolean
  imageUrl?: string
  imageAlt?: string
  link?: ContentPanelLink | null
}) {
  const isLight = variant === 'mediaTextLight'
  const headingClass = isLight
    ? 'm-0 pb-12 text-left font-mokoko text-[32px] font-medium leading-10'
    : 'm-0 pb-12 text-left font-mokoko text-[26px] font-medium leading-8'
  const headingStyle = textColorStyle(headingColor, 'coral')
  const bodyComponents = getContentPanelBodyComponents(
    isLight ? 'light' : 'dark',
    bodyTextColor,
    bodyTextSize,
    bodyLinkColor ?? 'green',
    bodyLinksOpenInNewTab,
  )

  const imageEl =
    imageUrl && imageAlt ? (
      <div className="relative aspect-[562/354] w-full overflow-hidden">
        <Image src={imageUrl} alt={imageAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
    ) : null

  const linkEl =
    link?.label && link.href ? (
      <PanelTextLink {...link} theme={isLight ? 'light' : 'dark'} />
    ) : null

  return (
    <>
      {heading?.trim() ? (
        <h2 className={headingClass} style={headingStyle}>
          {heading}
        </h2>
      ) : null}
      <div className="flex flex-col items-stretch gap-[60px] lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {body && body.length > 0 ? (
            <PortableText value={body} components={bodyComponents} />
          ) : null}
          {!isLight && linkEl ? linkEl : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {imageEl}
          {isLight && linkEl ? linkEl : null}
        </div>
      </div>
    </>
  )
}

function ActionPromoPanel({
  eyebrow,
  eyebrowColor = 'offWhite',
  heading,
  headingColor = 'offWhite',
  description,
  descriptionColor = 'offWhite',
  descriptionTextSize = 'md',
  primaryButton,
  secondaryButton,
}: {
  eyebrow?: string
  eyebrowColor?: TextColorValue
  heading?: string
  headingColor?: TextColorValue
  description?: string
  descriptionColor?: TextColorValue
  descriptionTextSize?: TextSizeValue
  primaryButton?: ContentPanelButton | null
  secondaryButton?: ContentPanelButton | null
}) {
  return (
    <div className="mx-auto w-full max-w-[960px]">
      {eyebrow?.trim() || heading?.trim() ? (
        <div className="max-w-[592px] pb-12">
          {eyebrow?.trim() ? (
            <p
              className={eyebrowTextClassName(eyebrowColor, { extra: 'pb-2' })}
              style={eyebrowTextStyle(eyebrowColor).style}
            >
              {eyebrow}
            </p>
          ) : null}
          {heading?.trim() ? (
            <h2
              className="m-0 font-mokoko text-[36px] font-normal leading-[42px] md:text-[48px] md:leading-[52px]"
              style={textColorStyle(headingColor, 'offWhite')}
            >
              {heading}
            </h2>
          ) : null}
        </div>
      ) : null}
      <div className="flex w-full max-w-[592px] flex-col gap-6">
        {description?.trim() ? (
          <p
            className={`m-0 font-inter font-normal ${textSizeBodyClass(descriptionTextSize, 'md')}`}
            style={textColorStyle(descriptionColor, 'offWhite')}
          >
            {description}
          </p>
        ) : null}
        {primaryButton?.label || secondaryButton?.label ? (
          <div className="flex w-full flex-col items-stretch gap-6 border-t-[3px] border-[#E9E9D7] pt-6 sm:items-start">
            {primaryButton?.label && primaryButton.href ? (
              <PromoButton button={primaryButton} variant="primary" />
            ) : null}
            {secondaryButton?.label && secondaryButton.href ? (
              <PromoButton button={secondaryButton} variant="secondary" />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function ContentPanelBlock({
  variant,
  heading,
  headingColor,
  eyebrow,
  eyebrowColor,
  body,
  bodyTextColor,
  bodyTextSize = 'md',
  bodyLinkColor = 'green',
  bodyLinksOpenInNewTab = false,
  description,
  descriptionColor,
  descriptionTextSize = 'md',
  imageUrl,
  imageAlt,
  link,
  primaryButton,
  secondaryButton,
}: ContentPanelBlockProps) {
  const isAction = variant === 'actionPromo'

  return (
    <section className={`w-full overflow-hidden rounded-[40px] px-12 py-[60px] ${panelShell[variant]}`}>
      {isAction ? (
        <ActionPromoPanel
          eyebrow={eyebrow}
          eyebrowColor={eyebrowColor}
          heading={heading}
          headingColor={headingColor}
          description={description}
          descriptionColor={descriptionColor}
          descriptionTextSize={descriptionTextSize}
          primaryButton={primaryButton}
          secondaryButton={secondaryButton}
        />
      ) : (
        <MediaTextPanel
          variant={variant}
          heading={heading}
          headingColor={headingColor}
          body={body}
          bodyTextColor={bodyTextColor}
          bodyTextSize={bodyTextSize}
          bodyLinkColor={bodyLinkColor}
          bodyLinksOpenInNewTab={bodyLinksOpenInNewTab}
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          link={link}
        />
      )}
    </section>
  )
}
