import { defineType, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";

// image with required alt text for accessibility; reused in galleries and hero.
export const altImage = defineType({
  name: "altImage",
  title: "Image",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describe the image for screen readers and SEO",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { media: "asset", title: "alt" },
    prepare({ media, title }) {
      return { media, title: title || "Image" };
    },
  },
});
