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

const appRegisterUrl = process.env.NEXT_PUBLIC_APP_REGISTER_URL?.trim() ?? "";
const appLoginUrl = process.env.NEXT_PUBLIC_APP_LOGIN_URL?.trim() ?? "";

/**
 * Top navigation. Layout above the dropdown panel is the legacy layout:
 *   - desktop logo bottom-left, nav items bottom-row, CTAs absolute-positioned top-right
 *   - mobile: logo left, hamburger right, full-screen accordion drawer below
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
 *     Hovering a row shows that row’s intro (`introHeading` / `introBody` on the row); leaving the
 *     two-column panel resets to the default intro.
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
        className="navbar-pinned bg-white px-5 md:px-0 w-full md:relative"
        onMouseLeave={() => setActiveIdx(null)}
      >
        <div className="flex justify-between items-center md:items-end mt-4 md:mt-0 mb-2 md:mb-0 md:pt-[25px] md:pb-[11px] md:px-10 lg:px-[100px] max-w-content mx-auto relative bg-white">
          <Link href="/" className="font-mokoko text-xl text-brand-dark mb-3">
            Earn
          </Link>

          <nav className="hidden md:block lg:pr-[20px] self-end">
            <ul className="flex gap-[20px] lg:gap-[30px] list-none md:pb-5 m-0">
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
                      className={`text-base font-medium transition-colors bg-transparent border-0 cursor-pointer p-0 ${
                        activeIdx === idx
                          ? "text-brand-red"
                          : "text-[#142D21] hover:text-brand-red"
                      }`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      href={item.href ?? "#"}
                      onFocus={() => setActiveIdx(idx)}
                      aria-haspopup={item.dropdown ? "true" : undefined}
                      aria-expanded={
                        item.dropdown ? activeIdx === idx : undefined
                      }
                      className={`text-base font-medium transition-colors ${
                        activeIdx === idx
                          ? "text-brand-red"
                          : "text-[#142D21] hover:text-brand-red"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center md:items-start md:self-start gap-5 md:gap-8 md:absolute md:right-[clamp(1.25rem,9vw,4%)] md:top-[13%] lg:right-[clamp(1.25rem,10vw,10%)] xl:right-0 xl:relative">
            {appRegisterUrl ? (
              <a
                id="get-started-button"
                href={appRegisterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-brand-red whitespace-nowrap hover:opacity-80 transition-opacity"
              >
                Get Started
              </a>
            ) : null}
            {appLoginUrl ? (
              <a
                id="login-button"
                href={appLoginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-brand-red whitespace-nowrap hover:opacity-80 transition-opacity"
              >
                Login
              </a>
            ) : null}
            <button
              id="logout-button"
              type="button"
              className="hidden text-sm font-medium text-brand-red whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              Logout
            </button>
            <button
              id="menu-button"
              type="button"
              className={`md:hidden border-0 bg-transparent text-2xl cursor-pointer text-brand-dark p-0 ml-0 ${mobileOpen ? "hidden" : ""}`}
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen(true)}
            >
              <img src="/assets/icons/menu-icon.svg" alt="Menu Icon" />
            </button>
            <button
              id="close-menu"
              type="button"
              className={`md:hidden border-0 bg-transparent text-2xl cursor-pointer text-brand-dark p-0 ml-0 ${mobileOpen ? "" : "hidden"}`}
              aria-label="Close navigation"
              onClick={closeMobile}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
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
        className={`${mobileOpen ? "flex" : "hidden"} md:hidden fixed inset-x-0 top-[var(--navbar-height)] bottom-0 z-40 bg-white flex-col overflow-y-auto`}
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
      className={`${styles.panel} ${open && isOpen ? styles.panelOpen : ""} max-md:hidden absolute left-0 right-0 top-full z-[51]`}
      aria-hidden={!isOpen}
    >
      <div
        className={`${styles.panelInner} max-w-content mx-auto px-5 md:px-10 lg:px-[100px] py-12`}
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
      className="grid gap-x-8 gap-y-8 lg:gap-x-12"
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

  const panelCopy = useMemo(() => {
    if (hoveredIdx === null) return intro;
    return introForHoveredRow(items, hoveredIdx);
  }, [items, intro, hoveredIdx]);

  const headingSanityPath =
    hoveredIdx === null
      ? parentIntroHeadingPath
      : ([...itemsPath, hoveredIdx, "introHeading"] as Path);
  const bodySanityPath =
    hoveredIdx === null
      ? parentIntroBodyPath
      : ([...itemsPath, hoveredIdx, "introBody"] as Path);

  const handlePanelPointerLeave = (e: ReactPointerEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    setHoveredIdx(null);
  };

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16"
      onPointerLeave={handlePanelPointerLeave}
    >
      <ul
        className="flex flex-col gap-7 list-none m-0 p-0"
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
      <div className="self-start max-w-[480px] min-h-[8rem]">
        <h3
          className="text-[20px] md:text-[22px] leading-snug text-[#142D21] font-normal mb-3"
          {...(presentationProps ? presentationProps(headingSanityPath) : {})}
        >
          {panelCopy.heading}
        </h3>
        <p
          className="text-[15px] md:text-[16px] leading-relaxed text-[#142D21]/80"
          {...(presentationProps ? presentationProps(bodySanityPath) : {})}
        >
          {panelCopy.body}
        </p>
      </div>
    </div>
  );
}

/** Right-hand copy when a specific left row is hovered (does not fall back to parent intro). */
function introForHoveredRow(items: ColumnItem[], idx: number): { heading: string; body: string } {
  const row = items[idx];
  if (!row) return { heading: "", body: "" };
  const rh = (row.intro?.heading ?? "").trim();
  const rb = (row.intro?.body ?? "").trim();
  if (rh || rb) {
    return { heading: rh || row.label, body: rb };
  }
  return { heading: row.label, body: "" };
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
        <ul className="flex flex-col gap-7 mt-7 ml-12 list-none m-0 p-0">
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
 * One row in the dropdown. Matches the Figma screenshot:
 *   - a thin full-width underline across the column
 *   - a thick underline segment only under the text, overlaid on top of the thin line
 * Subitems are indented by the parent list (`ml-12`), so both lines start 48px in.
 */
function DropdownRow({
  item,
  isActive,
}: {
  item: { label: string; href?: string };
  isActive?: boolean;
}) {
  return (
    <div className="relative w-full after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-[#AEAEAE]">
      {item.href ? (
        <DropdownLink href={item.href} label={item.label} isActive={isActive} />
      ) : (
        <span
          className={`inline-block text-[15px] font-medium pb-2 transition-colors ${
            isActive ? "text-brand-red" : "text-[#142D21]"
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
  const className = isActive
    ? "relative inline-block text-[15px] text-brand-red pb-2 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[6px] after:bg-brand-red"
    : "relative inline-block text-[15px] text-[#142D21] hover:text-brand-red transition-colors pb-2 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[6px] after:bg-[#AEAEAE] hover:after:bg-brand-red";

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
    <div className="border-b border-[#E5E5E5]">
      <div className="flex items-stretch">
        {hasDropdown ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            className="flex-1 flex items-center justify-between text-left p-5 text-lg font-medium text-[#142D21] bg-transparent border-0 cursor-pointer"
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
            className="flex-1 p-5 text-lg font-medium text-[#142D21]"
          >
            {item.label}
          </Link>
        )}
      </div>

      {item.dropdown && (
        <div
          className={`bg-[#F2F2F2] px-5 pb-5 pt-2 ${isOpen ? "" : "hidden"}`}
          aria-hidden={!isOpen}
        >
          {item.href && item.href !== "#" && (
            <Link
              href={item.href}
              onClick={onNavigate}
              className="block text-[15px] font-medium text-brand-red mb-4"
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
  const fontClass = isSubitem ? 'text-[14px]' : 'text-[15px] font-medium'
  const wrapperClass =
    "relative w-full after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-[#AEAEAE]"

  if (!item.href) {
    return (
      <div className={wrapperClass}>
        <span className={`inline-block ${fontClass} text-[#142D21] pb-2`}>{item.label}</span>
      </div>
    )
  }

  return (
    <div className={wrapperClass}>
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`relative inline-block ${fontClass} text-[#142D21] hover:text-brand-red transition-colors pb-2 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[6px] after:bg-[#AEAEAE] hover:after:bg-brand-red`}
      >
        {item.label}
      </Link>
    </div>
  )
}
