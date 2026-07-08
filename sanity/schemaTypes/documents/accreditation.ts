import { defineType, defineField } from "sanity";
import { CheckmarkCircleIcon } from "@sanity/icons";

// trust markers: DSWD license, PCNC cert, etc.
export const accreditation = defineType({
  name: "accreditation",
  title: "Accreditation",
  type: "document",
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seal",
      title: "Seal / badge",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "detail",
      title: "Detail",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "validUntil",
      title: "Valid until",
      type: "date",
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
    select: { title: "name", subtitle: "detail", media: "seal" },
  },
});
