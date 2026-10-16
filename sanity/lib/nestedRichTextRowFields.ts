import { defineField } from 'sanity'
import { bodyRichTextFieldset } from './textColorPairFieldset'
import {
  bodyTextColorField,
  linkColorField,
  linksOpenInNewTabField,
  type TextColorValue,
} from './textColorField'
import { textSizeField } from './textSizeField'

export { bodyRichTextFieldset as nestedRichTextRowFieldset }

export type NestedRichTextRowFieldsOptions = {
  /** Fieldset name — use `contentRow` when field names match the standard content* pattern. */
  fieldset: string
  /** Base field name for blockContent and derived controls (e.g. `content`, `modalHeroIntro`). */
  prefix?: string
  blockTitle?: string
  blockDescription?: string
  required?: boolean
  linkColorInitialValue?: TextColorValue
  bodyColorInitialValue?: TextColorValue
}

/**
 * Rich text + text size + text color + link color + open in new tab for nested array items
 * (How it works steps, resource modal sections, etc.).
 */
export function nestedRichTextRowFields({
  fieldset,
  prefix = 'content',
  blockTitle = 'Content',
  blockDescription,
  required = false,
  linkColorInitialValue = 'green',
  bodyColorInitialValue = 'blackGreen',
}: NestedRichTextRowFieldsOptions) {
  return [
    defineField({
      name: prefix,
      title: blockTitle,
      type: 'blockContent',
      fieldset,
      ...(blockDescription ? { description: blockDescription } : {}),
      ...(required ? { validation: (Rule) => Rule.required() } : {}),
    }),
    textSizeField({
      name: `${prefix}TextSize`,
      fieldset,
    }),
    bodyTextColorField({
      name: `${prefix}TextColor`,
      initialValue: bodyColorInitialValue,
      fieldset,
    }),
    linkColorField({
      name: `${prefix}LinkColor`,
      initialValue: linkColorInitialValue,
      fieldset,
    }),
    linksOpenInNewTabField({
      name: `${prefix}LinksOpenInNewTab`,
      fieldset,
    }),
  ]
}
