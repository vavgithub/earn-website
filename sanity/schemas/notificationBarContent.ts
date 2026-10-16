import { defineType, defineArrayMember, defineField } from 'sanity'

/** Single-line notification copy: normal text, bold, italic, and links only. */
export const notificationBarContent = defineType({
  title: 'Notification message',
  name: 'notificationBarContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              defineField({
                title: 'URL',
                name: 'href',
                type: 'url',
                description: 'Full URL (https://…) or internal path (/about, /resources/…).',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                    allowRelative: true,
                  }).required(),
              }),
            ],
          },
        ],
      },
    }),
  ],
})
