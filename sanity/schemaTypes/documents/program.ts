import { defineType, defineField, defineArrayMember } from "sanity";
import { HeartIcon } from "@sanity/icons";

export const program = defineType({
  name: "program",
  title: "Program",
  type: "document",
  icon: HeartIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Residential", value: "residential" },
          { title: "Support", value: "support" },
          { title: "Advocacy", value: "advocacy" },
          { title: "Placement", value: "placement" },
          { title: "Aftercare", value: "aftercare" },
          { title: "Volunteer", value: "volunteer" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "ageRange",
      title: "Age range",
      type: "string",
      description: "e.g. 0–4, 7–17",
    }),
    defineField({
      name: "capacity",
      title: "Capacity",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "downloadableForms",
      title: "Downloadable forms",
      type: "array",
      of: [defineArrayMember({ type: "downloadableForm" })],
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
    select: { title: "title", subtitle: "category", media: "image" },
  },
});
