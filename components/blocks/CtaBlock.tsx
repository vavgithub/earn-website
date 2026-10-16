import type { PortableTextBlock } from '@portabletext/react'
import { BlockSectionHeader, getBlockSectionHeader } from '@/components/blocks/BlockSectionHeader'
import { ButtonLink, buttonClasses } from '@/components/ui/Button'
import PageBlockLayout from '@/components/blocks/PageBlockLayout'
import PageBlockSection from '@/components/blocks/PageBlockSection'

function ArrowIcon() {
  return (
    <svg className="size-[1.1em] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  )
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

export default function CtaBlock({ block }: { block: any }) {
  if (!block) return null

  const section = getBlockSectionHeader(block)
  const buttonText = block.buttonText as string | undefined
  const buttonUrl = block.buttonUrl as string | undefined
  const hasButton = Boolean(buttonText?.trim() && buttonUrl?.trim())
  const hasSectionHeader =
    Boolean(section.heading) || (Array.isArray(section.intro) && section.intro.length > 0)

  if (!hasButton && !hasSectionHeader) return null

  const btnStyle = { variant: 'primary' as const, size: 'lg' as const, shape: 'pill' as const }
  const btnClass = buttonClasses(btnStyle)

  return (
    <PageBlockSection block={block} blockType="ctaBlock">
      <PageBlockLayout layoutWidth={block.layoutWidth}>
        <BlockSectionHeader
          heading={section.heading}
          headingLevel={section.headingLevel}
          intro={section.intro as PortableTextBlock[]}
          headingColor={section.headingColor}
          introColor={section.introColor}
          introTextSize={section.introTextSize}
          introLinkColor={section.introLinkColor}
        />
        {hasButton ? (
          <div className="flex justify-center">
            {isExternalHref(buttonUrl as string) ? (
              <a
                href={(buttonUrl as string).trim()}
                className={btnClass}
                target="_blank"
                rel="noopener noreferrer"
              >
                {buttonText}
                <span className="inline-flex shrink-0 [&_svg]:size-[1.1em]">
                  <ArrowIcon />
                </span>
              </a>
            ) : (
              <ButtonLink
                href={normalizeInternalPath(buttonUrl as string)}
                {...btnStyle}
                rightIcon={<ArrowIcon />}
              >
                {buttonText}
              </ButtonLink>
            )}
          </div>
        ) : null}
      </PageBlockLayout>
    </PageBlockSection>
  )
}
