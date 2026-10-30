import type { ReactNode } from "react";
import styles from "./LinkText.module.css";

/** Drops a typed arrow so the icon is the only arrow. */
export function plainLinkLabel(value: string) {
  return value.replace(/\s*(?:→|->|➜)\s*$/u, "").trim();
}

export function newTabProps(open?: boolean) {
  return open ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};
}

export function LinkText({ children }: { children: ReactNode }) {
  const label = typeof children === "string" ? plainLinkLabel(children) : children;
  if (typeof label === "string" && !label) return null;
  return (
    <span className={styles.label}>
      {label}
      <svg className={styles.icon} viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
