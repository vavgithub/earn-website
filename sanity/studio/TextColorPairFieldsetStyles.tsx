'use client'

import { useEffect } from 'react'
import {
  BLOCK_PADDING_FIELDSET_NAME,
  BODY_ROW_RICH_TEXT_GRID_FIELDS,
  BODY_ROW_RICH_TEXT_GRID_PLACEMENT,
  type BodyRowRichTextFieldsetName,
  GRID_COLUMNS_BLOCK_PADDING,
  GRID_COLUMNS_BODY_RICH_TEXT,
  GRID_COLUMNS_SECTION_HEADING,
  GRID_COLUMNS_TABLE_TYPOGRAPHY,
  GRID_COLUMNS_TEXT_COLOR_PAIR,
  SECTION_HEADING_ROW_FIELDSET_NAME,
  TABLE_TYPOGRAPHY_FIELDSET_NAMES,
  TEXT_COLOR_PAIR_FIELDSET_NAMES,
} from '../lib/studioFieldsetLayout'

const STYLE_ID = 'earn-text-color-pair-fieldsets'

const NESTED_GRID_PROPS = [
  'display',
  'grid-template-columns',
  'width',
  'align-items',
] as const

const GRID_PLACEMENT_PROPS = ['grid-column', 'grid-row'] as const

const TEXT_COLOR_FIELDSET_SELECTOR = TEXT_COLOR_PAIR_FIELDSET_NAMES.map(
  (name) => `fieldset[data-testid='fieldset-${name}']`,
).join(',\n')

const BODY_RICH_TEXT_FIELDSET_SELECTOR = (
  Object.keys(BODY_ROW_RICH_TEXT_GRID_FIELDS) as BodyRowRichTextFieldsetName[]
)
  .map((name) => `fieldset[data-testid='fieldset-${name}']`)
  .join(',\n')

const TABLE_TYPOGRAPHY_FIELDSET_SELECTOR = TABLE_TYPOGRAPHY_FIELDSET_NAMES.map(
  (name) => `fieldset[data-testid='fieldset-${name}']`,
).join(',\n')

const SECTION_HEADING_ROW_SELECTOR = `fieldset[data-testid='fieldset-${SECTION_HEADING_ROW_FIELDSET_NAME}']`

