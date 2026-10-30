import type { CSSProperties } from "react";
import type { EcosystemCard, EcosystemSlide } from "@/components/home/ecosystemData";
import { LinkText, newTabProps } from "@/components/home/LinkText";
import styles from "./EcosystemSection.module.css";

export type EcosystemSectionProps = {
  eyebrow?: string;
  heading?: string;
  slides?: EcosystemSlide[];
  appearance?: CSSProperties;
};

function AudienceCard({ card, marker = false }: { card: EcosystemCard; marker?: boolean }) {
  return (
    <div className={styles.item}>
      {marker ? <span className={styles.dot} aria-hidden="true" /> : null}
      <article className={styles.card}>
        <h4 className={styles.cardTitle}>{card.title}</h4>
        <p className={styles.cardBody}>{card.body}</p>
        {card.linkLabel ? (
          <a className={styles.cardLink} href={card.href || "#"} {...newTabProps(card.openInNewTab)}>
            <LinkText>{card.linkLabel}</LinkText>
          </a>
        ) : null}
      </article>
    </div>
  );
}

export function EcosystemSection({
  eyebrow = "",
  heading = "",
  slides = [],
  appearance,
}: EcosystemSectionProps = {}) {
  return (
    <section className={styles.section} aria-labelledby="ecosystem-heading" style={appearance}>
      <div className={styles.intro}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        {heading ? (
          <h2 id="ecosystem-heading" className={styles.heading}>
            {heading}
          </h2>
        ) : null}
      </div>
      <div className={styles.field}>
      <img className={styles.topo} src="/assets/images/ecosystem/topo.svg" alt="" />
      <div className={styles.slides}>
        {slides.map((slide) => (
          <article
            key={slide.id}
            className={[
              styles.slide,
              slide.id === "production" ? styles.lineStart : styles.slideTall,
              slide.id === "midstream" ? styles.lineBridge : "",
              slide.id === "demand" ? styles.slideFade : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className={styles.photo} data-tone={slide.tone}>
              <img src={slide.image} alt="" />
              <div className={styles.scrim} />
            </div>
            <div className={styles.content}>
              <div className={styles.copy}>
                <h3 className={styles.slideTitle}>{slide.title}</h3>
                <p className={styles.slideBody}>{slide.body}</p>
                {slide.cta ? (
                  <a className={styles.cta} href={slide.ctaHref || "#"} {...newTabProps(slide.ctaOpen)}>
                    <LinkText>{slide.cta}</LinkText>
                  </a>
                ) : null}
              </div>
              <div className={styles.cards}>
                {slide.lead ? <AudienceCard card={slide.lead} marker /> : null}
                {slide.groups.map((group) => {
                  const endsLine = slide.id === "demand" && group.heading === "Buyers";
                  return (
                    <div key={group.heading || slide.id} className={styles.group}>
                      {group.heading ? (
                        <div className={`${styles.item} ${endsLine ? styles.lineEnd : ""}`}>
                          <span className={styles.dot} aria-hidden="true" />
                          <h4 className={styles.groupLabel}>{group.heading}</h4>
                        </div>
                      ) : null}
                      <div className={group.heading ? styles.groupCards : styles.stack}>
                        {group.cards.map((card) => (
                          <AudienceCard key={card.title} card={card} marker={!group.heading} />
                        ))}
                      </div>
                    </div>
                  );
                })}
                {slide.trailing ? <AudienceCard card={slide.trailing} marker /> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
