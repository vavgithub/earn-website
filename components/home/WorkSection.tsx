import type { CSSProperties } from "react";
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
}: WorkSectionProps = {}) {
  return (
    <section className={styles.section} aria-labelledby="work-heading" style={appearance}>
      <div className={styles.stage}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
            {heading ? (
              <h2 id="work-heading" className={styles.heading}>
                {heading}
              </h2>
            ) : null}
          </div>
          <p className={styles.intro}>{intro}</p>
        </header>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>{panelTitle}</h3>
          <p className={styles.body}>
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