export const TEXT_COLOR_PAIR_FIELDSET_CSS = `
/* Section heading — row 1: heading 100%; row 2: tag + color 50/50. Field order: heading, tag, color. */
${SECTION_HEADING_ROW_SELECTOR} > [class*='Content-'] > [data-ui='Grid'] {
  display: grid !important;
  grid-template-columns: ${GRID_COLUMNS_SECTION_HEADING} !important;
  width: 100% !important;
  align-items: start !important;
}

${SECTION_HEADING_ROW_SELECTOR} > [class*='Content-'] > [data-ui='Grid'] > * {
  min-width: 0 !important;
  max-width: 100% !important;
}

${SECTION_HEADING_ROW_SELECTOR} > [class*='Content-'] > [data-ui='Grid'] > *:nth-child(1) {
  grid-column: 1 / -1;
}

${SECTION_HEADING_ROW_SELECTOR} > [class*='Content-'] > [data-ui='Grid'] > *:nth-child(2) {
  grid-column: 1;
}

${SECTION_HEADING_ROW_SELECTOR} > [class*='Content-'] > [data-ui='Grid'] > *:nth-child(3) {
  grid-column: 2;
}

${SECTION_HEADING_ROW_SELECTOR} [data-testid^='field-'] [class*='Content-'] > [data-ui='Grid'],
${SECTION_HEADING_ROW_SELECTOR} [data-testid^='field-'] [data-ui='Grid'] {
  display: revert !important;
  grid-template-columns: revert !important;
  width: revert !important;
  align-items: revert !important;
}

/* Short text + color rows — 75% / 25% */
${TEXT_COLOR_FIELDSET_SELECTOR},
fieldset[data-testid='fieldset-descriptionRow'] > [class*='Content-'] > [data-ui='Grid'] {
  display: grid !important;
  grid-template-columns: ${GRID_COLUMNS_TEXT_COLOR_PAIR} !important;
  width: 100% !important;
  align-items: start !important;
}

${TEXT_COLOR_FIELDSET_SELECTOR} > [class*='Content-'] > [data-ui='Grid'] > *,
fieldset[data-testid='fieldset-descriptionRow'] > [class*='Content-'] > [data-ui='Grid'] > * {
  min-width: 0 !important;
  max-width: 100% !important;
}

${TEXT_COLOR_FIELDSET_SELECTOR} [data-testid^='field-'] [class*='Content-'] > [data-ui='Grid'],
${TEXT_COLOR_FIELDSET_SELECTOR} [data-testid^='field-'] [data-ui='Grid'],
fieldset[data-testid='fieldset-descriptionRow'] [data-testid^='field-'] [class*='Content-'] > [data-ui='Grid'],
fieldset[data-testid='fieldset-descriptionRow'] [data-testid^='field-'] [data-ui='Grid'] {
  display: revert !important;
  grid-template-columns: revert !important;
  width: revert !important;
  align-items: revert !important;
}

fieldset[data-testid='fieldset-descriptionRow'] > [class*='Content-'] > [data-ui='Grid'] > *:nth-child(1) {
  grid-row: 1 / span 2;
}
fieldset[data-testid='fieldset-descriptionRow'] > [class*='Content-'] > [data-ui='Grid'] > *:nth-child(2),
fieldset[data-testid='fieldset-descriptionRow'] > [class*='Content-'] > [data-ui='Grid'] > *:nth-child(3) {
  grid-column: 2;
}
fieldset[data-testid='fieldset-descriptionRow'] > [class*='Content-'] > [data-ui='Grid'] > *:nth-child(2) {
  grid-row: 1;
}
fieldset[data-testid='fieldset-descriptionRow'] > [class*='Content-'] > [data-ui='Grid'] > *:nth-child(3) {
  grid-row: 2;
}

/* Rich text rows — editor full width; size | color | link on row 2 */
${BODY_RICH_TEXT_FIELDSET_SELECTOR} > [class*='Content-'] > [data-ui='Grid'] {
  display: grid !important;
  grid-template-columns: ${GRID_COLUMNS_BODY_RICH_TEXT} !important;
  width: 100% !important;
  align-items: start !important;
  gap: 0.75rem 1rem !important;
}

${BODY_RICH_TEXT_FIELDSET_SELECTOR} > [class*='Content-'] > [data-ui='Grid'] > * {
  min-width: 0 !important;
  max-width: 100% !important;
}

${BODY_RICH_TEXT_FIELDSET_SELECTOR} [data-testid^='field-'] [class*='Content-'] > [data-ui='Grid'],
${BODY_RICH_TEXT_FIELDSET_SELECTOR} [data-testid^='field-'] [data-ui='Grid'] {
  display: revert !important;
  grid-template-columns: revert !important;
  width: revert !important;
  align-items: revert !important;
}

${(Object.keys(BODY_ROW_RICH_TEXT_GRID_FIELDS) as BodyRowRichTextFieldsetName[])
  .map(
    (fieldsetName) => `
