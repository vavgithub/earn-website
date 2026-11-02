import type { CSSProperties } from "react";
import { parseSectionHeadingLevel, type SectionHeadingLevel } from "@/lib/cmsSectionHeadingLevel";
import styles from "./PrincipleSection.module.css";

export type PrincipleSectionProps = {
  eyebrow?: string;
  eyebrowStyle?: CSSProperties;
  headingLead?: string;
  headingTail?: string;
  headingStyle?: CSSProperties;
  headingLevel?: SectionHeadingLevel;
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
  headingLevel = "h2",
  line = "",
  subtitleStyle,
  appearance,
}: PrincipleSectionProps = {}) {
  const HeadingTag = parseSectionHeadingLevel(headingLevel, "h2");
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
            <HeadingTag id="principle-heading" className={styles.heading} style={headingStyle}>
              {headingLead}
              {headingTail
                ? headingTail.split('\n').map((line, index) => (
                    <span key={`${index}-${line}`}>
                      <br />
                      {line}
                    </span>
                  ))
                : null}
            </HeadingTag>
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
