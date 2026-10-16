import { defineField, defineType } from 'sanity'
import { BlockElementIcon } from '@sanity/icons'
import {
  blockLayoutFields,
  blockPaddingRowFieldset,
} from './blockLayoutFields'
import { bodyTextColorField, linkColorField, linksOpenInNewTabField, textColorField } from '../../lib/textColorField'
import { sectionBackgroundField } from '../../lib/sectionBackgroundField'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'
import { bodyRichTextFieldset, bodyTextPairFieldset, textColorPairFieldset } from '../../lib/textColorPairFieldset'
import { textSizeField } from '../../lib/textSizeField'

const PANEL_VARIANTS = [
  {
    title: 'Media + text (light)',
    value: 'mediaTextLight',
    description: 'Cream panel · body left · image + text link right',
  },
  {
    title: 'Media + text (dark)',
    value: 'mediaTextDark',
    description: 'Dark green panel · body + green link left · image right',
  },
  {
    title: 'Action promo (coral)',
    value: 'actionPromo',
    description: 'Coral panel · eyebrow, headline, description, divider, two buttons',
  },
] as const

/** No per-field `required` here — validated on the parent object so hidden promo fields do not block publish. */
const panelLinkFields = [
  defineField({
    name: 'label',
    title: 'Link label',
    type: 'string',
  }),
  defineField({
    name: 'href',
    title: 'Link URL',
    type: 'string',
    description: 'Internal path or full URL.',
  }),
  defineField({
    name: 'openInNewTab',
    title: 'Open in new tab',
    type: 'boolean',
    initialValue: false,
  }),
]

const panelButtonFields = [
  defineField({
    name: 'label',
    title: 'Button label',
    type: 'string',
  }),
  defineField({
    name: 'href',
    title: 'Button URL',
    type: 'string',
  }),
  defineField({
    name: 'openInNewTab',
    title: 'Open in new tab',
    type: 'boolean',
    initialValue: false,
  }),
]

function panelVariant(parent: unknown): string {
  return (parent as { variant?: string })?.variant ?? 'mediaTextLight'
}

function validateOptionalLink(value: unknown) {
  if (!value || typeof value !== 'object') return true
  const row = value as { label?: string; href?: string }
  const label = row.label?.trim() ?? ''
  const href = row.href?.trim() ?? ''
  if (!label && !href) return true
  if (!label || !href) return 'Text link needs both a label and a URL, or leave both empty.'
  return true
}

function validatePromoButton(value: unknown, which: 'Primary' | 'Secondary', required: boolean) {
  if (!value || typeof value !== 'object') {
    return required ? `${which} button is required for action promo.` : true
  }
  const row = value as { label?: string; href?: string }
  const label = row.label?.trim() ?? ''
  const href = row.href?.trim() ?? ''
  if (!label || !href) return `${which} button needs both a label and a URL.`
  return true
}

