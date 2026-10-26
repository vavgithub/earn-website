import { defineField } from 'sanity'
import { TEXT_COLOR_OPTIONS, type TextColorValue } from './textColorField'

type TextWithColorFieldOptions = {
  name: string
  title: string
  textDescription?: string
  colorInitialValue?: TextColorValue
  hidden?: boolean | ((context: { parent?: unknown; path?: unknown }) => boolean)
}

/** Text + color side by side in Studio (`columns: 2`). */
export function textWithColorField({
  name,
  title,
  textDescription,
  colorInitialValue = 'darkSlate',
  hidden,
}: TextWithColorFieldOptions) {
  return defineField({
    name,
    title,
    type: 'object',
    description: textDescription,
    options: { columns: 2 },
    fields: [
      defineField({
        name: 'text',
        title: 'Text',
        type: 'string',
      }),
      defineField({
        name: 'color',
        title: 'Color',
        description: 'Text color',
        type: 'string',
        options: {
          list: [...TEXT_COLOR_OPTIONS],
          layout: 'dropdown',
        },
        initialValue: colorInitialValue,
      }),
    ],
    hidden,
  })
}
