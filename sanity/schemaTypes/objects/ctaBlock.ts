import { defineType, defineField } from "sanity";
import { RocketIcon } from "@sanity/icons";

// reusable call-to-action: heading, body, and a labelled button.
export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "Call to action",
  type: "object",
  icon: RocketIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "buttonLabel",
      title: "Button label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "buttonHref",
      title: "Button link",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "buttonLabel" },
  },
});
