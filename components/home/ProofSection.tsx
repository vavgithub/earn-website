import type { CSSProperties } from "react";
import { LinkText, newTabProps } from "@/components/home/LinkText";
import type { ProofItem } from "@/components/home/proofData";
import styles from "./ProofSection.module.css";

export type ProofSectionProps = {
  eyebrow?: string;
  headingLead?: string;
  headingTail?: string;
  items?: ProofItem[];
  logoSize?: string;
  appearance?: CSSProperties;
};

export function ProofSection({
  eyebrow = "",
  headingLead = "",
  headingTail = "",
  items = [],
  logoSize,
  appearance,
}: ProofSectionProps = {}) {
  return (
    <section className={styles.section} aria-labelledby="proof-heading" style={appearance}>
      <div className={styles.stage}>
        <header className={styles.header}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h2 id="proof-heading" className={styles.heading}>
            {headingLead}{" "}
            {headingTail
              ? headingTail.split('\n').map((line, index) => (
                  <span key={`${index}-${line}`}>
                    <br className={styles.break} />
                    {line}
                  </span>
                ))
              : null}
          </h2>
        </header>

        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className={styles.logoWrap}>
                <img className={styles.logo} src={item.logo} alt={item.logoAlt} style={logoSize ? { width: logoSize } : undefined} />
              </div>
              <div className={styles.copy}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.body}>{item.body}</p>
                {item.action ? (
                  <a className={styles.action} href={item.href || "#"} {...newTabProps(item.openInNewTab)}>
                    <LinkText>{item.action}</LinkText>
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
