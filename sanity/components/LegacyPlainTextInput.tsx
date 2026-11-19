import { PatchEvent, set, type ArrayOfObjectsInputProps, type FormPatch } from 'sanity'

function span(key: string, text: string) {
  return {
    _type: 'span' as const,
    _key: `${key}-span`,
    text,
    marks: [] as string[],
  }
}

function block(key: string, text: string) {
  return {
    _type: 'block' as const,
    _key: key,
    style: 'normal' as const,
    markDefs: [] as unknown[],
    children: [span(key, text)],
  }
}

/** Blank lines start a new paragraph. A single line break stays in the same paragraph. */
function flowBlocks(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => block(`legacy-flow-${index}`, paragraph.replace(/\s*\n\s*/g, ' ')))
}

/** Each row stays its own line, including a blank row between lines. */
function lineBlocks(text: string) {
  if (!text.trim()) return []
  return text.replace(/\r\n/g, '\n').split('\n').map((line, index) => block(`legacy-line-${index}`, line))
}

function patchesOf(event: PatchEvent | FormPatch | FormPatch[]): FormPatch[] {
  if (Array.isArray(event)) return event
  if (event instanceof PatchEvent) return event.patches
  return [event]
}

/**
 * The field used to be plain text. Show that text in the editor without saving
 * it as rich text until someone actually edits it.
 */
export function legacyPlainTextInput(mode: 'flow' | 'lines') {
  return function LegacyPlainTextInput(props: ArrayOfObjectsInputProps) {
    if (typeof props.value !== 'string') return props.renderDefault(props)

    const blocks = mode === 'lines' ? lineBlocks(props.value) : flowBlocks(props.value)
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
}
