import { defineType, defineField, defineArrayMember } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export const historyMilestone = defineType({
  name: "historyMilestone",
  title: "History Milestone",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (rule) => rule.required().min(1900).max(2100),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Falls back to year when unset",
    }),
  ],
  orderings: [
    {
      title: "Year (oldest first)",
      name: "yearAsc",
      by: [{ field: "year", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", year: "year", media: "image" },
    prepare({ title, year, media }) {
      return { title, subtitle: year ? String(year) : undefined, media };
    },
  },
});
