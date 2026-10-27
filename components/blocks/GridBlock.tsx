import type { PortableTextBlock } from '@portabletext/react'
import { BlockSectionHeader, getBlockSectionHeader } from '@/components/blocks/BlockSectionHeader'
import PageBlockLayout from '@/components/blocks/PageBlockLayout'
import PageBlockSection from '@/components/blocks/PageBlockSection'
import { LayoutSlotBlocks } from '@/components/blocks/layoutSlotBlocks'
import { resolveGridCell } from '@/components/blocks/legacyLayoutSlots'

export default function GridBlock({ block }: { block: any }) {
  const rawItems = Array.isArray(block.items) ? block.items : []
  const section = getBlockSectionHeader(block)

  if (rawItems.length === 0) return null

  return (
    <PageBlockSection block={block} blockType="gridBlock">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[60px] items-stretch w-full">
          {rawItems.map((item: unknown, index: number) => {
            const row = item as { _key?: string; background?: string }
            const key = row._key || `grid-${index}`
            const slots = resolveGridCell(item)
            if (slots.length === 0) return null

            /** Legacy cells had no field and stay on the dark panel. Only explicit `transparent` clears it. */
            const useDarkPanel = row.background !== 'transparent'

            return (
              <div
                key={key}
                className={
                  useDarkPanel
                    ? 'flex min-h-full flex-1 flex-col items-stretch gap-4 self-stretch rounded-3xl bg-earn-work p-9'
                    : 'flex min-h-full flex-1 flex-col items-stretch gap-4 self-stretch'
                }
              >
                <LayoutSlotBlocks
                  blocks={slots}
                  embedded
                  variant="gridCell"
                  gridCellSurface={useDarkPanel ? 'dark' : 'transparent'}
                  className="flex flex-col gap-4"
                />
              </div>
            )
          })}
        </div>
      </PageBlockLayout>
    </PageBlockSection>
  )
}
