import type { CSSProperties } from "react";
import { parseSectionHeadingLevel, type SectionHeadingLevel } from "@/lib/cmsSectionHeadingLevel";
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
  eyebrowStyle?: CSSProperties;
  headingStyle?: CSSProperties;
  headingLevel?: SectionHeadingLevel;
};

export function ProofSection({
  eyebrow = "",
  headingLead = "",
  headingTail = "",
  items = [],
  logoSize,
  appearance,
  eyebrowStyle,
  headingStyle,
  headingLevel = "h2",
}: ProofSectionProps = {}) {
  const HeadingTag = parseSectionHeadingLevel(headingLevel, "h2");
  return (
    <section className={styles.section} aria-labelledby="proof-heading" style={appearance}>
      <div className={styles.stage}>
        <header className={styles.header}>
          {eyebrow ? <p className={styles.eyebrow} style={eyebrowStyle}>{eyebrow}</p> : null}
          <HeadingTag id="proof-heading" className={styles.heading} style={headingStyle}>
            {headingLead}{" "}
            {headingTail
              ? headingTail.split('\n').map((line, index) => (
                  <span key={`${index}-${line}`}>
                    <br className={styles.break} />
                    {line}
                  </span>
                ))
              : null}
          </HeadingTag>
        </header>

        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className={styles.logoWrap}>
                <img className={styles.logo} src={item.logo} alt={item.logoAlt} style={logoSize ? { width: logoSize } : undefined} />
              </div>
              <div className={styles.copy}>
                <h3 className={styles.title} style={item.titleStyle}>{item.title}</h3>
                <p className={styles.body} style={item.bodyStyle}>{item.body}</p>
                {item.action ? (
                  <a className={styles.action} href={item.href || "#"} style={item.buttonStyle} {...newTabProps(item.openInNewTab)}>
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
