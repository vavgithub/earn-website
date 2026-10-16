import { defineField } from 'sanity'
import {
  DEFAULT_SECTION_BACKGROUND,
  SECTION_BACKGROUND_STUDIO_OPTIONS,
  type SectionBackgroundValue,
} from '../../lib/sectionBackgroundTokens'
import { isInsideLayoutSlot } from './layoutSlotBlocks'

export type { SectionBackgroundValue }

type SectionBackgroundFieldOptions = {
  /**
   * Hide when the block lives inside Hero / Two columns / Grid cell slots.
   * Use for image, text, and button types that also appear nested in columns.
   */
  onlyTopLevel?: boolean
  /** Studio default when the field is first added. */
  initialValue?: SectionBackgroundValue
}

/** Full-width band behind a top-level page-builder block. */
export function sectionBackgroundField(options?: SectionBackgroundFieldOptions) {
  const initialValue = options?.initialValue ?? DEFAULT_SECTION_BACKGROUND

  return defineField({
    name: 'sectionBackground',
    title: 'Section background',
    type: 'string',
    description:
      'Full-width background behind this block on the page. Pick a named brand color (hex shown in the list).',
    options: {
      list: SECTION_BACKGROUND_STUDIO_OPTIONS,
      layout: 'dropdown',
    },
    initialValue,
    hidden: options?.onlyTopLevel
      ? ({ path }) => isInsideLayoutSlot(path)
      : undefined,
  })
}
