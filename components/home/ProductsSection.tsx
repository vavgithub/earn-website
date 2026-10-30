"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { LinkText, newTabProps } from "@/components/home/LinkText";
import type { Product } from "@/components/home/productsData";
import styles from "./ProductsSection.module.css";

export type ProductFilter = { id: string; label: string };

function cardStyle(product: Product): CSSProperties | undefined {
  const style: CSSProperties & Record<string, string> = {};
  if (product.textColor) style["--card-text"] = product.textColor;
  if (product.textSize) style["--card-text-size"] = product.textSize;
  if (product.linkColor) style["--card-link"] = product.linkColor;
  return Object.keys(style).length > 0 ? style : undefined;
}

function chipStyle(product: Product): CSSProperties | undefined {
  const style: CSSProperties & Record<string, string> = {};
  if (product.chipBackground) style["--chip-bg"] = product.chipBackground;
  if (product.chipLabelColor) style["--chip-ink"] = product.chipLabelColor;
  return Object.keys(style).length > 0 ? style : undefined;
}

export type FilterPaint = {
  button?: string;
  label?: string;
};

export type ProductsSectionProps = {
  eyebrow?: string;
  heading?: string;
  lead?: string;
  showFilters?: boolean;
  products?: Product[];
  filters?: ProductFilter[];
  filterMenuLabel?: string;
  filterPaint?: FilterPaint;
  appearance?: CSSProperties;
};

export function ProductsSection({
  eyebrow = "",
  heading = "",
  lead = "",
  showFilters = true,
  products = [],
  filters = [],
  filterMenuLabel = "All",
  filterPaint,
  appearance,
}: ProductsSectionProps = {}) {
  const buttonStyle: CSSProperties = {};
  if (filterPaint?.button) {
    buttonStyle.backgroundColor = filterPaint.button;
    buttonStyle.borderColor = filterPaint.button;
  }
  if (filterPaint?.label) buttonStyle.color = filterPaint.label;
  const paintedButton = Object.keys(buttonStyle).length > 0 ? buttonStyle : undefined;
  const pills = [{ id: "all", label: "All" }, ...filters];
  const [role, setRole] = useState<string>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [demandPhoto, setDemandPhoto] = useState<{ src: string; seam: string; remain: string } | null>(null);
  const selected = pills.find((item) => item.id === role);
  const visible =
    role === "all"
      ? products
      : products.filter((product) =>
          (product.filters ?? []).some(
            (name) => name.trim().toLowerCase() === (selected?.label ?? "").trim().toLowerCase(),
          ),
        );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const apply = () => {
      const wide = window.matchMedia("(min-width: 1920px)").matches;
      const eco = document.getElementById("ecosystem-heading")?.closest("section");
      const img = eco?.querySelector('[class*="slideFade"] img');
      const photo = img?.parentElement;
      if (!wide || !(img instanceof HTMLImageElement) || !photo || !img.naturalWidth) {
        setDemandPhoto(null);
        return;
      }
      const box = photo.getBoundingClientRect();
      const scale = Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight);
      const renderedH = img.naturalHeight * scale;
      const cropTop = Math.max(0, (renderedH - box.height) / 2);
      const src = (img.currentSrc || img.src).replace(/"/g, "");
      setDemandPhoto({
        src: `url("${src}")`,
        seam: `${cropTop + box.height}px`,
        remain: `${Math.max(0, renderedH - cropTop - box.height)}px`,
      });
    };

    apply();
    const img = document.getElementById("ecosystem-heading")?.closest("section")?.querySelector('[class*="slideFade"] img');
    img?.addEventListener("load", apply);
    window.addEventListener("resize", apply);
    return () => {
      img?.removeEventListener("load", apply);
      window.removeEventListener("resize", apply);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const sectionStyle: CSSProperties = { ...appearance }
  if (demandPhoto) {
    const photo = sectionStyle as CSSProperties & Record<string, string>
    photo["--demand-photo"] = demandPhoto.src
    photo["--demand-seam"] = demandPhoto.seam
    photo["--demand-remain"] = demandPhoto.remain
  }

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="products-heading" style={sectionStyle}>
      <div className={styles.stage}>
        <header className={styles.header}>
          <div className={styles.intro}>
            {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
            {heading ? (
              <h2 id="products-heading" className={styles.heading}>
                {heading}
              </h2>
            ) : null}
          </div>
          {lead ? <p className={styles.lead}>{lead}</p> : null}
        </header>

        {showFilters && filters.length > 0 ? (
        <>
        <div className={styles.pills} role="group" aria-label={filterMenuLabel}>
          {pills.map((item) => {
            const selected = role === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={selected ? styles.pillOn : styles.pill}
                style={paintedButton}
                aria-pressed={selected}
                onClick={() => setRole(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className={styles.selectWrap} ref={menuRef}>
          <button
            type="button"
            className={styles.select}
            style={paintedButton}
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {role === "all" ? filterMenuLabel : selected?.label}
          </button>
          {menuOpen ? (
            <ul className={styles.menu} role="listbox" aria-label={filterMenuLabel}>
              {pills.map((item) => {
                const active = role === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={active ? styles.menuOn : styles.menuItem}
                      style={paintedButton}
                      onClick={() => {
                        setRole(item.id);
                        setMenuOpen(false);
                      }}
                    >
                      {item.id === "all" ? filterMenuLabel : item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
        </>
        ) : null}

        <div className={styles.grid}>
          {visible.map((product) => (
            <article
              key={product.id}
              className={`${styles.card} ${product.feature ? styles.feature : ""} ${product.span ? styles.span2 : ""}`}
              style={cardStyle(product)}
            >
              {product.iconUrl ? (
                <img
                  className={`${styles.icon} ${product.iconMode === "image" ? styles.iconPhoto : ""}`}
                  src={product.iconUrl}
                  alt=""
                />
              ) : null}
              <div className={styles.copy}>
                <div className={styles.titles}>
                  {product.brand ? <p className={styles.brand}>{product.brand}</p> : null}
                  <h3 className={styles.title}>{product.title}</h3>
                </div>
                <div className={styles.body}>
                  {product.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {product.linkLabel ? (
                    <a
                      className={product.linkKind === "textLink" ? styles.moreText : styles.more}
                      href={product.href || "#"}
                      {...newTabProps(product.openInNewTab)}
                    >
                      <LinkText>{product.linkLabel}</LinkText>
                    </a>
                  ) : null}
                </div>
                {product.chips?.length ? (
                  <ul className={styles.chips} aria-label={`${product.title} tags`}>
                    {product.chips.map((chip, index) => (
                      <li key={`${chip}-${index}`} className={styles.chip} style={chipStyle(product)}>
                        {chip}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
