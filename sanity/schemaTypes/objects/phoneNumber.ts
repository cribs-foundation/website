import { defineType, defineField } from "sanity";
import { MobileDeviceIcon } from "@sanity/icons";

export const phoneNumber = defineType({
  name: "phoneNumber",
  title: "Phone number",
  type: "object",
  icon: MobileDeviceIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "e.g. Landline, Mobile",
    }),
    defineField({
      name: "number",
      title: "Number",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "number", subtitle: "label" },
  },
});
