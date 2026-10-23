import styles from "./HeroSection.module.css";

const HEADING_LINES = ["Natural gas has to move.", "Earn makes it agent-ready."] as const;

const BODY = [
  "Earn is the verification and settlement infrastructure for natural gas. We link measurement, emissions, and commercial data into a single auditable chain of custody — so every molecule carries proof of where it came from and how it was produced.",
  "That record satisfies the EU Methane Regulation by trace and claim — the route the Commission names first — or by book and claim where certification is the better fit. It is also what AI agents need to qualify, procure, and trade gas without a human in the loop.",
] as const;

export function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="home-hero-heading">
      <div className={styles.mediaWrap}>
        <img className={styles.media} src="/assets/images/hero-platform.png" alt="" />
        <div className={styles.scrim} />
      </div>
      <div className={styles.stage}>
        <div className={styles.copy}>
          <h1 id="home-hero-heading" className={styles.heading}>
            {HEADING_LINES.map((line) => (
              <span key={line} className={styles.headingLine}>
                {line}
              </span>
            ))}
          </h1>
          <div className={styles.body}>
            {BODY.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
