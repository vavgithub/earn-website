import { stegaClean } from 'next-sanity'
import { AccordionBlock } from '@/components/marketing-blocks'
import { getBlockSectionHeader } from '@/components/blocks/BlockSectionHeader'
import PageBlockLayout from '@/components/blocks/PageBlockLayout'
import PageBlockSection from '@/components/blocks/PageBlockSection'
import { blockContentAlignmentClass, parseBlockContentAlignment } from '@/lib/blockContentAlignment'
import { parseTextColor } from '@/lib/cmsTextColor'
import { isSectionBackgroundDark } from '@/lib/sectionBackground'

type AccordionItemDoc = {
  question?: string
  answer?: string
}

export default function AccordionBlockEntry({ block }: { block: any }) {
  const section = getBlockSectionHeader(block)

  const rawItems: AccordionItemDoc[] = Array.isArray(block?.items) ? block.items : []
  const items = rawItems
    .map((row) => {
      const question = typeof row?.question === 'string' ? stegaClean(row.question).trim() : ''
      const answer = typeof row?.answer === 'string' ? stegaClean(row.answer).trim() : ''
      return { question, answer }
    })
    .filter((row) => row.question.length > 0 && row.answer.length > 0)

  if (items.length === 0) return null

  const introOnDark = isSectionBackgroundDark(block?.sectionBackground, 'darkBeige')
  const alignClass = blockContentAlignmentClass(block?.alignment)

  return (
    <PageBlockSection
      block={block}
      blockType="accordionBlock"
      defaultBackground="darkBeige"
    >
      <PageBlockLayout
        layoutWidth={block.layoutWidth ?? 'content'}
        className={alignClass}
      >
        <AccordionBlock
          heading={section.heading || undefined}
          intro={section.intro ?? undefined}
          headingColor={section.headingColor}
          introColor={section.introColor}
          introTextSize={section.introTextSize}
          introLinkColor={section.introLinkColor}
          introOnDark={introOnDark}
          questionColor={parseTextColor(block.questionColor, 'lightGreen')}
          alignment={parseBlockContentAlignment(block?.alignment)}
          items={items}
        />
      </PageBlockLayout>
    </PageBlockSection>
  )
}
