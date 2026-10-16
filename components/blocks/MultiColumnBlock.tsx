import type { PortableTextBlock } from '@portabletext/react'
import { stegaClean } from 'next-sanity'
import { BlockSectionHeader, getBlockSectionHeader } from '@/components/blocks/BlockSectionHeader'
import PageBlockLayout from '@/components/blocks/PageBlockLayout'
import PageBlockSection from '@/components/blocks/PageBlockSection'
import { LayoutSlotBlocks } from '@/components/blocks/layoutSlotBlocks'
import { resolveColumnSlots } from '@/components/blocks/legacyLayoutSlots'

function columnVerticalAlignClass(value: unknown): string {
  const v = stegaClean(typeof value === 'string' ? value : String(value ?? '')).trim()
  if (v === 'center') return 'items-start md:items-center'
  if (v === 'bottom') return 'items-start md:items-end'
  return 'items-start'
}

export default function MultiColumnBlock({ block }: { block: any }) {
  const column1 = resolveColumnSlots(block.column1)
  const column2 = resolveColumnSlots(block.column2)
  const section = getBlockSectionHeader(block)

  if (column1.length === 0 && column2.length === 0) return null

  return (
    <PageBlockSection block={block} blockType="multiColumnBlock">
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
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 ${columnVerticalAlignClass(block.columnVerticalAlign)}`}
        >
          <LayoutSlotBlocks blocks={column1} embedded />
          <LayoutSlotBlocks blocks={column2} embedded />
        </div>
      </PageBlockLayout>
    </PageBlockSection>
  )
}
