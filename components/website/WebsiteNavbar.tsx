"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import styles from "./WebsiteNavbar.module.css";
import type { Path } from "@sanity/client/csm";
import { createDataAttribute } from "next-sanity";
import {
  NAV_ITEMS,
  type ColumnItem,
  type NavItem,
  type Subitem,
} from "./navigationData";
import { navKeyFromLabel } from "@/lib/navKeyFromLabel";

const appLoginUrl = process.env.NEXT_PUBLIC_APP_LOGIN_URL?.trim() ?? "";

/** Top-level item: orange by default, white semibold while hovered or its panel is open. */
function topLinkClass(isActive: boolean) {
  return isActive
    ? "font-semibold text-earn-white"
    : "font-medium text-earn-orange hover:text-earn-white";
}

function NavTopLink({
  href,
  label,
  onFocus,
  hasDropdown,
  isActive,
}: {
  href: string;
  label: string;
  onFocus: () => void;
  hasDropdown: boolean;
  isActive: boolean;
}) {
  const className = `font-plex-mono text-base leading-5 transition-colors ${topLinkClass(isActive)}`;
  if (/^https?:\/\//.test(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onFocus={onFocus}
        className={className}
      >
        {label}
      </a>
    );
  }
  return (
    <Link
      href={href}
      onFocus={onFocus}
      aria-haspopup={hasDropdown ? "true" : undefined}
      aria-expanded={hasDropdown ? isActive : undefined}
      className={className}
    >
      {label}
    </Link>
  );
}

/**
 * Top navigation.
 *   - From 1024: logo bottom-left, nav links centered on the lower row, Login gold on the upper right.
 *   - Below 1024: logo left, menu button right. The drawer stays the existing accordion.
 *
 * On top of that legacy chrome we add a hover-driven mega-menu:
 *   - Hover a top-level item → grey panel slides down under the navbar (open animation only;
 *     closes instantly). Panel is absolutely positioned so the white header bar does not move.
 *   - Click a top-level item with `href` → navigates normally; the dropdown does not swallow clicks.
 *   - Mouse leaves the entire `<header>` → panel closes.
 *   - `Escape` closes the panel.
 *   - Top-level item turns red while hovered or while its panel is open.
 *   - Dropdown content is configured per-item in `navigationData.ts` (Phase 2: from Sanity).
 *   - `single-with-intro`: opening the panel shows the top-level default intro on the right (Sanity
 *     `introHeading` / `introBody` on that nav item); no left row is highlighted until hover.
 *     Hovering a row shows that row’s intro (`introHeading` / `introBody` on the row) when it has
 *     one, otherwise the default intro stays; leaving the two-column panel resets to the default.
 *
 * Mobile mega-menu = accordion: tap a row to expand its sub-items inline. If the item has both
 * `href` and a dropdown, an "Overview" link appears at the top of the expanded panel. For
 * `single-with-intro`, only the left-column links are shown (no right-hand intro; desktop hover only).
 */
