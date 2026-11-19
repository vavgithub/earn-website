import { PatchEvent, set, type ArrayOfObjectsInputProps, type FormPatch } from 'sanity'

function blocksFromPlainText(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => ({
      _type: 'block',
      _key: `legacy-body-${index}`,
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `legacy-body-${index}-span`,
          text: paragraph.replace(/\s*\n\s*/g, ' '),
          marks: [],
        },
      ],
    }))
}

function patchesOf(event: PatchEvent | FormPatch | FormPatch[]): FormPatch[] {
  if (Array.isArray(event)) return event
  if (event instanceof PatchEvent) return event.patches
  return [event]
}

/**
 * Body used to be plain text. Show that text in the editor without saving it
 * as rich text until someone actually edits it.
 */
export function BannerBodyInput(props: ArrayOfObjectsInputProps) {
  if (typeof props.value !== 'string') {
    return props.renderDefault(props)
  }

  const blocks = blocksFromPlainText(props.value)
  return props.renderDefault({
    ...props,
    value: blocks,
    onChange: (event) => {
      const patches = patchesOf(event)
      if (patches.length === 0) return
      props.onChange(PatchEvent.from([set(blocks), ...patches]))
    },
  })
}
