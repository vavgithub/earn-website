import { defineField, defineType } from 'sanity'
import { BellIcon } from '@sanity/icons'
import { blockPaddingFields, blockPaddingRowFieldset } from '../lib/blockPaddingFields'
import { sectionBackgroundField } from '../lib/sectionBackgroundField'
import {
  linkColorField,
  linksOpenInNewTabField,
  textColorField,
} from '../lib/textColorField'
import { textSizeField } from '../lib/textSizeField'

const messageFieldset = { name: 'messageRow', title: 'Message' } as const
const styleFieldset = {
  name: 'styleRow',
  title: 'Typography & link',
  options: { columns: 2 as const },
} as const

export default defineType({
  name: 'siteNotificationBar',
  title: 'Sitewide Notification Bar',
  type: 'document',
  icon: BellIcon,
  description: 'Full-width bar below the site header. Dismissed for the current browser session only.',
  fieldsets: [messageFieldset, styleFieldset, blockPaddingRowFieldset],
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show notification bar',
      type: 'boolean',
      description: 'Turn off to hide the bar on the live site (editors can still change copy here).',
      initialValue: true,
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'notificationBarContent',
      fieldset: messageFieldset.name,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!(context.document as { enabled?: boolean })?.enabled) return true
          if (!Array.isArray(value) || value.length === 0) {
            return 'Add message copy when the bar is enabled.'
          }
          return true
        }),
    }),
    textSizeField({
      name: 'textSize',
      title: 'Font size',
      initialValue: 'xs',
      fieldset: styleFieldset.name,
    }),
    textColorField({
      name: 'textColor',
      title: 'Font color',
      description: 'Message and Close button label color.',
      initialValue: 'offWhite',
      fieldset: styleFieldset.name,
    }),
    linkColorField({
      name: 'linkColor',
      initialValue: 'offWhite',
      fieldset: styleFieldset.name,
    }),
    linksOpenInNewTabField({
      name: 'linksOpenInNewTab',
      fieldset: styleFieldset.name,
    }),
    ...blockPaddingFields(),
    sectionBackgroundField({ initialValue: 'yellow' }),
  ],
  preview: {
    select: { enabled: 'enabled', message: 'message' },
    prepare({ enabled, message }) {
      const block = Array.isArray(message) ? message[0] : null
      const text =
        block && typeof block === 'object' && 'children' in block
          ? (block.children as { text?: string }[])
              ?.map((c) => c.text ?? '')
              .join('')
              .trim()
          : ''
      return {
        title: enabled
          ? 'Sitewide Notification Bar (visible)'
          : 'Sitewide Notification Bar (hidden)',
        subtitle: text ? text.slice(0, 80) : 'No message yet',
      }
    },
  },
})