export function WebsiteNavbar({
  items,
  presentation,
}: {
  items?: NavItem[];
  presentation?: { documentId: string; documentType: string; studioBaseUrl?: string };
}) {
  const pathname = usePathname();
  const navItems = items && items.length ? items : NAV_ITEMS;
  const studioBaseUrl = presentation?.studioBaseUrl;

  const presentationProps = (path: Path): Record<string, string> => {
    if (!presentation?.documentId || !presentation?.documentType || !studioBaseUrl) return {};
    const attr = createDataAttribute({
      id: presentation.documentId,
      type: presentation.documentType,
      baseUrl: studioBaseUrl,
      path,
    });
    return { "data-sanity": attr.toString() };
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    closeMobile();
    setActiveIdx(null);
  }, [pathname, closeMobile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIdx(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className="navbar-pinned bg-earn-ink font-plex-mono w-full"
        onMouseLeave={() => setActiveIdx(null)}
      >
        <div className={styles.bar}>
          <Link href="/" className={styles.logoLink}>
            <img src="/assets/images/earn-logo.svg" alt="Earn" className={styles.logo} />
          </Link>

          <div className={styles.desktop}>
            <div className={styles.loginRow}>
              <a
                id="login-button"
                href={appLoginUrl || "#"}
                className={`login ${styles.loginLink}`}
                {...(appLoginUrl
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                Login
              </a>
              <button
                id="logout-button"
                type="button"
                className={`hidden ${styles.logoutLink}`}
              >
                Logout
              </button>
            </div>
            <nav>
            <ul className={styles.menu}>
              {navItems.map((item, idx) => (
                <li
                  key={item.key ?? navKeyFromLabel(item.label)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  {...presentationProps(["items", idx] as Path)}
                >
                  {item.dropdown && !item.href ? (
                    <button
                      type="button"
                      onFocus={() => setActiveIdx(idx)}
                      aria-haspopup="true"
                      aria-expanded={activeIdx === idx}
                      className={`font-plex-mono text-base leading-5 transition-colors bg-transparent border-0 cursor-pointer p-0 ${topLinkClass(activeIdx === idx)}`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <NavTopLink
                      href={item.href ?? "#"}
                      label={item.label}
                      onFocus={() => setActiveIdx(idx)}
                      hasDropdown={!!item.dropdown}
                      isActive={activeIdx === idx}
                    />
                  )}
                </li>
              ))}
            </ul>
            </nav>
          </div>

          <div className={styles.menuControls}>
            <button
              id="menu-button"
              type="button"
              className={`${styles.menuButton} ${mobileOpen ? styles.menuOpen : ""}`}
              aria-label={mobileOpen ? "Close navigation" : "Toggle navigation"}
              aria-expanded={mobileOpen}
              onClick={() => (mobileOpen ? closeMobile() : setMobileOpen(true))}
            >
              <span className={styles.menuIcon} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>

        {/* Mega-menu panels: always in the DOM for crawlers; CSS controls visibility. */}
        {navItems.map((item, idx) =>
          item.dropdown ? (
            <MegaMenuPanel
              key={item.key ?? navKeyFromLabel(item.label)}
              activeIdx={idx}
              dropdown={item.dropdown}
              isOpen={activeIdx === idx}
              presentationProps={
                presentation?.documentId ? presentationProps : undefined
              }
            />
          ) : null,
        )}
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        data-next-managed="true"
        className={`${mobileOpen ? "flex" : "hidden"} lg:hidden fixed inset-x-0 top-[var(--navbar-height)] bottom-0 z-40 bg-earn-ink font-plex-mono flex-col overflow-y-auto`}
      >
        <nav className="flex flex-col">
          {navItems.map((item, idx) => (
            <MobileNavRow
              key={item.key ?? navKeyFromLabel(item.label)}
              item={item}
              isOpen={mobileExpanded === idx}
              onToggle={() =>
                setMobileExpanded(mobileExpanded === idx ? null : idx)
              }
              onNavigate={closeMobile}
            />
          ))}
        </nav>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------------- */
/* Desktop dropdown rendering                                                 */
/* ------------------------------------------------------------------------- */

function MegaMenuPanel({
  activeIdx,
  dropdown,
  isOpen,
  presentationProps,
}: {
  activeIdx: number;
  dropdown: NonNullable<NavItem["dropdown"]>;
  isOpen: boolean;
  presentationProps?: (path: Path) => Record<string, string>;
}) {
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    if (!isOpen) {
      setOpen(false);
      return;
    }
    setOpen(false);
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setOpen(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen, activeIdx]);

  return (
    <div
      className={`${styles.panel} ${open && isOpen ? styles.panelOpen : ""} bg-earn-ink-raised max-lg:hidden absolute left-0 right-0 top-full z-[51]`}
      aria-hidden={!isOpen}
    >
      <div
        className={`${styles.panelInner} max-w-content mx-auto px-5 md:px-10 xl:px-0 py-12`}
      >
        {dropdown.kind === "multi-column" ? (
          <MultiColumnContent
            columns={dropdown.columns}
            presentationProps={presentationProps}
            activePath={["items", activeIdx, "columns"] as Path}
          />
        ) : (
          <SingleWithIntroContent
            items={dropdown.items}
            intro={dropdown.intro}
            presentationProps={presentationProps}
            itemsPath={["items", activeIdx, "items"] as Path}
            parentIntroHeadingPath={["items", activeIdx, "introHeading"] as Path}
            parentIntroBodyPath={["items", activeIdx, "introBody"] as Path}
          />
        )}
      </div>
    </div>
  );
}

function MultiColumnContent({
  columns,
  presentationProps,
  activePath,
}: {
  columns: { items: ColumnItem[] }[];
  presentationProps?: (path: Path) => Record<string, string>;
  activePath: Path;
}) {
  return (
    <div
      className="grid gap-x-6 gap-y-7"
      // Column count comes from Sanity at runtime.
      style={{
        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
      }}
    >
      {columns.map((col, i) => (
        <ul
          key={i}
          className="flex flex-col gap-7 list-none m-0 p-0"
          {...(presentationProps ? presentationProps([...activePath, i] as Path) : {})}
        >
          {col.items.map((item, j) => (
            <DesktopColumnItem
              key={j}
              item={item}
              presentationProps={presentationProps}
              itemPath={[...activePath, i, "items", j] as Path}
            />
          ))}
        </ul>
      ))}
    </div>
  );
}

function SingleWithIntroContent({
  items,
  intro,
  presentationProps,
  itemsPath,
  parentIntroHeadingPath,
  parentIntroBodyPath,
}: {
  items: ColumnItem[];
  intro: { heading: string; body: string };
  presentationProps?: (path: Path) => Record<string, string>;
  itemsPath: Path;
  parentIntroHeadingPath: Path;
  parentIntroBodyPath: Path;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const itemsResetKey = items.map((x) => x.label).join("|");
  useEffect(() => {
    setHoveredIdx(null);
  }, [itemsResetKey]);

  /** Row index whose own intro is showing; null when the menu's default intro is showing. */
  const introRowIdx =
    hoveredIdx !== null && rowHasIntro(items[hoveredIdx]) ? hoveredIdx : null;

  const panelCopy = useMemo(() => {
    if (introRowIdx === null) return intro;
    return introForHoveredRow(items, introRowIdx);
  }, [items, intro, introRowIdx]);

  const headingSanityPath =
    introRowIdx === null
      ? parentIntroHeadingPath
      : ([...itemsPath, introRowIdx, "introHeading"] as Path);
  const bodySanityPath =
    introRowIdx === null
      ? parentIntroBodyPath
      : ([...itemsPath, introRowIdx, "introBody"] as Path);

  const handlePanelPointerLeave = (e: ReactPointerEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    setHoveredIdx(null);
  };

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-10 gap-10 lg:gap-0"
      onPointerLeave={handlePanelPointerLeave}
    >
      <div className="lg:col-span-3 lg:pr-15">
        <ul
          className="flex flex-col gap-7 list-none m-0 p-0 lg:pr-6 lg:border-r lg:border-earn-gray-500"
          {...(presentationProps ? presentationProps(itemsPath) : {})}
        >
          {items.map((item, i) => (
            <DesktopColumnItem
              key={i}
              item={item}
              presentationProps={presentationProps}
              itemPath={[...itemsPath, i] as Path}
              onActivate={() => setHoveredIdx(i)}
              isHighlighted={hoveredIdx !== null && hoveredIdx === i}
            />
          ))}
        </ul>
      </div>
      <div className="self-start lg:col-span-7 lg:pl-15 lg:pt-7 min-h-32 max-w-195">
        <h3
          className="font-plex-mono font-semibold text-2xl leading-6.5 text-earn-gray-100 m-0 mb-6"
          {...(presentationProps ? presentationProps(headingSanityPath) : {})}
        >
          {panelCopy.heading}
        </h3>
        <p
          className="font-inter font-medium text-xl leading-8 text-earn-gray-100 m-0"
          {...(presentationProps ? presentationProps(bodySanityPath) : {})}
        >
          {panelCopy.body}
        </p>
      </div>
    </div>
  );
}

/** Right-hand copy when a specific left row is hovered (does not fall back to parent intro). */
function rowHasIntro(row: ColumnItem | undefined): boolean {
  return !!((row?.intro?.heading ?? "").trim() || (row?.intro?.body ?? "").trim());
}

/** Right-hand copy for a hovered row that has its own intro (see `rowHasIntro`). */
function introForHoveredRow(items: ColumnItem[], idx: number): { heading: string; body: string } {
  const row = items[idx];
  if (!row) return { heading: "", body: "" };
  const rh = (row.intro?.heading ?? "").trim();
  const rb = (row.intro?.body ?? "").trim();
  return { heading: rh || row.label, body: rb };
}

function DesktopColumnItem({
  item,
  presentationProps,
  itemPath,
  onActivate,
  isHighlighted,
}: {
  item: ColumnItem;
  presentationProps?: (path: Path) => Record<string, string>;
  itemPath: Path;
  onActivate?: () => void;
  isHighlighted?: boolean;
}) {
  return (
    <li
      {...(presentationProps ? presentationProps(itemPath) : {})}
      onPointerEnter={onActivate}
      onFocusCapture={onActivate ? () => onActivate() : undefined}
    >
      <DropdownRow item={item} isActive={isHighlighted} />
      {item.subitems && item.subitems.length > 0 && (
        <ul className="flex flex-col gap-7 mt-7 ml-10 list-none p-0">
          {item.subitems.map((sub, i) => (
            <li
              key={i}
              {...(presentationProps
                ? presentationProps([...itemPath, "subitems", i] as Path)
                : {})}
            >
              <DropdownRow item={sub} />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * One row in the dropdown (Earn Figma):
 *   - a thin full-width grey line across the column
 *   - a thick orange bar only under the text, on top of the thin line (links only)
 * Rows without a URL render grey with no bar (e.g. "Developers").
 * Subitems are indented by the parent list (`ml-10`), so both lines start 40px in.
 */
function DropdownRow({
  item,
  isActive,
}: {
  item: { label: string; href?: string };
  isActive?: boolean;
}) {
  return (
    <div className="relative w-full after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-earn-gray-500">
      {item.href ? (
        <DropdownLink href={item.href} label={item.label} isActive={isActive} />
      ) : (
        <span
          className={`inline-block font-plex-mono text-base leading-5 font-medium pb-4 transition-colors ${
            isActive ? "text-earn-white" : "text-earn-gray-400"
          }`}
        >
          {item.label}
        </span>
      )}
    </div>
  );
}

function DropdownLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive?: boolean;
}) {
  const isExternal = /^https?:\/\//.test(href);
  const className = `relative z-1 inline-block font-plex-mono text-base leading-5 font-medium pb-4 transition-colors after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-1 after:bg-earn-orange ${
    isActive ? "text-earn-white" : "text-earn-peach hover:text-earn-white"
  }`;

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

/* ------------------------------------------------------------------------- */
/* Mobile drawer row                                                          */
/* ------------------------------------------------------------------------- */

function MobileNavRow({
  item,
  isOpen,
  onToggle,
  onNavigate,
}: {
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const hasDropdown = !!item.dropdown;

  return (
    <div className="border-b border-earn-gray-500">
      <div className="flex items-stretch">
        {hasDropdown ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            className="flex-1 flex items-center justify-between text-left p-5 text-lg font-medium text-earn-orange bg-transparent border-0 cursor-pointer"
          >
            <span>{item.label}</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        ) : (
          <Link
            href={item.href ?? "#"}
            onClick={onNavigate}
            className="flex-1 p-5 text-lg font-medium text-earn-orange"
          >
            {item.label}
          </Link>
        )}
      </div>

      {item.dropdown && (
        <div
          className={`bg-earn-ink-raised px-5 pb-5 pt-2 ${isOpen ? "" : "hidden"}`}
          aria-hidden={!isOpen}
        >
          {item.href && item.href !== "#" && (
            <Link
              href={item.href}
              onClick={onNavigate}
              className="block text-base font-medium text-earn-orange mb-4"
            >
              View {item.label} overview →
            </Link>
          )}

          {item.dropdown.kind === "multi-column" ? (
            item.dropdown.columns.map((col, i) => (
              <MobileItemList
                key={i}
                items={col.items}
                onNavigate={onNavigate}
              />
            ))
          ) : (
            <MobileItemList
              items={item.dropdown.items}
              onNavigate={onNavigate}
            />
          )}
        </div>
      )}
    </div>
  );
}

function MobileItemList({
  items,
  onNavigate,
}: {
  items: ColumnItem[];
  onNavigate: () => void;
}) {
  return (
    <ul className="flex flex-col gap-3 list-none m-0 p-0 mb-3 last:mb-0">
      {items.map((item, i) => (
        <li key={i}>
          <MobileDropdownRow item={item} onNavigate={onNavigate} />
          {item.subitems && item.subitems.length > 0 && (
            <ul className="flex flex-col gap-3 mt-3 ml-12 list-none m-0 p-0">
              {item.subitems.map((sub: Subitem, j) => (
                <li key={j}>
                  <MobileDropdownRow item={sub} onNavigate={onNavigate} isSubitem />
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

function MobileDropdownRow({
  item,
  onNavigate,
  isSubitem,
}: {
  item: { label: string; href?: string }
  onNavigate: () => void
  isSubitem?: boolean
}) {
  const fontClass = isSubitem ? 'text-sm font-medium' : 'text-base font-medium'
  const wrapperClass =
    "relative w-full after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-earn-gray-500"

  if (!item.href) {
    return (
      <div className={wrapperClass}>
        <span className={`inline-block ${fontClass} text-earn-gray-400 pb-3`}>{item.label}</span>
      </div>
    )
  }

  return (
    <div className={wrapperClass}>
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`relative z-1 inline-block ${fontClass} text-earn-peach hover:text-earn-white transition-colors pb-3 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-1 after:bg-earn-orange`}
      >
        {item.label}
      </Link>
    </div>
  )
}
