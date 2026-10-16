export type TocEntry = { label: string; page?: string }

/**
 * Parse pasted table of contents (one entry per line).
 * Formats: `Label | 12`  or  `Label`  or  `1. Label | 12`
 */
export function parseTableOfContentsText(raw: string | null | undefined): TocEntry[] {
  if (!raw?.trim()) return []

  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const pipe = line.split('|').map((p) => p.trim())
      if (pipe.length >= 2) {
        return { label: pipe[0]!, page: pipe[1] || undefined }
      }
      return { label: line, page: undefined }
    })
}

function tableOfContentsFromArray(
  rows: { label?: string | null; page?: string | null }[] | null | undefined,
): TocEntry[] {
  if (!rows?.length) return []
  return rows
    .map((row) => ({
      label: row.label?.trim() || '',
      page: row.page?.trim() || undefined,
    }))
    .filter((row) => row.label)
}

export function resolveResourceTableOfContents(item: {
  tableOfContents?: { label?: string | null; page?: string | null }[] | null
  tableOfContentsText?: string | null
}): TocEntry[] {
  const fromText = item.tableOfContentsText?.trim()
    ? parseTableOfContentsText(item.tableOfContentsText)
    : []
  const fromArray = tableOfContentsFromArray(item.tableOfContents)

  /** Prefer paste field when set; legacy array only if it has real labels (avoids empty rows after Studio “fix keys”). */
  if (fromText.length) return fromText
  return fromArray
}
