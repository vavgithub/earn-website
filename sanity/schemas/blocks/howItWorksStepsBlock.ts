import { defineField, defineType } from "sanity";
import { NumberIcon } from "@sanity/icons";
import {
  blockLayoutFields,
  blockPaddingRowFieldset,
} from "./blockLayoutFields";
import { textColorField } from "../../lib/textColorField";
import { bodyTextPairFieldset, textColorPairFieldset } from "../../lib/textColorPairFieldset";
import { textSizeField } from "../../lib/textSizeField";
import { sectionBackgroundField } from "../../lib/sectionBackgroundField";
import { pageBuilderBlockPreview } from "../../lib/pageBuilderPreview";
import {
  nestedRichTextRowFieldset,
  nestedRichTextRowFields,
} from "../../lib/nestedRichTextRowFields";

const stepContentRow = nestedRichTextRowFieldset("contentRow", "Step content");

export default defineType({
  name: "howItWorksStepsBlock",
  title: "How it works steps",
  type: "object",
  icon: NumberIcon,
  description:
    "Numbered steps panel with intro copy and optional footer link. Section background defaults to dark green.",
  fieldsets: [
    textColorPairFieldset("headingRow", "Panel heading"),
    bodyTextPairFieldset("introRow", "Intro"),
    blockPaddingRowFieldset,
  ],
  fields: [
    defineField({
      name: "heading",
      title: "Panel heading",
      type: "string",
      fieldset: "headingRow",
      validation: (Rule) => Rule.required(),
    }),
    textColorField({
      name: "headingColor",
      initialValue: "yellow",
      fieldset: "headingRow",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      description: "Short line below the heading (e.g. “…in four steps:”).",
      fieldset: "introRow",
    }),
    textColorField({
      name: "introColor",
      initialValue: "offWhite",
      fieldset: "introRow",
    }),
    textSizeField({
      name: "introTextSize",
      fieldset: "introRow",
    }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      validation: (Rule) => Rule.min(1).error("Add at least one step."),
      of: [
        {
          type: "object",
          name: "howItWorksStepItem",
          title: "Step",
          fieldsets: [stepContentRow],
          fields: [
            defineField({
              name: "title",
              title: "Step title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            ...nestedRichTextRowFields({
              fieldset: "contentRow",
              prefix: "content",
              blockTitle: "Step content",
              blockDescription:
                "Body copy, bullet lists, and bold text for this step.",
              required: true,
              linkColorInitialValue: "brightYellow",
              bodyColorInitialValue: "offWhite",
            }),
          ],
          preview: {
            select: { title: "title" },
            prepare({ title }) {
              return { title: title || "Step" };
            },
          },
        },
      ],
    }),
    defineField({
      name: "footerLink",
      title: "Footer link (optional)",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "label",
          title: "Link label",
          type: "string",
        }),
        defineField({
          name: "href",
          title: "Link URL",
          type: "url",
          validation: (Rule) =>
            Rule.uri({
              scheme: ["http", "https", "mailto", "tel"],
              allowRelative: true,
            }),
        }),
      ],
    }),
    sectionBackgroundField({ initialValue: "medSlate" }),
    ...blockLayoutFields({
      withAlignment: true,
      layoutWidthOverrides: {
        initialValue: "content",
        description:
          "Content width (1080px) matches other page-builder blocks. Section background still spans full width.",
      },
    }),
  ],
  preview: {
    select: { heading: "heading", steps: "steps" },
    prepare({ heading, steps }) {
      const n = steps?.length ?? 0;
      return pageBuilderBlockPreview(
        "howItWorksStepsBlock",
        heading,
        `${n} step${n === 1 ? "" : "s"}`,
      );
    },
  },
});
