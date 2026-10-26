import { defineField } from 'sanity'
import { bodyTextColorField, linkColorField, linksOpenInNewTabField, textColorField, type TextColorValue } from './textColorField'
import { bodyRichTextFieldset, textColorPairFieldset } from './textColorPairFieldset'
import { textSizeField } from './textSizeField'

export const gridAccordionHeaderFieldsets = [
  textColorPairFieldset('headingRow', 'Section heading'),
  bodyRichTextFieldset('introRow', 'Intro'),
] as const

export function gridAccordionHeaderFields(introColorDefault: TextColorValue) {
  return [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      fieldset: 'headingRow',
    }),
    textColorField({
      name: 'headingColor',
      initialValue: 'yellow',
      fieldset: 'headingRow',
    }),
    defineField({
      name: 'intro',
      title: 'Intro text',
      type: 'blockContent',
      description: 'Rich text below the heading and above the block content.',
      fieldset: 'introRow',
    }),
    textSizeField({
      name: 'introTextSize',
      fieldset: 'introRow',
    }),
    bodyTextColorField({
      name: 'introColor',
      initialValue: introColorDefault,
      fieldset: 'introRow',
    }),
    linkColorField({
      name: 'introLinkColor',
      fieldset: 'introRow',
    }),
    linksOpenInNewTabField({
      name: 'introLinksOpenInNewTab',
      fieldset: 'introRow',
    }),
  ]
}