fieldset[data-testid='fieldset-${fieldsetName}'] > [class*='Content-'] > [data-ui='Grid'] > *:nth-child(1),
fieldset[data-testid='fieldset-${fieldsetName}'] > [class*='Content-'] > [data-ui='Grid'] > [data-testid='${BODY_ROW_RICH_TEXT_GRID_FIELDS[fieldsetName][0]}'] {
  grid-column: 1 / -1 !important;
  grid-row: 1 !important;
}
fieldset[data-testid='fieldset-${fieldsetName}'] > [class*='Content-'] > [data-ui='Grid'] > *:nth-child(2),
fieldset[data-testid='fieldset-${fieldsetName}'] > [class*='Content-'] > [data-ui='Grid'] > [data-testid='${BODY_ROW_RICH_TEXT_GRID_FIELDS[fieldsetName][1]}'] {
  grid-column: 1 !important;
  grid-row: 2 !important;
}
fieldset[data-testid='fieldset-${fieldsetName}'] > [class*='Content-'] > [data-ui='Grid'] > *:nth-child(3),
fieldset[data-testid='fieldset-${fieldsetName}'] > [class*='Content-'] > [data-ui='Grid'] > [data-testid='${BODY_ROW_RICH_TEXT_GRID_FIELDS[fieldsetName][2]}'] {
  grid-column: 2 !important;
  grid-row: 2 !important;
}
fieldset[data-testid='fieldset-${fieldsetName}'] > [class*='Content-'] > [data-ui='Grid'] > *:nth-child(4),
fieldset[data-testid='fieldset-${fieldsetName}'] > [class*='Content-'] > [data-ui='Grid'] > [data-testid='${BODY_ROW_RICH_TEXT_GRID_FIELDS[fieldsetName][3]}'] {
  grid-column: 3 !important;
  grid-row: 2 !important;
}
fieldset[data-testid='fieldset-${fieldsetName}'] > [class*='Content-'] > [data-ui='Grid'] > *:nth-child(5),
fieldset[data-testid='fieldset-${fieldsetName}'] > [class*='Content-'] > [data-ui='Grid'] > [data-testid='${BODY_ROW_RICH_TEXT_GRID_FIELDS[fieldsetName][4]}'] {
  grid-column: 1 / -1 !important;
  grid-row: 3 !important;
}`,
  )
  .join('\n')}

/* Section padding — 50% / 50% */
fieldset[data-testid='fieldset-${BLOCK_PADDING_FIELDSET_NAME}'] > [class*='Content-'] > [data-ui='Grid'] {
  display: grid !important;
  grid-template-columns: ${GRID_COLUMNS_BLOCK_PADDING} !important;
  width: 100% !important;
  align-items: start !important;
}

fieldset[data-testid='fieldset-${BLOCK_PADDING_FIELDSET_NAME}'] > [class*='Content-'] > [data-ui='Grid'] > * {
  min-width: 0 !important;
  max-width: 100% !important;
}

/* Table typography — text size | text color (50% / 50%) */
${TABLE_TYPOGRAPHY_FIELDSET_SELECTOR} > [class*='Content-'] > [data-ui='Grid'] {
  display: grid !important;
  grid-template-columns: ${GRID_COLUMNS_TABLE_TYPOGRAPHY} !important;
  width: 100% !important;
  align-items: start !important;
}

${TABLE_TYPOGRAPHY_FIELDSET_SELECTOR} > [class*='Content-'] > [data-ui='Grid'] > * {
  min-width: 0 !important;
  max-width: 100% !important;
}

${TABLE_TYPOGRAPHY_FIELDSET_SELECTOR} [data-testid^='field-'] [class*='Content-'] > [data-ui='Grid'],
${TABLE_TYPOGRAPHY_FIELDSET_SELECTOR} [data-testid^='field-'] [data-ui='Grid'] {
  display: revert !important;
  grid-template-columns: revert !important;
  width: revert !important;
  align-items: revert !important;
}
`

function fieldsetNameFromElement(fieldset: HTMLFieldSetElement): string | null {
  const testId = fieldset.dataset.testid ?? ''
  if (!testId.startsWith('fieldset-')) return null
  return testId.slice('fieldset-'.length)
}

function gridColumnsForFieldset(name: string): string | null {
  if (name === BLOCK_PADDING_FIELDSET_NAME) return GRID_COLUMNS_BLOCK_PADDING
  if ((TABLE_TYPOGRAPHY_FIELDSET_NAMES as readonly string[]).includes(name)) {
    return GRID_COLUMNS_TABLE_TYPOGRAPHY
  }
  if (name === SECTION_HEADING_ROW_FIELDSET_NAME) return GRID_COLUMNS_SECTION_HEADING
  if (name in BODY_ROW_RICH_TEXT_GRID_FIELDS) return GRID_COLUMNS_BODY_RICH_TEXT
  if (name === 'descriptionRow') return GRID_COLUMNS_TEXT_COLOR_PAIR
  if ((TEXT_COLOR_PAIR_FIELDSET_NAMES as readonly string[]).includes(name)) {
    return GRID_COLUMNS_TEXT_COLOR_PAIR
  }
  return null
}

function countDirectFieldCells(grid: HTMLElement): number {
  return Array.from(grid.children).filter((child) => {
    if (!(child instanceof HTMLElement)) return false
    return (
      child.matches('[data-testid^="field-"]') ||
      child.querySelector('[data-testid^="field-"]') !== null
    )
  }).length
}

function findFieldsetRowGrid(fieldset: HTMLFieldSetElement): HTMLElement | null {
  let best: HTMLElement | null = null
  let bestCount = 0

  fieldset.querySelectorAll<HTMLElement>('[data-ui="Grid"]').forEach((grid) => {
    if (grid.closest('[data-testid^="field-"]')) return
    const count = countDirectFieldCells(grid)
    if (count > bestCount) {
      bestCount = count
      best = grid
    }
  })

  return best
}

