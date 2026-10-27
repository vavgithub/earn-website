import { stegaClean } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/react";
import {
  ContentPanelBlock,
  type ContentPanelButton,
  type ContentPanelLink,
  type ContentPanelVariant,
} from "@/components/marketing-blocks/ContentPanelBlock";
import PageBlockLayout from "@/components/blocks/PageBlockLayout";
import { urlForImage } from "@/sanity/lib/image";
import { parseTextColor } from "@/lib/cmsTextColor";
import { parseTextSize } from "@/lib/cmsTextSize";
import { parseLinksOpenInNewTab } from "@/lib/portableTextLink";
import { resolveTextWithColor } from "@/lib/textWithColor";
import PageBlockSection from "@/components/blocks/PageBlockSection";

function clean(s: unknown) {
  return stegaClean(typeof s === "string" ? s : String(s ?? "")).trim();
}

function parseLink(raw: unknown): ContentPanelLink | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const label = clean(row.label);
  const href = clean(row.href);
  if (!label || !href) return null;
  return { label, href, openInNewTab: Boolean(row.openInNewTab) };
}

function parseButton(raw: unknown): ContentPanelButton | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const label = clean(row.label);
  const href = clean(row.href);
  if (!label || !href) return null;
  return { label, href, openInNewTab: Boolean(row.openInNewTab) };
}

function parseVariant(raw: unknown): ContentPanelVariant {
  if (raw === "mediaTextDark" || raw === "actionPromo") return raw;
  return "mediaTextLight";
}

export default function ContentPanelBlockEntry({
  block,
}: {
  block: Record<string, unknown>;
}) {
  const variant = parseVariant(block.variant);
  const heading = clean(block.heading) || undefined;
  const eyebrowRow = resolveTextWithColor(
    block.eyebrow,
    block.eyebrowColor,
    "offWhite",
  );
  const eyebrow = eyebrowRow.text || undefined;
  const description = clean(block.description) || undefined;
  const body = Array.isArray(block.body)
    ? (block.body as PortableTextBlock[])
    : undefined;

  const image = block.image as { asset?: unknown; alt?: string } | undefined;
  const alt =
    typeof image?.alt === "string" ? stegaClean(image.alt).trim() : "";
  const imageUrl = image?.asset ? urlForImage(image)?.url() : undefined;

  const link = parseLink(block.link);
  const primaryButton = parseButton(block.primaryButton);
  const secondaryButton = parseButton(block.secondaryButton);

  const hasMedia =
    variant !== "actionPromo" &&
    ((body && body.length > 0) ||
      Boolean(imageUrl) ||
      Boolean(heading) ||
      Boolean(link));
  const hasPromo =
    variant === "actionPromo" &&
    Boolean(
      heading || eyebrow || description || primaryButton || secondaryButton,
    );

  if (!hasMedia && !hasPromo) return null;

  return (
    <PageBlockSection block={block} blockType="contentPanelBlock">
      <PageBlockLayout layoutWidth={block.layoutWidth}>
        <ContentPanelBlock
          variant={variant}
          heading={heading}
          headingColor={parseTextColor(block.headingColor, "yellow")}
          eyebrow={eyebrow}
          eyebrowColor={eyebrowRow.color}
          body={body}
          bodyTextColor={parseTextColor(
            block.bodyTextColor,
            variant === "mediaTextDark" ? "offWhite" : "darkSlate",
          )}
          bodyTextSize={parseTextSize(block.bodyTextSize, "md")}
          bodyLinkColor={parseTextColor(block.bodyLinkColor, "brightYellow")}
          bodyLinksOpenInNewTab={parseLinksOpenInNewTab(block.bodyLinksOpenInNewTab)}
          description={description}
          descriptionColor={parseTextColor(block.descriptionColor, "offWhite")}
          descriptionTextSize={parseTextSize(block.descriptionTextSize, "md")}
          imageUrl={imageUrl ?? undefined}
          imageAlt={alt || undefined}
          link={link}
          primaryButton={primaryButton}
          secondaryButton={secondaryButton}
        />
      </PageBlockLayout>
    </PageBlockSection>
  );
}
