import type { ComponentType } from 'react'
import type { Path } from '@sanity/client/csm'
import { createDataAttribute } from 'next-sanity'
import { isLayoutSlotBlockType } from '@/sanity/lib/layoutSlotBlocks'
import type {
  GridCellSurface,
  LayoutSlotBlockProps,
  LayoutSlotVariant,
} from '@/components/blocks/layoutSlotVariant'
import ImageBlockEntry from './ImageBlockEntry'
import RichTextSection from './RichTextSection'
import ButtonBlock from './ButtonBlock'

const slotComponents: Record<string, ComponentType<LayoutSlotBlockProps>> = {
  imageBlock: ImageBlockEntry,
  richTextSection: RichTextSection,
  buttonBlock: ButtonBlock,
}

type LayoutSlotBlocksProps = {
  blocks: unknown[] | null | undefined
  embedded?: boolean
  /** Grid cell portable text + slot styling. */
  variant?: LayoutSlotVariant
  /** When `variant` is `gridCell`, dark panel vs transparent cell. */
  gridCellSurface?: GridCellSurface
  className?: string
  documentId?: string
  documentType?: string
  studioBaseUrl?: string
  /** Path prefix before each block _key, e.g. ['pageBuilder', {_key: 'x'}, 'column1'] */
  pathPrefix?: Path
}

export function LayoutSlotBlocks({
  blocks,
  embedded = true,
  variant = 'default',
  gridCellSurface,
  className = 'flex flex-col gap-6',
  documentId,
  documentType,
  studioBaseUrl,
  pathPrefix,
}: LayoutSlotBlocksProps) {
  const list = Array.isArray(blocks) ? blocks : []
  if (list.length === 0) return null

  return (
    <div className={className}>
      {list.map((raw) => {
        const block = raw as { _type?: string; _key?: string }
        if (!block?._type || !block._key || !isLayoutSlotBlockType(block._type)) return null

        const Component = slotComponents[block._type]
        if (!Component) return null

        const presentationProps =
          documentId && documentType && studioBaseUrl && pathPrefix
            ? {
                'data-sanity': createDataAttribute({
                  id: documentId,
                  type: documentType,
                  baseUrl: studioBaseUrl,
                  path: [...pathPrefix, { _key: block._key }],
                }).toString(),
              }
            : {}

        return (
          <div key={block._key} {...presentationProps}>
            <Component
              block={block}
              embedded={embedded}
              slotVariant={variant}
              gridCellSurface={variant === 'gridCell' ? gridCellSurface : undefined}
            />
          </div>
        )
      })}
    </div>
  )
}
