/** Fieldset `name` values — keep in sync with `sanity/studio/textColorPairFieldsets.css`. */

/** Section heading row: heading full width; tag + color 50% / 50% on second row. */
export const SECTION_HEADING_ROW_FIELDSET_NAME = 'sectionHeadingRow' as const

/** Text & headings content row. */
export const CONTENT_ROW_FIELDSET_NAME = 'contentRow' as const

/** Short text + color (~75% / ~25%), e.g. eyebrow. */
export const TEXT_COLOR_PAIR_FIELDSET_NAMES = [
  'headingRow',
  'eyebrowRow',
  'labelRow',
] as const

/** Rich text full width; size + text color + link color on one row below. */
export const BODY_RICH_TEXT_FIELDSET_NAMES = [
  'sectionIntroRow',
  'introRow',
  'bodyRow',
  CONTENT_ROW_FIELDSET_NAME,
  'modalHeroIntroRow',
] as const

export const BLOCK_PADDING_FIELDSET_NAME = 'blockPaddingRow' as const

/** Table block — text size + color side by side (50% / 50%). */
export const TABLE_TYPOGRAPHY_FIELDSET_NAMES = [
  'columnHeadingTypographyRow',
  'cellTypographyRow',
] as const

export const GRID_COLUMNS_TEXT_COLOR_PAIR = 'minmax(0, 75%) minmax(0, 25%)'
export const GRID_COLUMNS_BODY_RICH_TEXT = 'repeat(3, minmax(0, 1fr))'
export const GRID_COLUMNS_SECTION_HEADING = 'minmax(0, 50%) minmax(0, 50%)'
export const GRID_COLUMNS_BLOCK_PADDING = 'minmax(0, 50%) minmax(0, 50%)'
export const GRID_COLUMNS_TABLE_TYPOGRAPHY = GRID_COLUMNS_BLOCK_PADDING

/**
 * Rich text body rows — field order: editor, text size, text color, link color, open in new tab.
 * Keep in sync with `sanity/studio/textColorPairFieldsets.css`.
 */
export const BODY_ROW_RICH_TEXT_GRID_FIELDS = {
  contentRow: [
    'field-content',
    'field-contentTextSize',
    'field-contentTextColor',
    'field-contentLinkColor',
    'field-contentLinksOpenInNewTab',
  ],
  sectionIntroRow: [
    'field-sectionIntro',
    'field-sectionIntroTextSize',
    'field-sectionIntroColor',
    'field-sectionIntroLinkColor',
    'field-sectionIntroLinksOpenInNewTab',
  ],
  introRow: [
    'field-intro',
    'field-introTextSize',
    'field-introColor',
    'field-introLinkColor',
    'field-introLinksOpenInNewTab',
  ],
  bodyRow: [
    'field-body',
    'field-bodyTextSize',
    'field-bodyTextColor',
    'field-bodyLinkColor',
    'field-bodyLinksOpenInNewTab',
  ],
  modalHeroIntroRow: [
    'field-modalHeroIntro',
    'field-modalHeroIntroTextSize',
    'field-modalHeroIntroTextColor',
    'field-modalHeroIntroLinkColor',
    'field-modalHeroIntroLinksOpenInNewTab',
  ],
} as const

/** Row 2: size | color | link. Row 3: open in new tab (full width). */
export const BODY_ROW_RICH_TEXT_GRID_PLACEMENT = [
  { column: '1 / -1', row: '1' },
  { column: '1', row: '2' },
  { column: '2', row: '2' },
  { column: '3', row: '2' },
  { column: '1 / -1', row: '3' },
] as const

export type BodyRowRichTextFieldsetName = keyof typeof BODY_ROW_RICH_TEXT_GRID_FIELDS
