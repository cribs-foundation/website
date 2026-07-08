import { defineType, defineField } from "sanity";
import { TrendUpwardIcon } from "@sanity/icons";

export const impactStat = defineType({
  name: "impactStat",
  title: "Impact Stat",
  type: "document",
  icon: TrendUpwardIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "suffix",
      title: "Suffix",
      type: "string",
      description: 'e.g. "children", "girls", "years"',
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { label: "label", value: "value", suffix: "suffix" },
    prepare({ label, value, suffix }) {
      return {
        title: `${value ?? ""} ${suffix ?? ""}`.trim(),
        subtitle: label,
      };
    },
  },
});
