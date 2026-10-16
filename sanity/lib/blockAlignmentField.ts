import { defineField } from 'sanity'

/** Left / center alignment inside the block width column (same as Text & headings). */
export function blockAlignmentField() {
  return defineField({
    name: 'alignment',
    title: 'Alignment',
    type: 'string',
    options: {
      list: [
        { title: 'Left', value: 'left' },
        { title: 'Center', value: 'center' },
      ],
      layout: 'radio',
    },
    initialValue: 'left',
  })
}
