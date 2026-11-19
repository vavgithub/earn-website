import { defineField, defineType } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'
import {
  blockLayoutFields,
  blockPaddingRowFieldset,
} from './blockLayoutFields'
import { linksOpenInNewTabField, textColorField, TEXT_COLOR_OPTIONS } from '../../lib/textColorField'
import { sectionBackgroundField } from '../../lib/sectionBackgroundField'
import { pageBuilderBlockPreview } from '../../lib/pageBuilderPreview'
import { TEXT_SIZE_OPTIONS, textSizeField } from '../../lib/textSizeField'
import { legacyPlainTextInput } from '../../components/LegacyPlainTextInput'

const hubspotEyebrowRow = {
  name: 'hubspotEyebrowRow',
  title: 'Eyebrow',
  options: { columns: 3 as const },
}

const hubspotHeadingStyle = {
  name: 'hubspotHeadingStyle',
  title: 'Heading',
  options: { columns: 3 as const },
}

const hubspotDescriptionStyle = {
  name: 'hubspotDescriptionStyle',
  title: 'Text',
  options: { columns: 4 as const },
}

export default defineType({
  name: 'hubspotFormBlock',
  title: 'HubSpot form',
  type: 'object',
  icon: EnvelopeIcon,
  description:
    'Two-column panel: copy on the left, HubSpot embed on the right. Section background defaults to yellow. Enter portal ID and form ID for the live form.',
  fieldsets: [hubspotEyebrowRow, hubspotHeadingStyle, hubspotDescriptionStyle, blockPaddingRowFieldset],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small line above the heading (e.g. “Schedule a Demo”).',
      fieldset: hubspotEyebrowRow.name,
    }),
    defineField({
      name: 'eyebrowTextSize',
      title: 'Text size',
      type: 'string',
      fieldset: hubspotEyebrowRow.name,
      description: 'Leave empty to keep the current size.',
      options: { list: [...TEXT_SIZE_OPTIONS], layout: 'dropdown' },
    }),
    textColorField({
      name: 'eyebrowColor',
      initialValue: 'yellow',
      fieldset: hubspotEyebrowRow.name,
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Large IBM Plex Sans title in the left column.',
    }),
    defineField({
      name: 'headingLevel',
      title: 'Heading tag',
      type: 'string',
      fieldset: hubspotHeadingStyle.name,
      description: 'Leave empty to keep the current heading.',
      options: {
        list: [
          { title: 'H1', value: 'h1' },
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
        ],
        layout: 'dropdown',
      },
    }),
    textColorField({
      name: 'headingColor',
      initialValue: 'offWhite',
      fieldset: hubspotHeadingStyle.name,
    }),
    defineField({
      name: 'headingTextSize',
      title: 'Text size',
      type: 'string',
      fieldset: hubspotHeadingStyle.name,
      description: 'Leave empty to keep the current size.',
      options: { list: [...TEXT_SIZE_OPTIONS], layout: 'dropdown' },
    }),
    defineField({
      name: 'description',
      title: 'Text',
      type: 'blockContent',
      description: 'Bold, italic, lists, and links. Text already on the page stays as it is until this is edited.',
      components: { input: legacyPlainTextInput('flow') },
    }),
    textColorField({
      name: 'descriptionColor',
      initialValue: 'offWhite',
      fieldset: hubspotDescriptionStyle.name,
    }),
    textSizeField({
      name: 'descriptionTextSize',
      fieldset: hubspotDescriptionStyle.name,
    }),
    defineField({
      name: 'descriptionLinkColor',
      title: 'Link color',
      type: 'string',
      fieldset: hubspotDescriptionStyle.name,
      options: { list: [...TEXT_COLOR_OPTIONS], layout: 'dropdown' },
    }),
    linksOpenInNewTabField({
      name: 'descriptionLinksOpenInNewTab',
      fieldset: hubspotDescriptionStyle.name,
      description: '',
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
        layoutWidth === 'homepage'
          ? 'Homepage width'
          : layoutWidth === 'fullBleed'
            ? 'Full width'
            : layoutWidth === 'reading'
              ? 'Reading width'
              : 'Content (1080px)'
      const detail = formId ? `Form ${formId} · ${width}` : width
      return pageBuilderBlockPreview('hubspotFormBlock', heading || eyebrow, detail)
    },
  },
})
