/**
 * Hardcoded navigation data for Phase 1 of the new mega-menu navbar.
 *
 * In Phase 2 this will be replaced by a Sanity-backed `siteNavigation` document with
 * the same shape, fetched server-side and passed into `WebsiteNavbar` as a prop.
 *
 * Schema (mirrored exactly in Sanity later):
 *   - `NavItem.label`     — top-level text shown in the navbar
 *   - `NavItem.href`      — optional; if set, clicking the top-level item navigates
 *   - `NavItem.dropdown`  — omitted = pure link (e.g. Contact); otherwise a panel opens on hover
 *   - Dropdown kinds:
 *       'multi-column'      → N columns, each a list of `ColumnItem`s
 *       'single-with-intro' → top-level `intro` (heading + body) for the right panel when the menu
 *         first opens; each left row has optional `intro` for the right panel when that row is hovered.
 *   - `ColumnItem`        — `{ label, href?, subitems?, intro? }`
 *       href omitted  = non-clickable label (acts as a section header e.g. "RNG")
 *       subitems      = one level of nested items underneath (also `{ label, href? }`)
 */

import { navKeyFromLabel } from '@/lib/navKeyFromLabel'

export type Subitem = {
  label: string
  href?: string
}

export type ColumnItem = {
  label: string
  href?: string
  subitems?: Subitem[]
  /** Optional; used in `single-with-intro` mega-menus for the right-hand panel when this row is hovered. */
  intro?: { heading: string; body: string }
}

export type Column = {
  items: ColumnItem[]
}

export type Dropdown =
  | { kind: 'multi-column'; columns: Column[] }
  | {
      kind: 'single-with-intro'
      items: ColumnItem[]
      /** Right-hand copy when the panel opens (before hovering a left row). */
      intro: { heading: string; body: string }
    }

export type NavItem = {
  label: string
  href?: string
  /** Stable React key; optional on fallback data, always set from Sanity after normalize. */
  key?: string
  dropdown?: Dropdown
}

/**
 * Fallback navigation (used when Sanity `siteNavigation.items` is empty/not created yet).
 * Keep this intentionally simple: the legacy 5 links, no dropdowns.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Resources', href: '/resources', key: navKeyFromLabel('Resources') },
]
