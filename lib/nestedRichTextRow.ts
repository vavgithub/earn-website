import { parseTextColor, type TextColorValue } from '@/lib/cmsTextColor'
import { parseTextSize, type TextSizeValue } from '@/lib/cmsTextSize'

export type NestedRichTextRowSettings = {
  textSize: TextSizeValue
  textColor: TextColorValue
  linkColor: TextColorValue
  linksOpenInNewTab: boolean
}

type NestedRichTextRowFallback = Partial<NestedRichTextRowSettings>

/** Read per-item rich text row controls from a Sanity object (step, modal section, etc.). */
export function parseNestedRichTextRow(
  row: Record<string, unknown> | null | undefined,
  prefix = 'content',
  fallback?: NestedRichTextRowFallback,
): NestedRichTextRowSettings {
  const textSizeKey = `${prefix}TextSize`
  const textColorKey = `${prefix}TextColor`
  const linkColorKey = `${prefix}LinkColor`
  const openTabKey = `${prefix}LinksOpenInNewTab`

  return {
    textSize: parseTextSize(
      (row?.[textSizeKey] as string | undefined) ?? fallback?.textSize,
      fallback?.textSize ?? 'md',
    ),
    textColor: parseTextColor(
      (row?.[textColorKey] as string | undefined) ?? fallback?.textColor,
      fallback?.textColor ?? 'blackGreen',
    ),
    linkColor: parseTextColor(
      (row?.[linkColorKey] as string | undefined) ?? fallback?.linkColor,
      fallback?.linkColor ?? 'green',
    ),
    linksOpenInNewTab: Boolean(
      row?.[openTabKey] ?? fallback?.linksOpenInNewTab ?? false,
    ),
  }
}
