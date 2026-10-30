import type { CSSProperties } from "react";
import { LinkText, newTabProps } from "@/components/home/LinkText";
import type { ReadingCard } from "@/components/home/readingData";
import styles from "./ReadingSection.module.css";

export type ReadingSectionProps = {
  eyebrow?: string;
  heading?: string;
  cards?: ReadingCard[];
  more?: string;
  moreHref?: string;
  moreOpen?: boolean;
  showMore?: boolean;
  imageProportion?: string;
  linkKind?: "textLink" | "button";
  appearance?: CSSProperties;
};

export function ReadingSection({
  eyebrow = "",
  heading = "",
  cards = [],
  more = "",
  moreHref = "#",
  moreOpen = false,
  showMore = true,
  imageProportion,
  linkKind,
  appearance,
}: ReadingSectionProps = {}) {
  return (
    <section className={styles.section} aria-labelledby="reading-heading" style={appearance}>
      <div className={styles.stage}>
        <header className={styles.header}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          {heading ? (
            <h2 id="reading-heading" className={styles.heading}>
              {heading}
            </h2>
          ) : null}
        </header>

        <div className={styles.content}>
          <div className={styles.grid}>
            {cards.map((card) => (
              <article key={card.id} className={styles.card}>
                <div
                  className={`${styles.media} ${card.rounded ? styles.rounded : ""}`}
                  style={imageProportion ? { aspectRatio: imageProportion, height: "auto" } : undefined}
                >
                  <img src={card.image} alt={card.imageAlt} />
                </div>
                <div className={styles.copy}>
                  <p className={styles.kicker}>{card.kicker}</p>
                  <h3 className={styles.title}>
                    {card.titleLead}
                    {card.titleTail
                      ? card.titleTail.split('\n').map((line, index) => (
                          <span key={`${index}-${line}`}>
                            <br className={styles.break} /> {line}
                          </span>
                        ))
                      : null}
                  </h3>
                </div>
                <div className={styles.foot}>
                  <p className={styles.body}>{card.body}</p>
                  {card.action ? (
                    <a
                      className={linkKind === "textLink" ? styles.actionText : styles.action}
                      href={card.href || "#"}
                      {...newTabProps(card.openInNewTab)}
                    >
                      {card.actionCompact ? (
                        <>
                          <span className={styles.actionFull}>
                            <LinkText>{card.action}</LinkText>
                          </span>
                          <span className={styles.actionCompact}>
                            <LinkText>{card.actionCompact}</LinkText>
                          </span>
                        </>
                      ) : (
                        <LinkText>{card.action}</LinkText>
                      )}
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          {showMore && more ? (
            <a className={styles.more} href={moreHref} {...newTabProps(moreOpen)}>
              <LinkText>{more}</LinkText>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
