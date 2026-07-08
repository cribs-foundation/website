import { defineType, defineField } from "sanity";
import { BlockquoteIcon } from "@sanity/icons";

// homepage testimonial/quote block.
export const quote = defineType({
  name: "quote",
  title: "Quote",
  type: "object",
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: "text",
      title: "Quote",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "attribution",
      title: "Attribution",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "altImage",
    }),
  ],
  preview: {
    select: { title: "text", subtitle: "attribution", media: "image" },
  },
});
