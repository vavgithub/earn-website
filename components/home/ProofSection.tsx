import {
  PROOF_EYEBROW,
  PROOF_HEADING_LEAD,
  PROOF_HEADING_TAIL,
  PROOF_ITEMS,
} from "@/components/home/proofData";
import styles from "./ProofSection.module.css";

export function ProofSection() {
  return (
    <section className={styles.section} aria-labelledby="proof-heading">
      <div className={styles.stage}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{PROOF_EYEBROW}</p>
          <h2 id="proof-heading" className={styles.heading}>
            {PROOF_HEADING_LEAD} <br className={styles.break} />
            {PROOF_HEADING_TAIL}
          </h2>
        </header>

        <ul className={styles.list}>
          {PROOF_ITEMS.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className={styles.logoWrap}>
                <img className={styles.logo} src={item.logo} alt={item.logoAlt} />
              </div>
              <div className={styles.copy}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.body}>{item.body}</p>
                <a className={styles.action} href="#">
                  {item.action}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
