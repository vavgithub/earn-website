import { stegaClean } from 'next-sanity'
import {
  BLOCK_PADDING_VALUES,
  type BlockPaddingValue,
} from '@/sanity/lib/blockPaddingFields'

export type { BlockPaddingValue }

export const BLOCK_PADDING_TOP_CLASS: Record<BlockPaddingValue, string> = {
  none: 'pt-0',
  xs: 'pt-[12px]',
  sm: 'pt-[24px]',
  md: 'pt-[48px]',
  lg: 'pt-[80px]',
  xl: 'pt-[160px]',
  xxl: 'pt-[200px]',
}

export const BLOCK_PADDING_BOTTOM_CLASS: Record<BlockPaddingValue, string> = {
  none: 'pb-0',
  xs: 'pb-[12px]',
  sm: 'pb-[24px]',
  md: 'pb-[48px]',
  lg: 'pb-[80px]',
  xl: 'pb-[160px]',
  xxl: 'pb-[200px]',
}

/** Defaults when CMS fields are empty — matches pre-padding Tailwind per block type. */
export const PAGE_BLOCK_PADDING_DEFAULTS: Record<
  string,
  { top: BlockPaddingValue; bottom: BlockPaddingValue }
> = {
  richTextSection: { top: 'md', bottom: 'md' },
  ctaBlock: { top: 'md', bottom: 'md' },
  multiColumnBlock: { top: 'md', bottom: 'md' },
  contentPanelBlock: { top: 'md', bottom: 'md' },
  gridBlock: { top: 'lg', bottom: 'md' },
  heroBlog: { top: 'lg', bottom: 'md' },
  imageBlock: { top: 'sm', bottom: 'sm' },
  codeEmbedBlock: { top: 'sm', bottom: 'sm' },
  tableBlock: { top: 'lg', bottom: 'sm' },
  buttonBlock: { top: 'sm', bottom: 'sm' },
  accordionBlock: { top: 'sm', bottom: 'sm' },
  howItWorksStepsBlock: { top: 'none', bottom: 'none' },
  hubspotFormBlock: { top: 'sm', bottom: 'sm' },
}

const FALLBACK_PADDING: { top: BlockPaddingValue; bottom: BlockPaddingValue } = {
  top: 'md',
  bottom: 'md',
}

function cleanString(raw: unknown): string {
  return stegaClean(typeof raw === 'string' ? raw : String(raw ?? '')).trim()
}

export function parseBlockPadding(
  raw: unknown,
): BlockPaddingValue | undefined {
  const s = cleanString(raw)
  if ((BLOCK_PADDING_VALUES as readonly string[]).includes(s)) {
    return s as BlockPaddingValue
  }
  return undefined
}

/** Legacy `buttonBlock.sectionPadding` before unified padding fields. */
function legacyButtonBottomPadding(sectionPadding: unknown): {
  bottom?: BlockPaddingValue
  extraClass?: string
} {
  const p = cleanString(sectionPadding)
  if (p === '80') return { bottom: 'lg' }
  if (p === '120') return { extraClass: 'pb-[120px]' }
  if (p === 'default' || p === '') return { bottom: 'sm' }
  return {}
}

export type ResolvedBlockPadding = {
  top: BlockPaddingValue
  bottom: BlockPaddingValue
  extraClass?: string
}

export function resolveBlockPadding(
  block: Record<string, unknown> | null | undefined,
  blockType?: string,
): ResolvedBlockPadding {
  const defaults =
    (blockType && PAGE_BLOCK_PADDING_DEFAULTS[blockType]) ?? FALLBACK_PADDING

  let top = parseBlockPadding(block?.paddingTop) ?? defaults.top
  let bottom = parseBlockPadding(block?.paddingBottom)
  let extraClass: string | undefined

  if (bottom === undefined && blockType === 'buttonBlock' && block?.sectionPadding) {
    const legacy = legacyButtonBottomPadding(block.sectionPadding)
    bottom = legacy.bottom
    extraClass = legacy.extraClass
  }

  if (bottom === undefined) {
    bottom = defaults.bottom
  }

  return { top, bottom, extraClass }
}

export function blockPaddingClassName(resolved: ResolvedBlockPadding): string {
  const parts = [
    BLOCK_PADDING_TOP_CLASS[resolved.top],
    resolved.extraClass ?? BLOCK_PADDING_BOTTOM_CLASS[resolved.bottom],
  ]
  return parts.filter(Boolean).join(' ')
}
