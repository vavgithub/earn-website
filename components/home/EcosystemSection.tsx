import {
  ECOSYSTEM_EYEBROW,
  ECOSYSTEM_HEADING,
  ECOSYSTEM_LINK_LABEL,
  ECOSYSTEM_SLIDES,
  type EcosystemCard,
} from "@/components/home/ecosystemData";
import styles from "./EcosystemSection.module.css";

function AudienceCard({ card, marker = false }: { card: EcosystemCard; marker?: boolean }) {
  return (
    <div className={styles.item}>
      {marker ? <span className={styles.dot} aria-hidden="true" /> : null}
      <article className={styles.card}>
        <h4 className={styles.cardTitle}>{card.title}</h4>
        <p className={styles.cardBody}>{card.body}</p>
        <a className={styles.cardLink} href="#">
          {ECOSYSTEM_LINK_LABEL}
        </a>
      </article>
    </div>
  );
}

export function EcosystemSection() {
  return (
    <section className={styles.section} aria-labelledby="ecosystem-heading">
      <img className={styles.topo} src="/assets/images/ecosystem/topo.svg" alt="" />
      <div className={styles.intro}>
        <p className={styles.eyebrow}>{ECOSYSTEM_EYEBROW}</p>
        <h2 id="ecosystem-heading" className={styles.heading}>
          {ECOSYSTEM_HEADING}
        </h2>
      </div>
      <div className={styles.slides}>
        {ECOSYSTEM_SLIDES.map((slide) => (
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
                <a className={styles.cta} href="#">
                  {slide.cta}
                </a>
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
    </section>
  );
}
