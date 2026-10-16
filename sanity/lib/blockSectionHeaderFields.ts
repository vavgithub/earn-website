import { defineField } from 'sanity'
import { bodyTextColorField, linkColorField, linksOpenInNewTabField } from './textColorField'
import { bodyRichTextFieldset } from './textColorPairFieldset'
import { textSizeField } from './textSizeField'
import {
  sectionHeadingRowFieldset,
  sectionHeadingRowFields,
} from './sectionHeadingRowFields'

/** Section heading (50/25/25) + intro row. Spread `fieldsets` on the block type too. */
export const blockSectionHeaderFieldsets = [
  sectionHeadingRowFieldset(),
  bodyRichTextFieldset('sectionIntroRow', 'Intro'),
] as const

/** Optional section title + intro (grid uses `heading` / `intro` instead — see getBlockSectionHeader). */
export const blockSectionHeaderFields = [
  ...sectionHeadingRowFields(),
  defineField({
    name: 'sectionIntro',
    title: 'Intro text',
    type: 'blockContent',
    description: 'Rich text below the section heading.',
    fieldset: 'sectionIntroRow',
  }),
  textSizeField({
    name: 'sectionIntroTextSize',
    fieldset: 'sectionIntroRow',
  }),
  bodyTextColorField({
    name: 'sectionIntroColor',
    fieldset: 'sectionIntroRow',
  }),
  linkColorField({
    name: 'sectionIntroLinkColor',
    fieldset: 'sectionIntroRow',
  }),
  linksOpenInNewTabField({
    name: 'sectionIntroLinksOpenInNewTab',
    fieldset: 'sectionIntroRow',
  }),
]
