import type { PortableTextBlock } from '@portabletext/react'
import { BlockSectionHeader, getBlockSectionHeader } from '@/components/blocks/BlockSectionHeader'
import { CodeEmbedBlock, CodeEmbedErrorBoundary } from '@/components/marketing-blocks'
import PageBlockLayout from '@/components/blocks/PageBlockLayout'
import PageBlockSection from '@/components/blocks/PageBlockSection'

export default function CodeEmbedBlockEntry({ block }: { block: any }) {
  const markup = typeof block?.markup === 'string' ? block.markup : ''
  const section = getBlockSectionHeader(block)
  const hasSectionHeader =
    Boolean(section.heading) || (Array.isArray(section.intro) && section.intro.length > 0)
  if (!markup.trim() && !hasSectionHeader) return null

  return (
    <PageBlockSection block={block} blockType="codeEmbedBlock">
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
        {markup.trim() ? (
        <CodeEmbedErrorBoundary key={block?._key ?? 'code-embed'}>
          <CodeEmbedBlock markup={markup} className="w-full" />
        </CodeEmbedErrorBoundary>
        ) : null}
      </PageBlockLayout>
    </PageBlockSection>
  )
}
