import type { CSSProperties } from "react";
import { parseSectionHeadingLevel, type SectionHeadingLevel } from "@/lib/cmsSectionHeadingLevel";
import { LinkText, newTabProps } from "@/components/home/LinkText";
import { WORK_ARROWS } from "@/components/home/workData";
import styles from "./WorkSection.module.css";

export type WorkSectionProps = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  panelTitle?: string;
  bodyLead?: string;
  bodyTail?: string;
  action?: string;
  actionHref?: string;
  actionOpen?: boolean;
  showArrows?: boolean;
  appearance?: CSSProperties;
  eyebrowStyle?: CSSProperties;
  headingStyle?: CSSProperties;
  headingLevel?: SectionHeadingLevel;
  introStyle?: CSSProperties;
  panelTitleStyle?: CSSProperties;
  bodyStyle?: CSSProperties;
};

export function WorkSection({
  eyebrow = "",
  heading = "",
  intro = "",
  panelTitle = "",
  bodyLead = "",
  bodyTail = "",
  action = "",
  actionHref = "#",
  actionOpen = false,
  showArrows = true,
  appearance,
  eyebrowStyle,
  headingStyle,
  headingLevel = "h2",
  introStyle,
  panelTitleStyle,
  bodyStyle,
}: WorkSectionProps = {}) {
  const HeadingTag = parseSectionHeadingLevel(headingLevel, "h2");
  return (
    <section className={styles.section} aria-labelledby="work-heading" style={appearance}>
      <div className={styles.stage}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            {eyebrow ? <p className={styles.eyebrow} style={eyebrowStyle}>{eyebrow}</p> : null}
            {heading ? (
              <HeadingTag id="work-heading" className={styles.heading} style={headingStyle}>
                {heading}
              </HeadingTag>
            ) : null}
          </div>
          <p className={styles.intro} style={introStyle}>{intro}</p>
        </header>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle} style={panelTitleStyle}>{panelTitle}</h3>
          <p className={styles.body} style={bodyStyle}>
            {bodyLead}
            {bodyTail ? (
              <>
                <br />
                {bodyTail}
              </>
            ) : null}
          </p>
          <div className={styles.actionRow}>
            {action ? (
              <a className={styles.action} href={actionHref} {...newTabProps(actionOpen)}>
                <LinkText>{action}</LinkText>
              </a>
            ) : null}
            {showArrows ? (
            <div className={styles.arrows} aria-hidden="true">
              {WORK_ARROWS.map((arrow) => (
                <img
                  key={arrow.fade}
                  className={`${styles.arrow} ${styles[arrow.fade]}`}
                  src={arrow.src}
                  alt=""
                />
              ))}
            </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