export default defineType({
  name: 'contentPanelBlock',
  title: 'Content panel',
  type: 'object',
  icon: BlockElementIcon,
  description:
    'Rounded feature panel: media + text (light or dark), or coral action promo with two buttons. One block covers all three Figma layouts.',
  fieldsets: [
    textColorPairFieldset('eyebrowRow', 'Eyebrow'),
    textColorPairFieldset('headingRow', 'Panel heading'),
    bodyTextPairFieldset('descriptionRow', 'Description'),
    bodyRichTextFieldset('bodyRow', 'Body'),
    blockPaddingRowFieldset,
  ],
  fields: [
    defineField({
      name: 'variant',
      title: 'Panel style',
      type: 'string',
      options: {
        list: PANEL_VARIANTS.map(({ title, value }) => ({ title, value })),
        layout: 'radio',
      },
      initialValue: 'mediaTextLight',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Action promo only — e.g. “Get Started Today”.',
      fieldset: 'eyebrowRow',
      hidden: ({ parent }) => (parent as { variant?: string })?.variant !== 'actionPromo',
    }),
    textColorField({
      name: 'eyebrowColor',
      initialValue: 'offWhite',
      fieldset: 'eyebrowRow',
      hidden: ({ parent }) => (parent as { variant?: string })?.variant !== 'actionPromo',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      fieldset: 'headingRow',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const variant = (context.parent as { variant?: string })?.variant
          if (variant === 'actionPromo' && !value?.trim()) {
            return 'Heading is required for action promo.'
          }
          return true
        }),
    }),
    textColorField({
      name: 'headingColor',
      initialValue: 'coral',
      fieldset: 'headingRow',
    }),
    defineField({
      name: 'body',
      title: 'Body text',
      type: 'blockContent',
      description: 'Media + text panels — left column copy.',
      fieldset: 'bodyRow',
      hidden: ({ parent }) => (parent as { variant?: string })?.variant === 'actionPromo',
    }),
    textSizeField({
      name: 'bodyTextSize',
      fieldset: 'bodyRow',
      hidden: ({ parent }) => (parent as { variant?: string })?.variant === 'actionPromo',
    }),
    bodyTextColorField({
      name: 'bodyTextColor',
      fieldset: 'bodyRow',
      hidden: ({ parent }) => (parent as { variant?: string })?.variant === 'actionPromo',
    }),
    linkColorField({
      name: 'bodyLinkColor',
      fieldset: 'bodyRow',
      hidden: ({ parent }) => (parent as { variant?: string })?.variant === 'actionPromo',
    }),
    linksOpenInNewTabField({
      name: 'bodyLinksOpenInNewTab',
      fieldset: 'bodyRow',
      hidden: ({ parent }) => (parent as { variant?: string })?.variant === 'actionPromo',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Action promo only — line below the headline.',
      fieldset: 'descriptionRow',
      hidden: ({ parent }) => (parent as { variant?: string })?.variant !== 'actionPromo',
    }),
    textColorField({
      name: 'descriptionColor',
      initialValue: 'offWhite',
      fieldset: 'descriptionRow',
      hidden: ({ parent }) => (parent as { variant?: string })?.variant !== 'actionPromo',
    }),
    textSizeField({
      name: 'descriptionTextSize',
      fieldset: 'descriptionRow',
      hidden: ({ parent }) => (parent as { variant?: string })?.variant !== 'actionPromo',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
      hidden: ({ parent }) => panelVariant(parent) === 'actionPromo',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (panelVariant(context.parent) === 'actionPromo') return true
          if (!value?.asset) return true
          const alt = (value as { alt?: string })?.alt?.trim()
          if (!alt) return 'Alt text is required when an image is set.'
          return true
        }),
    }),
    defineField({
      name: 'link',
      title: 'Text link (optional)',
      type: 'object',
      fields: panelLinkFields,
      options: { collapsible: true, collapsed: false },
      hidden: ({ parent }) => panelVariant(parent) === 'actionPromo',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (panelVariant(context.parent) === 'actionPromo') return true
          return validateOptionalLink(value)
        }),
    }),
    defineField({
      name: 'primaryButton',
      title: 'Primary button',
      type: 'object',
      fields: panelButtonFields,
      options: { collapsible: true },
      hidden: ({ parent }) => panelVariant(parent) !== 'actionPromo',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (panelVariant(context.parent) !== 'actionPromo') return true
          return validatePromoButton(value, 'Primary', true)
        }),
    }),
    defineField({
      name: 'secondaryButton',
      title: 'Secondary button (optional)',
      type: 'object',
      fields: panelButtonFields,
      options: { collapsible: true },
      hidden: ({ parent }) => panelVariant(parent) !== 'actionPromo',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (panelVariant(context.parent) !== 'actionPromo') return true
          return validatePromoButton(value, 'Secondary', false)
        }),
    }),
    sectionBackgroundField(),
    ...blockLayoutFields(),
  ],
  preview: {
    select: {
      variant: 'variant',
      heading: 'heading',
      eyebrow: 'eyebrow',
      media: 'image',
    },
    prepare({ variant, heading, eyebrow, media }) {
      const style =
        variant === 'mediaTextDark'
          ? 'Media + text (dark)'
          : variant === 'actionPromo'
            ? 'Action promo'
            : 'Media + text (light)'
      const preview = pageBuilderBlockPreview('contentPanelBlock', heading || eyebrow, style)
      return { ...preview, media }
    },
  },
})