function clearNestedFieldGridStyles(fieldset: HTMLFieldSetElement) {
  fieldset.querySelectorAll<HTMLElement>('[data-testid^="field-"] [data-ui="Grid"]').forEach(
    (grid) => {
      for (const prop of NESTED_GRID_PROPS) {
        grid.style.removeProperty(prop)
      }
    },
  )
}

function fieldGridCell(grid: HTMLElement, fieldTestId: string): HTMLElement | null {
  for (const child of grid.children) {
    if (!(child instanceof HTMLElement)) continue
    if (child.matches(`[data-testid="${fieldTestId}"]`)) return child
    if (child.querySelector(`[data-testid="${fieldTestId}"]`)) return child
  }
  return null
}

function patchBodyRichTextRowGrid(
  fieldsetName: BodyRowRichTextFieldsetName,
  grid: HTMLElement,
) {
  const fieldTestIds = BODY_ROW_RICH_TEXT_GRID_FIELDS[fieldsetName]
  const cells = Array.from(grid.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  )

  cells.forEach((child) => {
    for (const prop of GRID_PLACEMENT_PROPS) {
      child.style.removeProperty(prop)
    }
  })

  const placeByIndex = (index: number) => {
    const place = BODY_ROW_RICH_TEXT_GRID_PLACEMENT[index]
    const cell = cells[index]
    if (!cell) return
    cell.style.setProperty('grid-column', place.column, 'important')
    cell.style.setProperty('grid-row', place.row, 'important')
  }

  let placed = 0
  fieldTestIds.forEach((fieldTestId, index) => {
    const cell = fieldGridCell(grid, fieldTestId)
    if (!cell) return
    const place = BODY_ROW_RICH_TEXT_GRID_PLACEMENT[index]
    cell.style.setProperty('grid-column', place.column, 'important')
    cell.style.setProperty('grid-row', place.row, 'important')
    placed += 1
  })

  if (placed < BODY_ROW_RICH_TEXT_GRID_PLACEMENT.length && cells.length >= BODY_ROW_RICH_TEXT_GRID_PLACEMENT.length) {
    for (let i = 0; i < BODY_ROW_RICH_TEXT_GRID_PLACEMENT.length; i++) placeByIndex(i)
  }
}

function patchFieldsetRowGrids(root: ParentNode = document) {
  root.querySelectorAll<HTMLFieldSetElement>('fieldset[data-testid^="fieldset-"]').forEach(
    (fieldset) => {
      const name = fieldsetNameFromElement(fieldset)
      const columns = name ? gridColumnsForFieldset(name) : null
      if (!columns) return

      clearNestedFieldGridStyles(fieldset)

      const grid = findFieldsetRowGrid(fieldset)
      if (!grid) return

      grid.style.setProperty('display', 'grid', 'important')
      grid.style.setProperty('grid-template-columns', columns, 'important')
      grid.style.setProperty('width', '100%', 'important')
      grid.style.setProperty('align-items', 'start', 'important')
      if (name && name in BODY_ROW_RICH_TEXT_GRID_FIELDS) {
        grid.style.setProperty('gap', '0.75rem 1rem', 'important')
        grid.style.setProperty('grid-auto-flow', 'row', 'important')
      } else {
        grid.style.removeProperty('gap')
        grid.style.removeProperty('grid-auto-flow')
      }

      Array.from(grid.children).forEach((child) => {
        if (!(child instanceof HTMLElement)) return
        child.style.setProperty('min-width', '0', 'important')
        child.style.setProperty('max-width', '100%', 'important')
      })

      if (name && name in BODY_ROW_RICH_TEXT_GRID_FIELDS) {
        patchBodyRichTextRowGrid(name as BodyRowRichTextFieldsetName, grid)
      }
    },
  )
}

export function TextColorPairFieldsetStyles() {
  useEffect(() => {
    if (typeof document === 'undefined') return

    let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = STYLE_ID
      document.head.appendChild(el)
    }
    el.textContent = TEXT_COLOR_PAIR_FIELDSET_CSS

    patchFieldsetRowGrids()

    let raf = 0
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => patchFieldsetRowGrids())
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  return null
}
