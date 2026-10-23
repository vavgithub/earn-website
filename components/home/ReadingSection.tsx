import {
  READING_CARDS,
  READING_EYEBROW,
  READING_HEADING,
  READING_MORE,
} from "@/components/home/readingData";
import styles from "./ReadingSection.module.css";

export function ReadingSection() {
  return (
    <section className={styles.section} aria-labelledby="reading-heading">
      <div className={styles.stage}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{READING_EYEBROW}</p>
          <h2 id="reading-heading" className={styles.heading}>
            {READING_HEADING}
          </h2>
        </header>

        <div className={styles.content}>
          <div className={styles.grid}>
            {READING_CARDS.map((card) => (
              <article key={card.id} className={styles.card}>
                <div
                  className={`${styles.media} ${card.rounded ? styles.rounded : ""}`}
                >
                  <img src={card.image} alt={card.imageAlt} />
                </div>
                <div className={styles.copy}>
                  <p className={styles.kicker}>{card.kicker}</p>
                  <h3 className={styles.title}>
                    {card.titleLead}
                    {card.titleTail ? (
                      <>
                        <br className={styles.break} /> {card.titleTail}
                      </>
                    ) : null}
                  </h3>
                </div>
                <div className={styles.foot}>
                  <p className={styles.body}>{card.body}</p>
                  <a className={styles.action} href="#">
                    {card.actionCompact ? (
                      <>
                        <span className={styles.actionFull}>{card.action}</span>
                        <span className={styles.actionCompact}>
                          {card.actionCompact}
                        </span>
                      </>
                    ) : (
                      card.action
                    )}
                  </a>
                </div>
              </article>
            ))}
          </div>
          <a className={styles.more} href="#">
            {READING_MORE}
          </a>
        </div>
      </div>
    </section>
  );
}
