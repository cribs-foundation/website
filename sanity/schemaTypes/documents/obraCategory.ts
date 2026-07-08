import { defineType, defineField, defineArrayMember } from "sanity";
import { ImagesIcon } from "@sanity/icons";

// a category of "Obra Ni Ate Ko" fundraiser artworks; images only (no
// per-artwork titles/artists/prices).
export const obraCategory = defineType({
  name: "obraCategory",
  title: "Obra Category",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [defineArrayMember({ type: "altImage" })],
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
    select: { title: "name", images: "images" },
    prepare({ title, images }) {
      const count = Array.isArray(images) ? images.length : 0;
      return {
        title,
        subtitle: `${count} image${count === 1 ? "" : "s"}`,
        media: Array.isArray(images) ? images[0] : undefined,
      };
    },
  },
});
