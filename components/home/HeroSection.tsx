import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { parseSectionHeadingLevel, type SectionHeadingLevel } from "@/lib/cmsSectionHeadingLevel";
import { LinkText, newTabProps } from "@/components/home/LinkText";
import styles from "./HeroSection.module.css";

export type HeroBannerButton = {
  label: string;
  href: string;
  kind: "button" | "textLink" | "ghost";
  fill?: string;
  ink?: string;
  size?: string;
  openInNewTab?: boolean;
};

export type HeroSectionProps = {
  headingId?: string;
  heading?: string;
  headingLevel?: SectionHeadingLevel;
  body?: string;
  richBody?: PortableTextBlock[] | null;
  imageSrc?: string;
  videoSrc?: string;
  imageAlt?: string;
  showImage?: boolean;
  backgroundColor?: string;
  imageFit?: "cover" | "none";
  imagePosition?: string;
  copyOpacity?: number;
  copyFill?: string;
  copyAlign?: "left" | "center" | "right";
  fitContent?: boolean;
  textColor?: string;
  headingSize?: string;
  bodyColor?: string;
  bodySize?: string;
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

const richBodyComponents = {
  marks: {
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => {
      const href = value?.href || "#";
      if (href === "#" || isExternalHref(href)) {
        return (
          <a href={href} {...newTabProps(isExternalHref(href))}>
            {children}
          </a>
        );
      }
      const path = href.startsWith("/") ? href : `/${href}`;
      return <Link href={path}>{children}</Link>;
    },
  },
};

function bannerStyle(props: HeroSectionProps): CSSProperties | undefined {
  const style: CSSProperties & Record<string, string> = {};
  if (props.backgroundColor) style["--banner-background"] = props.backgroundColor;
  if (props.textColor) style["--banner-text"] = props.textColor;
  if (props.imageFit) style["--banner-image-fit"] = props.imageFit;
  if (props.imagePosition) style["--banner-image-position"] = props.imagePosition;
  if (props.copyOpacity !== undefined) style["--banner-copy-opacity"] = String(props.copyOpacity);
  if (props.copyFill) style["--banner-copy-fill"] = props.copyFill;
  if (props.headingSize) style["--banner-heading-size"] = props.headingSize;
  if (props.bodyColor) style["--banner-body-color"] = props.bodyColor;
  if (props.bodySize) style["--banner-body-size"] = props.bodySize;
  if (props.button?.size) style["--banner-button-size"] = props.button.size;
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
  const richBody = Array.isArray(props.richBody) && props.richBody.length > 0 ? props.richBody : null;
  const imageSrc = props.imageSrc;
  const showImage = props.showImage !== false && Boolean(imageSrc || props.videoSrc);
  const headingId = props.headingId ?? "home-hero-heading";
  const HeadingTag = parseSectionHeadingLevel(props.headingLevel, "h1");
  const button = props.button?.label && props.button.href ? props.button : null;
  const align = props.copyAlign === "center" || props.copyAlign === "right" ? props.copyAlign : "left";

  return (
    <section
      className={props.fitContent ? `${styles.hero} ${styles.heroContent}` : styles.hero}
      aria-labelledby={headingLines.length > 0 ? headingId : undefined}
      style={bannerStyle(props)}
    >
      {showImage ? (
        <div className={styles.mediaWrap}>
          {props.videoSrc ? (
            <video className={styles.media} src={props.videoSrc} autoPlay muted loop playsInline />
          ) : (
            <img className={styles.media} src={imageSrc} alt={props.imageAlt ?? ""} />
          )}
          <div className={styles.scrim} />
        </div>
      ) : null}
      <div
        className={
          align === "center" ? `${styles.stage} ${styles.stageCenter}` : align === "right" ? `${styles.stage} ${styles.stageRight}` : styles.stage
        }
      >
        <div
          className={
            align === "center" ? `${styles.copy} ${styles.copyCenter}` : align === "right" ? `${styles.copy} ${styles.copyRight}` : styles.copy
          }
        >
          {headingLines.length > 0 ? (
            <HeadingTag id={headingId} className={styles.heading}>
              {headingLines.map((line, index) => (
                <span key={`${index}-${line}`} className={styles.headingLine}>
                  {line}
                </span>
              ))}
            </HeadingTag>
          ) : null}
          {richBody ? (
            <div className={`${styles.body} ${styles.rich}`}>
              <PortableText value={richBody} components={richBodyComponents} />
            </div>
          ) : paragraphs.length > 0 ? (
            <div className={styles.body}>
              {paragraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph}`}>{paragraph}</p>
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
  const kindClass =
    button.kind === "textLink" ? styles.actionLink : button.kind === "ghost" ? styles.actionGhost : styles.actionButton;
  const className = `${styles.action} ${kindClass}`;
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
