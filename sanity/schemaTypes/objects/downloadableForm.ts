import { defineType, defineField } from "sanity";
import { DocumentPdfIcon } from "@sanity/icons";

// a labelled downloadable file (program guidelines, application forms, etc.).
export const downloadableForm = defineType({
  name: "downloadableForm",
  title: "Downloadable form",
  type: "object",
  icon: DocumentPdfIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "file",
      title: "File",
      type: "file",
    }),
  ],
  preview: {
    select: { title: "label" },
  },
});
