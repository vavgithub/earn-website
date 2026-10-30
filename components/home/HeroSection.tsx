import type { CSSProperties } from "react";
import Link from "next/link";
import { LinkText, newTabProps } from "@/components/home/LinkText";
import styles from "./HeroSection.module.css";

export type HeroBannerButton = {
  label: string;
  href: string;
  kind: "button" | "textLink";
  fill?: string;
  ink?: string;
  openInNewTab?: boolean;
};

export type HeroSectionProps = {
  headingId?: string;
  heading?: string;
  body?: string;
  imageSrc?: string;
  imageAlt?: string;
  showImage?: boolean;
  backgroundColor?: string;
  imageFit?: "cover" | "none";
  imagePosition?: string;
  copyOpacity?: number;
  textColor?: string;
  headingSize?: string;
  button?: HeroBannerButton | null;
  paddingTop?: string;
  paddingBottom?: string;
  copyPaddingTop?: string;
  copyPaddingBottom?: string;
};

function linesFrom(value: string | undefined) {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function paragraphsFrom(value: string | undefined) {
  if (!value) return [];
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

function bannerStyle(props: HeroSectionProps): CSSProperties | undefined {
  const style: CSSProperties & Record<string, string> = {};
  if (props.backgroundColor) style["--banner-background"] = props.backgroundColor;
  if (props.textColor) style["--banner-text"] = props.textColor;
  if (props.imageFit) style["--banner-image-fit"] = props.imageFit;
  if (props.imagePosition) style["--banner-image-position"] = props.imagePosition;
  if (props.copyOpacity !== undefined) style["--banner-copy-opacity"] = String(props.copyOpacity);
  if (props.headingSize) style["--banner-heading-size"] = props.headingSize;
  if (props.paddingTop) style["--banner-pad-top"] = props.paddingTop;
  if (props.paddingBottom) style["--banner-pad-bottom"] = props.paddingBottom;
  if (props.copyPaddingTop) style["--banner-copy-pad-top"] = props.copyPaddingTop;
  if (props.copyPaddingBottom) style["--banner-copy-pad-bottom"] = props.copyPaddingBottom;
  if (props.button?.fill) style["--banner-button-fill"] = props.button.fill;
  if (props.button?.ink) style["--banner-button-ink"] = props.button.ink;
  return Object.keys(style).length > 0 ? style : undefined;
}

export function HeroSection(props: HeroSectionProps = {}) {
  const headingLines = linesFrom(props.heading);
  const paragraphs = paragraphsFrom(props.body);
  const imageSrc = props.imageSrc;
  const showImage = props.showImage !== false && Boolean(imageSrc);
  const headingId = props.headingId ?? "home-hero-heading";
  const button = props.button?.label && props.button.href ? props.button : null;

  return (
    <section
      className={styles.hero}
      aria-labelledby={headingLines.length > 0 ? headingId : undefined}
      style={bannerStyle(props)}
    >
      {showImage ? (
        <div className={styles.mediaWrap}>
          <img className={styles.media} src={imageSrc} alt={props.imageAlt ?? ""} />
          <div className={styles.scrim} />
        </div>
      ) : null}
      <div className={styles.stage}>
        <div className={styles.copy}>
          {headingLines.length > 0 ? (
            <h1 id={headingId} className={styles.heading}>
              {headingLines.map((line) => (
                <span key={line} className={styles.headingLine}>
                  {line}
                </span>
              ))}
            </h1>
          ) : null}
          {paragraphs.length > 0 ? (
            <div className={styles.body}>
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}
          {button ? <BannerAction button={button} /> : null}
        </div>
      </div>
    </section>
  );
}

function BannerAction({ button }: { button: HeroBannerButton }) {
  const className = `${styles.action} ${button.kind === "textLink" ? styles.actionLink : styles.actionButton}`;
  const label = <LinkText>{button.label}</LinkText>;
  if (button.href === "#" || isExternalHref(button.href) || button.openInNewTab) {
    return (
      <a href={button.href} className={className} {...newTabProps(button.openInNewTab)}>
        {label}
      </a>
    );
  }
  const href = button.href.startsWith("/") ? button.href : `/${button.href}`;
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
