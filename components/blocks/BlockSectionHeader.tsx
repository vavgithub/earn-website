import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { stegaClean } from 'next-sanity'
import { getBlockSectionIntroPortableComponents } from '@/components/blocks/blockSectionIntroPortableText'
import { getAccordionIntroPortableComponents } from '@/components/blocks/accordionPortableText'
import { parseSectionHeadingLevel, type SectionHeadingLevel } from '@/lib/cmsSectionHeadingLevel'
import { parseTextColor, type TextColorValue } from '@/lib/cmsTextColor'
import { parseTextSize, type TextSizeValue } from '@/lib/cmsTextSize'
import { parseLinksOpenInNewTab } from '@/lib/portableTextLink'
import {
  sectionHeadingClassName,
  sectionHeadingStyle,
  sectionHeadingTag,
} from '@/lib/sectionHeadingTypography'

function cleanSectionText(s: unknown) {
  return stegaClean(typeof s === 'string' ? s : String(s ?? '')).trim()
}

/** Resolve optional section heading + intro from a page-builder block document. */
export function getBlockSectionHeader(block: Record<string, unknown> | null | undefined) {
  if (!block) {
    return {
      heading: undefined as string | undefined,
      headingLevel: 'h2' as SectionHeadingLevel,
      intro: undefined as PortableTextBlock[] | undefined,
      headingColor: 'coral' as TextColorValue,
      introColor: 'blackGreen' as TextColorValue,
      introTextSize: 'md' as TextSizeValue,
      introLinkColor: 'green' as TextColorValue,
      introLinksOpenInNewTab: false,
    }
  }

  const type = typeof block._type === 'string' ? block._type : ''
  const usesGridNames = type === 'gridBlock' || type === 'accordionBlock'

  const headingRaw = usesGridNames ? block.heading : block.sectionHeading
  const heading = cleanSectionText(headingRaw)
  const introSource = usesGridNames ? block.intro : block.sectionIntro

  const intro: PortableTextBlock[] | undefined =
    Array.isArray(introSource) && introSource.length > 0
      ? (introSource as PortableTextBlock[])
      : undefined

  const headingLevel = parseSectionHeadingLevel(
    usesGridNames ? block.headingLevel : block.sectionHeadingLevel,
    'h2',
  )
  const headingColor = parseTextColor(
    usesGridNames ? block.headingColor : block.sectionHeadingColor,
    'coral',
  )
  const introColor = parseTextColor(
    usesGridNames ? block.introColor : block.sectionIntroColor,
    type === 'accordionBlock' ? 'offWhite' : 'blackGreen',
  )
  const introTextSize = parseTextSize(
    usesGridNames ? block.introTextSize : block.sectionIntroTextSize,
    'md',
  )
  const introLinkColor = parseTextColor(
    usesGridNames ? block.introLinkColor : block.sectionIntroLinkColor,
    usesGridNames && type === 'accordionBlock' ? 'offWhite' : 'green',
  )
  const introLinksOpenInNewTab = parseLinksOpenInNewTab(
    usesGridNames ? block.introLinksOpenInNewTab : block.sectionIntroLinksOpenInNewTab,
  )

  return {
    heading: heading || undefined,
    headingLevel,
    intro,
    headingColor,
    introColor,
    introTextSize,
    introLinkColor,
    introLinksOpenInNewTab,
  }
}

/** Renders optional section heading + intro from a page-builder block document. */
export function BlockSectionHeaderFromBlock({
  block,
  introOnDark,
  introMarginClass,
  className,
}: {
  block: Record<string, unknown>
  introOnDark?: boolean
  introMarginClass?: string
  className?: string
}) {
  const section = getBlockSectionHeader(block)
  return (
    <BlockSectionHeader
      heading={section.heading}
      headingLevel={section.headingLevel}
      intro={section.intro}
      headingColor={section.headingColor}
      introColor={section.introColor}
      introTextSize={section.introTextSize}
      introLinkColor={section.introLinkColor}
      introLinksOpenInNewTab={section.introLinksOpenInNewTab}
      introOnDark={introOnDark}
      introMarginClass={introMarginClass}
      className={className}
    />
  )
}

type BlockSectionHeaderProps = {
  heading?: string | null
  headingLevel?: SectionHeadingLevel
  intro?: PortableTextBlock[] | null
  headingColor?: TextColorValue
  introColor?: TextColorValue
  introTextSize?: TextSizeValue
  introLinkColor?: TextColorValue
  introLinksOpenInNewTab?: boolean
  /** Intro text on dark panels (accordion). */
  introOnDark?: boolean
  /** Spacing below intro before block content. */
  introMarginClass?: string
  className?: string
}

export function BlockSectionHeader({
  heading,
  headingLevel = 'h2',
  intro,
  headingColor = 'coral',
  introColor = 'blackGreen',
  introTextSize = 'md',
  introLinkColor = 'green',
  introLinksOpenInNewTab = false,
  introOnDark = false,
  introMarginClass = 'mb-7 md:mb-10',
  className = '',
}: BlockSectionHeaderProps) {
  const hasHeading = Boolean(heading?.trim())
  const hasIntro = Array.isArray(intro) && intro.length > 0
  if (!hasHeading && !hasIntro) return null

  const introComponents = introOnDark
    ? getAccordionIntroPortableComponents(
        introColor,
        introTextSize,
        introLinkColor,
        introLinksOpenInNewTab,
      )
    : getBlockSectionIntroPortableComponents(
        introColor,
        introTextSize,
        introLinkColor,
        introLinksOpenInNewTab,
      )

  const level = parseSectionHeadingLevel(headingLevel, 'h2')
  const HeadingTag = sectionHeadingTag(level)
  const headingClass = sectionHeadingClassName(level)
  const headingStyle = sectionHeadingStyle(headingColor, 'coral')

  return (
    <div className={`text-left ${className}`.trim()}>
      {hasHeading ? (
        <HeadingTag className={headingClass} style={headingStyle}>
          {heading}
        </HeadingTag>
      ) : null}
      {hasIntro ? (
        <div className={`max-w-none text-left ${hasHeading ? introMarginClass : 'mb-7 md:mb-10'}`}>
          <PortableText value={intro} components={introComponents} />
        </div>
      ) : null}
    </div>
  )
}
