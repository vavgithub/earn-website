import type { PortableTextBlock } from '@portabletext/react'
import { stegaClean } from 'next-sanity'
import { BlockSectionHeader, getBlockSectionHeader } from '@/components/blocks/BlockSectionHeader'
import PageBlockLayout from '@/components/blocks/PageBlockLayout'
import PageBlockSection from '@/components/blocks/PageBlockSection'
import { LayoutSlotBlocks } from '@/components/blocks/layoutSlotBlocks'
import { resolveHeroColumns } from '@/components/blocks/legacyLayoutSlots'

function columnVerticalAlignClass(value: unknown): string {
  const v = stegaClean(typeof value === 'string' ? value : String(value ?? '')).trim()
  if (v === 'center') return 'items-start lg:items-center'
  if (v === 'bottom') return 'items-start lg:items-end'
  return 'items-start'
}

export default function HeroBlog({ block }: { block: any }) {
  const { column1, column2 } = resolveHeroColumns(block)
  const section = getBlockSectionHeader(block)

  if (column1.length === 0 && column2.length === 0) return null

  return (
    <PageBlockSection
      block={block}
      blockType="heroBlog"
      className="relative overflow-hidden text-gray-900"
    >
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
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${columnVerticalAlignClass(block.columnVerticalAlign)}`}
        >
          <LayoutSlotBlocks
            blocks={column1}
            embedded
            variant="hero"
            className="flex flex-col gap-6 max-w-2xl"
          />
          <LayoutSlotBlocks blocks={column2} embedded variant="hero" className="flex flex-col gap-6" />
        </div>
      </PageBlockLayout>
    </PageBlockSection>
  )
}
