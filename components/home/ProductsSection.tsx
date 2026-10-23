"use client";

import { useEffect, useRef, useState } from "react";
import {
  PRODUCT_CHIP_COUNT,
  PRODUCT_CHIP_LABEL,
  PRODUCT_EYEBROW,
  PRODUCT_FILTER_LABEL,
  PRODUCT_HEADING,
  PRODUCT_LEAD,
  PRODUCT_LINK_LABEL,
  PRODUCT_LOGOS,
  PRODUCT_ROLES,
  PRODUCTS,
} from "@/components/home/productsData";
import styles from "./ProductsSection.module.css";

export function ProductsSection() {
  const [role, setRole] = useState<string>(PRODUCT_ROLES[0].id);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const selected = PRODUCT_ROLES.find((item) => item.id === role);

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

  return (
    <section className={styles.section} aria-labelledby="products-heading">
      <div className={styles.stage}>
        <header className={styles.header}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>{PRODUCT_EYEBROW}</p>
            <h2 id="products-heading" className={styles.heading}>
              {PRODUCT_HEADING}
            </h2>
          </div>
          <p className={styles.lead}>{PRODUCT_LEAD}</p>
        </header>

        <div className={styles.pills} role="group" aria-label={PRODUCT_FILTER_LABEL}>
          {PRODUCT_ROLES.map((item) => {
            const selected = role === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={selected ? styles.pillOn : styles.pill}
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
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {role === "all" ? PRODUCT_FILTER_LABEL : selected?.label}
          </button>
          {menuOpen ? (
            <ul className={styles.menu} role="listbox" aria-label={PRODUCT_FILTER_LABEL}>
              {PRODUCT_ROLES.map((item) => {
                const active = role === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={active ? styles.menuOn : styles.menuItem}
                      onClick={() => {
                        setRole(item.id);
                        setMenuOpen(false);
                      }}
                    >
                      {item.id === "all" ? PRODUCT_FILTER_LABEL : item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>

        <div className={styles.grid}>
          {PRODUCTS.map((product) => (
            <article
              key={product.id}
              className={`${styles.card} ${product.feature ? styles.feature : ""} ${product.span ? styles.span2 : ""}`}
            >
              <img className={styles.icon} src={PRODUCT_LOGOS[product.logo]} alt="" />
              <div className={styles.copy}>
                <div className={styles.titles}>
                  <p className={styles.brand}>{product.brand}</p>
                  <h3 className={styles.title}>{product.title}</h3>
                </div>
                <div className={styles.body}>
                  {product.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <a className={styles.more} href="#">
                    {PRODUCT_LINK_LABEL}
                  </a>
                </div>
                <ul className={styles.chips} aria-label={`${product.title} roles`}>
                  {Array.from({ length: PRODUCT_CHIP_COUNT }, (_, index) => (
                    <li key={index} className={styles.chip}>
                      {PRODUCT_CHIP_LABEL}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
