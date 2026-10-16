import { defineField } from 'sanity'

/** Shared across page builder blocks: default `content` (1080px) matches main site alignment. */
export const layoutWidthField = defineField({
  name: 'layoutWidth',
  title: 'Layout width',
  type: 'string',
  options: {
    list: [
      { title: 'Content (1080px)', value: 'content' },
      { title: 'Reading width (840px)', value: 'reading' },
      { title: 'Full width', value: 'fullBleed' },
    ],
    layout: 'radio',
  },
  initialValue: 'content',
  description: 'How wide this block spans. Default matches the main content column.',
})
