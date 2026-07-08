import { defineType, defineField, defineArrayMember } from "sanity";
import { ImagesIcon } from "@sanity/icons";

// "Obra Ni Ate Ko" art-fundraiser landing singleton.
// artwork photos live on the `obraCategory` collection, grouped per category.
export const obraPage = defineType({
  name: "obraPage",
  title: "Obra Ni Ate Ko Page",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Obra Ni Ate Ko Page" };
    },
  },
});
