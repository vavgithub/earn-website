import {
  PRINCIPLE_ACTION_LABEL,
  PRINCIPLE_EYEBROW,
  PRINCIPLE_HEADING_LEAD,
  PRINCIPLE_HEADING_TAIL,
  PRINCIPLE_LINE,
} from "@/components/home/principleData";
import styles from "./PrincipleSection.module.css";

export function PrincipleSection() {
  return (
    <section className={styles.section} aria-labelledby="principle-heading">
      <div className={styles.stage}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{PRINCIPLE_EYEBROW}</p>
          <h2 id="principle-heading" className={styles.heading}>
            {PRINCIPLE_HEADING_LEAD}
            <br />
            {PRINCIPLE_HEADING_TAIL}
          </h2>
        </header>
        <div className={styles.action}>
          <p className={styles.actionLabel}>{PRINCIPLE_ACTION_LABEL}</p>
          <p className={styles.line}>{PRINCIPLE_LINE}</p>
        </div>
      </div>
    </section>
  );
}
