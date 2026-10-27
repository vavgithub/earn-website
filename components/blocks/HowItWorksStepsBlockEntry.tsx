import { stegaClean } from "next-sanity";
import {
  HowItWorksStepsBlock,
  type HowItWorksFooterLink,
  type HowItWorksStep,
} from "@/components/marketing-blocks/HowItWorksStepsBlock";
import { parseTextColor } from "@/lib/cmsTextColor";
import { parseTextSize } from "@/lib/cmsTextSize";
import { parseNestedRichTextRow } from "@/lib/nestedRichTextRow";
import PageBlockLayout from "@/components/blocks/PageBlockLayout";
import PageBlockSection from "@/components/blocks/PageBlockSection";
import {
  blockContentAlignmentClass,
  parseBlockContentAlignment,
} from "@/lib/blockContentAlignment";
import type { PortableTextBlock } from "@portabletext/react";

type StepDoc = Record<string, unknown> & {
  title?: string;
  content?: PortableTextBlock[];
};

export default function HowItWorksStepsBlockEntry({ block }: { block: any }) {
  const heading =
    typeof block?.heading === "string" ? stegaClean(block.heading).trim() : "";
  const intro =
    typeof block?.intro === "string" ? stegaClean(block.intro).trim() : "";

  const legacyStepFallback = {
    textSize: parseTextSize(block?.stepContentTextSize, "md"),
    linkColor: parseTextColor(block?.stepContentLinkColor, "brightYellow"),
    textColor: "offWhite" as const,
  };

  const rawSteps: StepDoc[] = Array.isArray(block?.steps) ? block.steps : [];
  const steps: HowItWorksStep[] = rawSteps
    .map((row) => {
      const title =
        typeof row?.title === "string" ? stegaClean(row.title).trim() : "";
      const content = Array.isArray(row?.content) ? row.content : [];
      if (!title || content.length === 0) return null;
      const richText = parseNestedRichTextRow(row, "content", legacyStepFallback);
      return { title, content, ...richText };
    })
    .filter((row): row is HowItWorksStep => row !== null);

  if (!heading || steps.length === 0) return null;

  let footerLink: HowItWorksFooterLink | null = null;
  const fl = block?.footerLink;
  if (fl && typeof fl === "object") {
    const label =
      typeof fl.label === "string" ? stegaClean(fl.label).trim() : "";
    const href = typeof fl.href === "string" ? stegaClean(fl.href).trim() : "";
    if (label && href) footerLink = { label, href };
  }

  const headingColor = parseTextColor(block.headingColor, "yellow");
  const introColor = parseTextColor(block.introColor, "offWhite");

  return (
    <PageBlockSection
      block={block}
      blockType="howItWorksStepsBlock"
      defaultBackground="medSlate"
    >
      <PageBlockLayout
        layoutWidth={block.layoutWidth ?? "content"}
        className={blockContentAlignmentClass(block?.alignment)}
      >
        <HowItWorksStepsBlock
          alignment={parseBlockContentAlignment(block?.alignment)}
          heading={heading}
          headingColor={headingColor}
          intro={intro || undefined}
          introColor={introColor}
          introTextSize={parseTextSize(block.introTextSize, "md")}
          steps={steps}
          footerLink={footerLink}
        />
      </PageBlockLayout>
    </PageBlockSection>
  );
}
