import { defineField, defineType } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

/**
 * HubSpot portal + form UUIDs for /resources preview modals.
 * Each card picks a form type (Governance, Methodology, …); these IDs are used unless the card overrides.
 */
export default defineType({
  name: 'resourcesHubSpotSettings',
  title: 'HubSpot form IDs',
  type: 'document',
  icon: EnvelopeIcon,
  description:
    'Paste HubSpot form UUIDs here. Cards choose Governance / Methodology / Guide / etc. — they use the matching ID below.',
  fields: [
    defineField({
      name: 'portalId',
      title: 'HubSpot portal ID',
      type: 'string',
      description: 'Earn HubSpot account ID. There is no default.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'governanceFormId',
      title: 'Governance — HubSpot form ID',
      type: 'string',
      description: 'Cards with form type “Governance”.',
    }),
    defineField({
      name: 'methodologyFormId',
      title: 'Methodology — HubSpot form ID',
      type: 'string',
      description: 'Cards with form type “Methodology”.',
    }),
    defineField({
      name: 'guideFormId',
      title: 'Guide — HubSpot form ID',
      type: 'string',
      description: 'Cards with form type “Guide”.',
    }),
    defineField({
      name: 'caseStudyFormId',
      title: 'Case study — HubSpot form ID',
      type: 'string',
      description: 'Cards with form type “Case study”.',
    }),
    defineField({
      name: 'mcpFormId',
      title: 'MCP access — HubSpot form ID',
      type: 'string',
      description: 'MCP access modal only.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'HubSpot form IDs' }
    },
  },
})
