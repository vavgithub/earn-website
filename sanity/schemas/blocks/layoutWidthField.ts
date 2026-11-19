import { defineField } from 'sanity'

/** Same four choices on every block that controls column width. */
export const layoutWidthOptions = [
  { title: 'Homepage width', value: 'homepage' },
  { title: 'Content (1080px) (default)', value: 'content' },
  { title: 'Reading width (840px)', value: 'reading' },
  { title: 'Full width', value: 'fullBleed' },
]

/** Shared across page builder blocks: default `content` (1080px) matches main site alignment. */
export const layoutWidthField = defineField({
  name: 'layoutWidth',
  title: 'Layout width',
  type: 'string',
  options: {
    list: layoutWidthOptions,
    layout: 'radio',
  },
  initialValue: 'content',
  description: 'How wide this block spans. Default matches the main content column.',
})
