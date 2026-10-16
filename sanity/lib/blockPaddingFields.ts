import { defineField } from 'sanity'

export const BLOCK_PADDING_VALUES = ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const

export type BlockPaddingValue = (typeof BLOCK_PADDING_VALUES)[number]

export const BLOCK_PADDING_OPTIONS = [
  { title: 'None (0px)', value: 'none' },
  { title: 'Xsmall (12px)', value: 'xs' },
  { title: 'Sm (24px)', value: 'sm' },
  { title: 'Med (48px)', value: 'md' },
  { title: 'Lg (80px)', value: 'lg' },
  { title: 'XL (160px)', value: 'xl' },
  { title: 'XXL (200px)', value: 'xxl' },
] as const

/** Side-by-side padding dropdowns (50% / 50% in Studio) — place after layout width. */
export const blockPaddingRowFieldset = {
  name: 'blockPaddingRow',
  title: 'Section padding',
  options: { columns: 2 as const },
} as const

type BlockPaddingFieldHidden =
  | boolean
  | ((context: { parent?: unknown; path?: unknown }) => boolean)

type BlockPaddingFieldOptions = {
  hidden?: BlockPaddingFieldHidden
}

export function blockPaddingFields({ hidden }: BlockPaddingFieldOptions = {}) {
  return [
    defineField({
      name: 'paddingTop',
      title: 'Padding top',
      type: 'string',
      fieldset: blockPaddingRowFieldset.name,
      description: 'Top spacing for this block. Empty uses the block type default.',
      options: {
        list: [...BLOCK_PADDING_OPTIONS],
        layout: 'dropdown',
      },
      hidden,
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding bottom',
      type: 'string',
      fieldset: blockPaddingRowFieldset.name,
      description: 'Bottom spacing for this block. Empty uses the block type default.',
      options: {
        list: [...BLOCK_PADDING_OPTIONS],
        layout: 'dropdown',
      },
      hidden,
    }),
  ]
}
