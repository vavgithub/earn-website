import Image from 'next/image'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { BlockSectionHeader, getBlockSectionHeader } from '@/components/blocks/BlockSectionHeader'
import { urlForImage } from '@/sanity/lib/image'
import PageBlockLayout from '@/components/blocks/PageBlockLayout'
import { getGridCellPortableComponents } from '@/components/blocks/gridCellPortableText'
import type { GridCellSurface, LayoutSlotVariant } from '@/components/blocks/layoutSlotVariant'
import { createColoredPortableComponents } from '@/lib/createColoredPortableText'
import { parseTextColor, type TextColorValue } from '@/lib/cmsTextColor'
import { parseTextSize, type TextSizeValue } from '@/lib/cmsTextSize'
import { eyebrowTextClassName, eyebrowTextStyle } from '@/lib/eyebrowTypography'
import { resolveTextWithColor } from '@/lib/textWithColor'
import { parseLinksOpenInNewTab } from '@/lib/portableTextLink'
import PageBlockSection from '@/components/blocks/PageBlockSection'

function createRichTextPortableComponents(
  contentColor: TextColorValue,
  contentSize: TextSizeValue = 'md',
  linkColor: TextColorValue = 'green',
  linksOpenInNewTab = false,
): PortableTextComponents {
  return {
    ...createColoredPortableComponents({
      bodyColor: contentColor,
      headingColor: contentColor,
      bodySize: contentSize,
      linkColor,
      linksOpenInNewTab,
    }),
    types: {
      image: ({ value }) => {
        if (!value?.asset) return null
        const url = urlForImage(value)?.url()
        if (!url) return null
        return (
          <figure className="my-8 overflow-hidden rounded-xl shadow-lg">
            <div className="relative aspect-video w-full">
              <Image
                src={url}
                alt={value.alt || ''}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          </figure>
        )
      },
    },
  }
}

/** Legacy `maxWidth` on older rich text blocks → shared layout width. */
function resolveLayoutWidth(block: Record<string, unknown>): string {
  if (block.layoutWidth === 'content' || block.layoutWidth === 'reading' || block.layoutWidth === 'fullBleed') {
    return block.layoutWidth
  }
  const legacy = block.maxWidth
  if (legacy === 'prose') return 'reading'
  if (legacy === 'wide' || legacy === 'full') return 'content'
  return 'content'
}

export default function RichTextSection({
  block,
  embedded = false,
  slotVariant = 'default',
  gridCellSurface = 'dark',
}: {
  block: any
  embedded?: boolean
  slotVariant?: LayoutSlotVariant
  gridCellSurface?: GridCellSurface
}) {
  const section = getBlockSectionHeader(block)
  const contentColor = parseTextColor(block.contentTextColor, 'blackGreen')
  const contentTextSize = parseTextSize(block.contentTextSize, 'md')
  const contentLinkColor = parseTextColor(block.contentLinkColor, 'green')
  const contentLinksOpenInNewTab = parseLinksOpenInNewTab(block.contentLinksOpenInNewTab)

  const isGridCell = slotVariant === 'gridCell'
  const onDarkGrid = isGridCell && gridCellSurface === 'dark'
  const eyebrow = resolveTextWithColor(
    block.eyebrow,
    block.eyebrowColor,
    onDarkGrid ? 'offWhite' : 'green',
  )

  if (!block?.content && !section.heading && (!isGridCell && eyebrow.text)) return null
  const layoutWidth = resolveLayoutWidth(block)
  /** Column centering is `PageBlockLayout` (`mx-auto` on reading/content). This only aligns text inside the block. */
  const align = block.alignment === 'center' ? 'text-center' : 'text-left'
  const components = isGridCell
    ? getGridCellPortableComponents(
        gridCellSurface,
        contentColor,
        contentTextSize,
        contentLinkColor,
        contentLinksOpenInNewTab,
      )
    : createRichTextPortableComponents(
        contentColor,
        contentTextSize,
        contentLinkColor,
        contentLinksOpenInNewTab,
      )

  const eyebrowEl =
    !isGridCell && eyebrow.text ? (
      <p
        className={eyebrowTextClassName(eyebrow.color, {
          extra: onDarkGrid ? undefined : 'mb-10',
        })}
        style={eyebrowTextStyle(eyebrow.color).style}
      >
        {eyebrow.text}
      </p>
    ) : null

  const contentEl = (
    <div
      className={
        isGridCell
          ? 'max-w-none'
          : `prose-green max-w-none ${embedded ? '[&_h2]:mt-0 [&_h1]:mt-0' : ''}`
      }
    >
      <PortableText value={block.content} components={components} />
    </div>
  )

  if (embedded) {
    return (
      <div className={align}>
        {eyebrowEl}
        {contentEl}
      </div>
    )
  }

  return (
    <PageBlockSection block={block} blockType="richTextSection">
      <PageBlockLayout layoutWidth={layoutWidth} className={align}>
        {eyebrowEl}
        <BlockSectionHeader
          heading={section.heading}
          headingLevel={section.headingLevel}
          intro={section.intro}
          headingColor={section.headingColor}
          introColor={section.introColor}
          introTextSize={section.introTextSize}
          introLinkColor={section.introLinkColor}
        />
        {contentEl}
      </PageBlockLayout>
    </PageBlockSection>
  )
}
