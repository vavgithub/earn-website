/** Visual theme for blocks nested in layout slots (hero columns, grid cells, etc.). */
export type LayoutSlotVariant = 'default' | 'gridCell' | 'hero'

/** Grid cell background from Sanity (`transparent` vs dark panel). */
export type GridCellSurface = 'dark' | 'transparent'

export type LayoutSlotBlockProps = {
  block: Record<string, unknown>
  embedded?: boolean
  slotVariant?: LayoutSlotVariant
  /** Set when `slotVariant` is `gridCell` (dark #141D19 panel vs no panel). */
  gridCellSurface?: GridCellSurface
}
