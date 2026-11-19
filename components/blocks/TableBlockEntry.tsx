import type { PortableTextBlock } from "@portabletext/react";
import {
  BlockSectionHeader,
  getBlockSectionHeader,
} from "@/components/blocks/BlockSectionHeader";
import { TableBlock } from "@/components/marketing-blocks";
import PageBlockLayout from "@/components/blocks/PageBlockLayout";
import PageBlockSection from "@/components/blocks/PageBlockSection";
import { parseTextColor, TEXT_COLOR_HEX } from "@/lib/cmsTextColor";
import { parseTextSize } from "@/lib/cmsTextSize";
import { stegaClean } from "next-sanity";
import { TEXT_COLOR_LEGACY_ALIASES, TEXT_COLOR_VALUES } from "@/sanity/lib/textColorField";

type LegacyRow = { feature?: string; detail?: string };
type NewRow = { cells?: unknown };

function isLegacyRowShape(rows: unknown[]): boolean {
  const first = rows[0] as LegacyRow & NewRow;
  return Boolean(
    first &&
    typeof first === "object" &&
    "feature" in first &&
    "detail" in first &&
    !Array.isArray(first.cells),
  );
}

function columnHeading(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object" && "heading" in value) {
    return String((value as { heading?: unknown }).heading ?? "").trim();
  }
  return "";
}

function columnWidthCss(value: unknown) {
  if (!value || typeof value !== "object") return undefined;
  const unit = stegaClean(String((value as { widthUnit?: unknown }).widthUnit ?? "")).trim();
  const amount = (value as { widthValue?: unknown }).widthValue;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) return undefined;
  if (unit === "percent") return `${amount}%`;
  if (unit === "pixel") return `${amount}px`;
  return undefined;
}

function gridLineColor(value: unknown) {
  const raw = stegaClean(typeof value === "string" ? value : "").trim();
  if (!raw) return undefined;
  if (raw in TEXT_COLOR_LEGACY_ALIASES || (TEXT_COLOR_VALUES as readonly string[]).includes(raw)) {
    return TEXT_COLOR_HEX[parseTextColor(raw, "lightGrey")];
  }
  return undefined;
}

function normalizeColumns(block: any): string[] | null {
  if (Array.isArray(block?.columns) && block.columns.length >= 2) {
    return block.columns.map((c: unknown) => columnHeading(c));
  }

  const rawRows = Array.isArray(block?.rows) ? block.rows : [];
  if (rawRows.length > 0 && isLegacyRowShape(rawRows)) {
    const left =
      typeof block.leftHeading === "string" && block.leftHeading.trim()
        ? block.leftHeading.trim()
        : "Feature";
    const right =
      typeof block.rightHeading === "string" && block.rightHeading.trim()
        ? block.rightHeading.trim()
        : "Detail";
    return [left, right];
  }

  return null;
}

function normalizeRows(block: any, columnCount: number): string[][] {
  const raw = Array.isArray(block?.rows) ? block.rows : [];

  if (raw.length > 0 && isLegacyRowShape(raw)) {
    return (raw as LegacyRow[])
      .map((r) => [
        typeof r?.feature === "string" ? r.feature.trim() : "",
        typeof r?.detail === "string" ? r.detail.trim() : "",
      ])
      .filter((cells) => cells.some((c) => c.length > 0));
  }

  return (raw as NewRow[])
    .map((r) => {
      const cells = Array.isArray(r?.cells)
        ? r.cells.map((c) => String(c ?? "").trim())
        : [];
      const padded = [...cells];
      while (padded.length < columnCount) padded.push("");
      return padded.slice(0, columnCount);
    })
    .filter((cells) => cells.some((c) => c.length > 0));
}

export default function TableBlockEntry({ block }: { block: any }) {
  const columns = normalizeColumns(block);
  if (!columns || columns.length < 2) return null;

  const rows = normalizeRows(block, columns.length);
  if (rows.length === 0) return null;

  const section = getBlockSectionHeader(block);

  return (
    <PageBlockSection block={block} blockType="tableBlock">
      <PageBlockLayout layoutWidth={block.layoutWidth}>
        <BlockSectionHeader
          heading={section.heading}
          headingLevel={section.headingLevel}
          intro={section.intro as PortableTextBlock[]}
          headingColor={section.headingColor}
          introColor={section.introColor}
          introTextSize={section.introTextSize}
          introLinkColor={section.introLinkColor}
        />
        <TableBlock
          columns={columns}
          rows={rows}
          columnWidths={
            Array.isArray(block.columnWidths)
              ? columns.map((_, index) => columnWidthCss(block.columnWidths[index]))
              : undefined
          }
          gridLineColor={gridLineColor(block.gridLineColor)}
          columnHeadingTextSize={parseTextSize(block.columnHeadingTextSize, "md")}
          columnHeadingColor={parseTextColor(block.columnHeadingColor, "darkSlate")}
          cellTextSize={parseTextSize(block.cellTextSize, "md")}
          cellTextColor={parseTextColor(block.cellTextColor, "darkSlate")}
        />
      </PageBlockLayout>
    </PageBlockSection>
  );
}
