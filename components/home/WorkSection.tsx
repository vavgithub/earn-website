import {
  WORK_ACTION,
  WORK_ARROWS,
  WORK_BODY_LEAD,
  WORK_BODY_TAIL,
  WORK_EYEBROW,
  WORK_HEADING,
  WORK_INTRO,
  WORK_TITLE,
} from "@/components/home/workData";
import styles from "./WorkSection.module.css";

export function WorkSection() {
  return (
    <section className={styles.section} aria-labelledby="work-heading">
      <div className={styles.stage}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <p className={styles.eyebrow}>{WORK_EYEBROW}</p>
            <h2 id="work-heading" className={styles.heading}>
              {WORK_HEADING}
            </h2>
          </div>
          <p className={styles.intro}>{WORK_INTRO}</p>
        </header>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>{WORK_TITLE}</h3>
          <p className={styles.body}>
            {WORK_BODY_LEAD}
            <br />
            {WORK_BODY_TAIL}
          </p>
          <div className={styles.actionRow}>
            <a className={styles.action} href="#">
              {WORK_ACTION}
            </a>
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
          </div>
        </div>
      </div>
    </section>
  );
}
