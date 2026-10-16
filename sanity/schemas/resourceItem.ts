import { defineArrayMember, defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { blockContent } from './blockContent'
import {
  nestedRichTextRowFieldset,
  nestedRichTextRowFields,
} from '../lib/nestedRichTextRowFields'

const modalHeroIntroRow = nestedRichTextRowFieldset('modalHeroIntroRow', 'Modal intro')
const modalSectionContentRow = nestedRichTextRowFieldset('contentRow', 'Content')

const MODAL_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function resourceItemDoc(document: unknown): {
  modalLayout?: string
  requiresLoginBeforeForm?: boolean
  hubspotFormKind?: string
} {
  if (!document || typeof document !== 'object') return {}
  const d = document as Record<string, unknown>
  return {
    modalLayout: typeof d.modalLayout === 'string' ? d.modalLayout : undefined,
    requiresLoginBeforeForm:
      typeof d.requiresLoginBeforeForm === 'boolean' ? d.requiresLoginBeforeForm : undefined,
    hubspotFormKind: typeof d.hubspotFormKind === 'string' ? d.hubspotFormKind : undefined,
  }
}

function hubspotKindIs(document: unknown, ...kinds: string[]) {
  const kind = resourceItemDoc(document).hubspotFormKind
  return kind ? kinds.includes(kind) : false
}

function modalLayoutIs(document: unknown, value: string) {
  return resourceItemDoc(document).modalLayout === value
}

export default defineType({
  name: 'resourceItem',
  title: 'Resource card & modal',
  type: 'document',
  icon: DocumentIcon,
  description:
    'One listing card on /resources and its preview modal. Assign a tab, pick a modal layout, then add copy and HubSpot form type.',
  orderings: [orderRankOrdering],
  fieldsets: [
    { name: 'card', title: 'Card (listing)', options: { collapsible: true } },
    { name: 'modalHero', title: 'Modal — hero', options: { collapsible: true } },
    modalHeroIntroRow,
    { name: 'modalBody', title: 'Modal — body sections', options: { collapsible: true } },
    { name: 'modalFooter', title: 'Modal — footer & form', options: { collapsible: true } },
    {
      name: 'hubspot',
      title: 'Download form (HubSpot)',
      description:
        'Governance & Case study: form type (+ optional UUID override) only — no routing key/title. Methodology & Guide: also need routing key + document title for HubSpot email.',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      ...orderRankField({ type: 'resourceItem' }),
    }),
    defineField({
      name: 'tab',
      title: 'Tab',
      type: 'reference',
      to: [{ type: 'resourceTab' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'modalId',
      title: 'Modal ID (deep link)',
      type: 'slug',
      description:
        'Stable id for URLs and dialogs (e.g. qet, governance-1). Used in /resources#tab:modalId',
      options: {
        source: (_doc, { parent }) => {
          const p = parent as { cardTitle?: string } | undefined
          return p?.cardTitle || 'resource'
        },
        maxLength: 64,
        slugify: (input: string) =>
          input
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
      },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          const value = typeof slug === 'object' && slug && 'current' in slug ? slug.current : slug
          if (!value || typeof value !== 'string') return 'Modal ID is required'
          if (!MODAL_ID_PATTERN.test(value)) {
            return 'Use lowercase letters, numbers, and hyphens only'
          }
          return true
        }),
    }),
    defineField({
      name: 'modalLayout',
      title: 'Modal layout',
      description: 'How the preview modal is structured on the site (not which tab it sits in).',
      type: 'string',
      options: {
        list: [
          {
            title: 'Governance — document preview + form',
            value: 'governance',
          },
          {
            title: 'Guides — document preview + form (supports eyebrow line)',
            value: 'guides',
          },
          {
            title: 'Methodology — preview, login, then form',
            value: 'methodology',
          },
          {
            title: 'Case study — hero, side image, form',
            value: 'caseStudy',
          },
        ],
        layout: 'radio',
      },
      initialValue: 'governance',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cardTitle',
      title: 'Card title',
      type: 'string',
      fieldset: 'card',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cardExcerpt',
      title: 'Card excerpt',
      type: 'text',
      rows: 4,
      fieldset: 'card',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cardImage',
      title: 'Card image',
      type: 'image',
      options: { hotspot: true },
      fieldset: 'card',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cardImageAlt',
      title: 'Card image alt text',
      type: 'string',
      fieldset: 'card',
    }),
    defineField({
      name: 'cardCtaLabel',
      title: 'Card CTA label',
      type: 'string',
      fieldset: 'card',
      initialValue: 'Preview this methodology >',
    }),
    defineField({
      name: 'modalHeroTitle',
      title: 'Modal title',
      type: 'string',
      fieldset: 'modalHero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'modalHeroSubtitle',
      title: 'Modal subtitle',
      type: 'string',
      fieldset: 'modalHero',
    }),
    defineField({
      name: 'modalHeroEyebrow',
      title: 'Modal eyebrow',
      type: 'string',
      description: 'Optional line above body copy (used on Guides layout).',
      fieldset: 'modalHero',
      hidden: ({ document }) => !modalLayoutIs(document, 'guides'),
    }),
    ...nestedRichTextRowFields({
      fieldset: 'modalHeroIntroRow',
      prefix: 'modalHeroIntro',
      blockTitle: 'Modal intro',
      linkColorInitialValue: 'coral',
    }),
    defineField({
      name: 'modalHeroImage',
      title: 'Modal hero image',
      type: 'image',
      options: { hotspot: true },
      fieldset: 'modalHero',
    }),
    defineField({
      name: 'modalSections',
      title: 'Body sections',
      type: 'array',
      fieldset: 'modalBody',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'resourceModalSection',
          fieldsets: [modalSectionContentRow],
          fields: [
            defineField({
              name: 'heading',
              title: 'Section heading',
              type: 'string',
            }),
            ...nestedRichTextRowFields({
              fieldset: 'contentRow',
              prefix: 'content',
              blockTitle: 'Content',
              linkColorInitialValue: 'coral',
            }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) {
              return { title: title || 'Section' }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'tableOfContentsText',
      title: 'Table of contents',
      type: 'text',
      rows: 16,
      fieldset: 'modalBody',
      description:
        'One chapter per line: Chapter title | page (page optional). Example: 1. Key Objectives | 11',
    }),
    defineField({
      name: 'caseStudySecondaryImage',
      title: 'Case study — secondary image',
      type: 'image',
      options: { hotspot: true },
      fieldset: 'modalBody',
      hidden: ({ document }) => !modalLayoutIs(document, 'caseStudy'),
    }),
    defineField({
      name: 'caseStudySecondaryBody',
      title: 'Case study — secondary copy',
      type: 'text',
      rows: 4,
      fieldset: 'modalBody',
      hidden: ({ document }) => !modalLayoutIs(document, 'caseStudy'),
    }),
    defineField({
      name: 'footerHeading',
      title: 'Footer heading',
      type: 'string',
      fieldset: 'modalFooter',
      initialValue: 'Continue Reading',
    }),
    defineField({
      name: 'footerIntro',
      title: 'Footer intro',
      type: 'text',
      rows: 2,
      fieldset: 'modalFooter',
      initialValue: "You've reached the end of the preview.",
    }),
    defineField({
      name: 'footerFormPrompt',
      title: 'Footer form prompt',
      type: 'text',
      rows: 2,
      fieldset: 'modalFooter',
      initialValue: 'Please fill out the form to download the document.',
    }),
    defineField({
      name: 'requiresLoginBeforeForm',
      title: 'Require login before form',
      type: 'boolean',
      fieldset: 'modalFooter',
      description: 'Turned on automatically for Methodology layout.',
      initialValue: false,
      hidden: ({ document }) => modalLayoutIs(document, 'methodology'),
    }),
    defineField({
      name: 'loginStepLabel',
      title: 'Login step label',
      type: 'string',
      fieldset: 'modalFooter',
      description: 'Small label above the login prompt, e.g. “Step 1 of 2” (methodology only).',
      initialValue: 'Step 1 of 2',
      hidden: ({ document }) => {
        const d = resourceItemDoc(document)
        return !modalLayoutIs(document, 'methodology') && !d.requiresLoginBeforeForm
      },
    }),
    defineField({
      name: 'loginPrompt',
      title: 'Login prompt',
      type: 'text',
      rows: 2,
      fieldset: 'modalFooter',
      description: 'Shown to visitors who are not logged in (methodology modals only).',
      initialValue: 'Create an account or log in to access the full methodology document.',
      hidden: ({ document }) => {
        const d = resourceItemDoc(document)
        return !modalLayoutIs(document, 'methodology') && !d.requiresLoginBeforeForm
      },
    }),
    defineField({
      name: 'hubspotFormKind',
      title: 'Download form type',
      type: 'string',
      fieldset: 'hubspot',
      description:
        'Required. Governance & Case study use their own form only (no routing key/title on the card). Methodology & Guide share one form per type and need routing key + title below.',
      options: {
        list: [
          { title: 'Governance', value: 'governance' },
          { title: 'Guide', value: 'guide' },
          { title: 'Methodology', value: 'methodology' },
          { title: 'Case study', value: 'tallgrass' },
          { title: 'MCP access', value: 'mcp' },
          { title: 'None', value: 'none' },
        ],
      },
      initialValue: 'methodology',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hubspotFormId',
      title: 'HubSpot form ID override (optional)',
      type: 'string',
      fieldset: 'hubspot',
      description:
        'Leave empty. Only use if this one card must use a different HubSpot form than the shared ID for its type.',
    }),
    defineField({
      name: 'hubspotSource',
      title: 'Routing key (for HubSpot workflow)',
      type: 'string',
      fieldset: 'hubspot',
      description:
        'Methodology & Guide only. Exact system key HubSpot uses to pick the download (e.g. QET, QET-LCFS, SBTi). Do not change unless the client gives you a new key.',
      hidden: ({ document }) => !hubspotKindIs(document, 'methodology', 'guide'),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const kind = resourceItemDoc(context.document).hubspotFormKind
          if ((kind === 'methodology' || kind === 'guide') && !value?.trim()) {
            return 'Required for Methodology and Guide cards'
          }
          return true
        }),
    }),
    defineField({
      name: 'hubspotTitle',
      title: 'Document title (for HubSpot email)',
      type: 'text',
      fieldset: 'hubspot',
      rows: 2,
      description:
        'Methodology & Guide only. Full document title the user sees — sent to HubSpot so the email names the correct file.',
      hidden: ({ document }) => !hubspotKindIs(document, 'methodology', 'guide'),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const kind = resourceItemDoc(context.document).hubspotFormKind
          if ((kind === 'methodology' || kind === 'guide') && !value?.trim()) {
            return 'Required for Methodology and Guide cards'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'cardTitle',
      modalId: 'modalId.current',
      tabTitle: 'tab.title',
      tabHash: 'tab.tabHash.current',
      modalLayout: 'modalLayout',
      media: 'cardImage',
    },
    prepare({ title, modalId, tabTitle, tabHash, modalLayout, media }) {
      const tabPart = tabTitle
        ? `${tabTitle}${tabHash ? ` · #${tabHash}` : ''}`
        : 'No tab assigned'
      return {
        title: title || 'Resource card',
        subtitle: `${tabPart} — ${modalLayout || 'layout?'} — #${modalId || '?'}`,
        media,
      }
    },
  },
})
