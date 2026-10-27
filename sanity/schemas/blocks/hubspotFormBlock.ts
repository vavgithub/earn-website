import { defineField, defineType } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'
import {
  blockLayoutFields,
  blockPaddingRowFieldset,
} from './blockLayoutFields'
import { textColorField } from '../../lib/textColorField'
import { sectionBackgroundField } from '../../lib/sectionBackgroundField'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'
import { bodyTextPairFieldset, textColorPairFieldset } from '../../lib/textColorPairFieldset'
import { textSizeField } from '../../lib/textSizeField'

export default defineType({
  name: 'hubspotFormBlock',
  title: 'HubSpot form',
  type: 'object',
  icon: EnvelopeIcon,
  description:
    'Two-column panel: copy on the left, HubSpot embed on the right. Section background defaults to yellow. Enter portal ID and form ID for the live form.',
  fieldsets: [
    textColorPairFieldset('eyebrowRow', 'Eyebrow'),
    textColorPairFieldset('headingRow', 'Heading'),
    bodyTextPairFieldset('descriptionRow', 'Description'),
    blockPaddingRowFieldset,
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small line above the heading (e.g. “Schedule a Demo”).',
      fieldset: 'eyebrowRow',
    }),
    textColorField({
      name: 'eyebrowColor',
      initialValue: 'yellow',
      fieldset: 'eyebrowRow',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Large IBM Plex Sans title in the left column.',
      fieldset: 'headingRow',
    }),
    textColorField({
      name: 'headingColor',
      initialValue: 'offWhite',
      fieldset: 'headingRow',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Supporting copy below the heading.',
      fieldset: 'descriptionRow',
    }),
    textColorField({
      name: 'descriptionColor',
      initialValue: 'offWhite',
      fieldset: 'descriptionRow',
    }),
    textSizeField({
      name: 'descriptionTextSize',
      fieldset: 'descriptionRow',
    }),
    defineField({
      name: 'portalId',
      title: 'HubSpot portal ID',
      type: 'string',
      validation: (Rule) => Rule.required().error('Portal ID is required to load the form.'),
    }),
    defineField({
      name: 'formId',
      title: 'HubSpot form ID',
      type: 'string',
      validation: (Rule) => Rule.required().error('Form ID is required to load the form.'),
    }),
    defineField({
      name: 'region',
      title: 'HubSpot region (optional)',
      type: 'string',
      description: 'Defaults to na1. Use eu1 for EU portals if needed.',
      initialValue: 'na1',
    }),
    sectionBackgroundField({ initialValue: 'yellow' }),
    ...blockLayoutFields({
      withAlignment: true,
      layoutWidthOverrides: {
        initialValue: 'content',
        description:
          'Content width (1080px) matches other page-builder blocks. Section background still spans full width.',
      },
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      eyebrow: 'eyebrow',
      formId: 'formId',
      layoutWidth: 'layoutWidth',
    },
    prepare({ heading, eyebrow, formId, layoutWidth }) {
      const width =
        layoutWidth === 'fullBleed'
          ? 'Full width'
          : layoutWidth === 'reading'
            ? 'Reading width'
            : 'Content (1080px)'
      const detail = formId ? `Form ${formId} · ${width}` : width
      return pageBuilderBlockPreview('hubspotFormBlock', heading || eyebrow, detail)
    },
  },
})
