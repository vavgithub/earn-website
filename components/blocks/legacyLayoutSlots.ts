/** Convert pre–nested-block CMS shapes into layout slot arrays for the front end. */

type SlotBlock = { _type: string; _key: string; [key: string]: unknown }

function key() {
  return [...crypto.getRandomValues(new Uint8Array(9))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function isSlotArray(value: unknown): value is SlotBlock[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === 'object' &&
    value[0] !== null &&
    '_type' in value[0] &&
    isLayoutSlotType((value[0] as SlotBlock)._type)
  )
}

function isLayoutSlotType(t: string) {
  return t === 'imageBlock' || t === 'richTextSection' || t === 'buttonBlock'
}

/** Old multi-column / hero column object: { type, textContent, imageContent, buttons } */
function legacyColumnToSlots(column: unknown): SlotBlock[] | null {
  if (!column || typeof column !== 'object') return null
  if (isSlotArray(column)) return column

  const c = column as {
    type?: string
    textContent?: unknown
    imageContent?: unknown
    buttons?: unknown[]
  }
  const slots: SlotBlock[] = []

  if (c.type === 'text' && c.textContent) {
    slots.push({
      _type: 'richTextSection',
      _key: key(),
      content: c.textContent,
      alignment: 'left',
    })
  }
  if (c.type === 'image' && c.imageContent) {
    slots.push({
      _type: 'imageBlock',
      _key: key(),
      image: c.imageContent,
      alt: 'Image',
      objectFit: 'cover',
    })
  }
  if (Array.isArray(c.buttons)) {
    for (const btn of c.buttons) {
      if (btn && typeof btn === 'object' && '_type' in btn) {
        slots.push({ ...(btn as SlotBlock), _key: (btn as SlotBlock)._key || key() })
      }
    }
  }
  return slots.length ? slots : null
}

export function resolveColumnSlots(column: unknown): SlotBlock[] {
  if (isSlotArray(column)) return column
  return legacyColumnToSlots(column) ?? []
}

/** Old hero: title, description, image, buttons → two columns */
export function resolveHeroColumns(block: Record<string, unknown>): {
  column1: SlotBlock[]
  column2: SlotBlock[]
} {
  if (isSlotArray(block.column1) || isSlotArray(block.column2)) {
    return {
      column1: resolveColumnSlots(block.column1),
      column2: resolveColumnSlots(block.column2),
    }
  }

  const left: SlotBlock[] = []
  const right: SlotBlock[] = []

  if (block.title) {
    left.push({
      _type: 'richTextSection',
      _key: key(),
      content: [
        {
          _type: 'block',
          _key: key(),
          style: 'h1',
          markDefs: [],
          children: [{ _type: 'span', _key: key(), text: String(block.title), marks: [] }],
        },
      ],
    })
  }
  if (block.description) {
    left.push({
      _type: 'richTextSection',
      _key: key(),
      content: [
        {
          _type: 'block',
          _key: key(),
          style: 'normal',
          markDefs: [],
          children: [{ _type: 'span', _key: key(), text: String(block.description), marks: [] }],
        },
      ],
    })
  }
  if (Array.isArray(block.buttons)) {
    for (const btn of block.buttons) {
      if (btn && typeof btn === 'object') {
        left.push({ ...(btn as SlotBlock), _key: (btn as SlotBlock)._key || key() })
      }
    }
  }
  if (block.image) {
    right.push({
      _type: 'imageBlock',
      _key: key(),
      image: block.image,
      alt: String(block.title || 'Hero image'),
      objectFit: 'cover',
    })
  }

  return { column1: left, column2: right }
}

/** One grid cell: `gridCell.blocks[]`, flat slot (legacy mistake), or old `{ image, description }`. */
export function resolveGridCell(item: unknown): SlotBlock[] {
  if (!item || typeof item !== 'object') return []

  const row = item as {
    _type?: string
    _key?: string
    blocks?: unknown
    image?: unknown
    description?: string
  }

  if (Array.isArray(row.blocks)) {
    return isSlotArray(row.blocks) ? row.blocks : []
  }

  if (row._type && isLayoutSlotType(row._type)) {
    return [{ ...(item as SlotBlock), _key: (item as SlotBlock)._key || key() }]
  }

  const slots: SlotBlock[] = []
  const itemKey = row._key || key()

  if (row.image) {
    slots.push({
      _type: 'imageBlock',
      _key: `${itemKey}-img`,
      image: row.image,
      alt: row.description?.slice(0, 120) || 'Grid image',
      objectFit: 'cover',
    })
  }
  if (row.description?.trim()) {
    slots.push({
      _type: 'richTextSection',
      _key: `${itemKey}-text`,
      content: [
        {
          _type: 'block',
          _key: key(),
          style: 'normal',
          markDefs: [],
          children: [{ _type: 'span', _key: key(), text: row.description.trim(), marks: [] }],
        },
      ],
    })
  }
  return slots
}
