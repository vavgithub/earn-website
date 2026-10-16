/** Studio fieldset: primary text (~75%) + color dropdown (~25%). See `sanity/lib/studioFieldsetLayout.ts`. */
export function textColorPairFieldset(name: string, title: string) {
  return {
    name,
    title,
    options: { columns: 2 as const },
  }
}

/** Rich text row: full-width editor; size, text color, link color in one row below. */
export function bodyRichTextFieldset(name: string, title: string) {
  return {
    name,
    title,
    options: { columns: 1 as const },
  }
}

/** Two equal columns — size | color (table typography rows). */
export function typographyPairFieldset(name: string, title: string) {
  return {
    name,
    title,
    options: { columns: 2 as const },
  }
}

/** @deprecated Use bodyRichTextFieldset for blockContent rows. */
export const bodyTextPairFieldset = bodyRichTextFieldset
