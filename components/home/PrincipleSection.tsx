import type { CSSProperties } from "react";
import styles from "./PrincipleSection.module.css";

export type PrincipleSectionProps = {
  eyebrow?: string;
  eyebrowStyle?: CSSProperties;
  headingLead?: string;
  headingTail?: string;
  headingStyle?: CSSProperties;
  line?: string;
  subtitleStyle?: CSSProperties;
  appearance?: CSSProperties;
};

export function PrincipleSection({
  eyebrow = "",
  eyebrowStyle,
  headingLead = "",
  headingTail = "",
  headingStyle,
  line = "",
  subtitleStyle,
  appearance,
}: PrincipleSectionProps = {}) {
  return (
    <section className={styles.section} aria-labelledby="principle-heading" style={appearance}>
      <div className={styles.stage}>
        <header className={styles.header}>
          {eyebrow ? (
            <p className={styles.eyebrow} style={eyebrowStyle}>
              {eyebrow}
            </p>
          ) : null}
          {headingLead || headingTail ? (
            <h2 id="principle-heading" className={styles.heading} style={headingStyle}>
              {headingLead}
              {headingTail
                ? headingTail.split('\n').map((line, index) => (
                    <span key={`${index}-${line}`}>
                      <br />
                      {line}
                    </span>
                  ))
                : null}
            </h2>
          ) : null}
        </header>
        {line ? (
          <div className={styles.action}>
            <p className={styles.line} style={subtitleStyle}>
              {line}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
