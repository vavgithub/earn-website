/**
 * Blocks allowed inside Hero / Two columns columns and each Grid cell (`gridCell.blocks`).
 * Not layout blocks (no nesting hero, grid, two-column inside slots).
 */
export const LAYOUT_SLOT_BLOCK_TYPES = [
  'imageBlock',
  'richTextSection',
  'buttonBlock',
] as const

export type LayoutSlotBlockType = (typeof LAYOUT_SLOT_BLOCK_TYPES)[number]

export const layoutSlotBlockTypeRefs = LAYOUT_SLOT_BLOCK_TYPES.map((type) => ({ type }))

export function isLayoutSlotBlockType(type: string): type is LayoutSlotBlockType {
  return (LAYOUT_SLOT_BLOCK_TYPES as readonly string[]).includes(type)
}

/** True when editing a block nested under column1, column2, or gridCell.blocks. */
export function isInsideLayoutSlot(path: unknown): boolean {
  if (!Array.isArray(path)) return false
  return path.some(
    (seg) => seg === 'column1' || seg === 'column2' || seg === 'blocks',
  )
}

/**
 * True only for blocks inside `gridBlock.items[].blocks` (grid cell content).
 * Not Hero `column1`/`column2`, not top-level page builder blocks.
 */
export function isInsideGridCell(path: unknown): boolean {
  if (!Array.isArray(path)) return false
  let pastGridItems = false
  for (const seg of path) {
    if (seg === 'items') pastGridItems = true
    else if (pastGridItems && seg === 'blocks') return true
  }
  return false
}

/** Section background applies only to blocks added directly on pageBuilder. */
export function isTopLevelPageBuilderBlock(path: unknown): boolean {
  return !isInsideLayoutSlot(path)
}
