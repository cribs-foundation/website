import { defineType, defineField } from "sanity";
import { LinkIcon } from "@sanity/icons";

// a single primary-nav entry; label and href are both editable.
export const navItem = defineType({
  name: "navItem",
  title: "Navigation item",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description: "Relative path (e.g. /about) or full URL",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
