import { defineField } from 'sanity'
import { BLOCK_PADDING_OPTIONS } from './blockPaddingFields'
import { sectionBackgroundField } from './sectionBackgroundField'
import { TEXT_COLOR_OPTIONS } from './textColorField'
import { TEXT_SIZE_OPTIONS } from './textSizeField'

const SPACE_OPTIONS = [...BLOCK_PADDING_OPTIONS]

/** Background color with a client-facing label. Empty means the homepage color. */
export function backgroundColorField() {
  return namedBackgroundField('sectionBackground', 'Background color')
}

export function namedBackgroundField(name: string, title: string) {
  const { initialValue: _unused, name: _name, title: _title, ...field } = sectionBackgroundField()
  return {
    ...field,
    name,
    title,
  }
}

/** Space above and below. Field names stay `paddingTop` and `paddingBottom`. */
export function spaceAroundFields(name = 'spaceAround', title = 'Space around this area') {
  return {
    fieldset: {
      name,
      title,
      options: { columns: 2 as const },
    },
    fields: [
      defineField({
        name: 'paddingTop',
        title: 'Space above',
        type: 'string',
        fieldset: name,
        description: 'Optional.',
        options: { list: SPACE_OPTIONS, layout: 'dropdown' },
      }),
      defineField({
        name: 'paddingBottom',
        title: 'Space below',
        type: 'string',
        fieldset: name,
        description: 'Optional.',
        options: { list: SPACE_OPTIONS, layout: 'dropdown' },
      }),
    ],
  }
}

export function wordsColorField(name: string, title = 'Text color') {
  return defineField({
    name,
    title,
    type: 'string',
    options: { list: [...TEXT_COLOR_OPTIONS], layout: 'dropdown' },
  })
}

export function wordsSizeField(name: string, title = 'Text size') {
  return defineField({
    name,
    title,
    type: 'string',
    options: { list: [...TEXT_SIZE_OPTIONS], layout: 'dropdown' },
  })
}

export function openInNewTabField(name = 'openInNewTab') {
  return defineField({
    name,
    title: 'Open in a new tab',
    type: 'boolean',
    initialValue: false,
  })
}
