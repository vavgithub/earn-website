import { defineField } from 'sanity'
import { layoutWidthField } from './layoutWidthField'
import {
  blockPaddingFields,
  blockPaddingRowFieldset,
} from '../../lib/blockPaddingFields'
import { blockAlignmentField } from '../../lib/blockAlignmentField'

export { blockPaddingRowFieldset }

type BlockLayoutFieldsHidden =
  | boolean
  | ((context: { parent?: unknown; path?: unknown }) => boolean)

type BlockLayoutFieldsOptions = {
  layoutWidthHidden?: BlockLayoutFieldsHidden
  paddingHidden?: BlockLayoutFieldsHidden
  /** Include left / center alignment (Accordion, HubSpot form, How it works, etc.). */
  withAlignment?: boolean
  layoutWidthOverrides?: Partial<typeof layoutWidthField>
}

/** Layout width + optional alignment + side-by-side padding dropdowns. */
export function blockLayoutFields({
  layoutWidthHidden,
  paddingHidden,
  withAlignment = false,
  layoutWidthOverrides,
}: BlockLayoutFieldsOptions = {}) {
  const hidden = paddingHidden ?? layoutWidthHidden
  return [
    defineField({
      ...layoutWidthField,
      ...layoutWidthOverrides,
      ...(layoutWidthHidden ? { hidden: layoutWidthHidden } : {}),
    }),
    ...(withAlignment ? [blockAlignmentField()] : []),
    ...blockPaddingFields({ hidden }),
  ]
}
