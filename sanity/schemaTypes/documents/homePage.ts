import { defineType, defineField, defineArrayMember } from "sanity";
import { HomeIcon } from "@sanity/icons";

// homepage singleton. every heading and body is an editable field.
export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "mission", title: "Mission & Vision" },
    { name: "quotes", title: "Quotes" },
    { name: "cta", title: "Help CTA" },
  ],
  fields: [
    defineField({
      name: "heroVideoUrl",
      title: "Hero video URL",
      type: "url",
      group: "hero",
      description: "Vimeo URL for the hero background video",
      validation: (rule) =>
        rule.uri({ scheme: ["http", "https"] }).warning("Should be a valid URL"),
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero headline",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubtext",
      title: "Hero subtext",
      type: "text",
      rows: 4,
      group: "hero",
    }),
    defineField({
      name: "heroImages",
      title: "Hero images",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "altImage" })],
    }),
    defineField({
      name: "missionHeading",
      title: "Mission heading",
      type: "string",
      group: "mission",
    }),
    defineField({
      name: "missionBody",
      title: "Mission body",
      type: "array",
      group: "mission",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "visionHeading",
      title: "Vision heading",
      type: "string",
      group: "mission",
    }),
    defineField({
      name: "visionBody",
      title: "Vision body",
      type: "array",
      group: "mission",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "quotes",
      title: "Quotes",
      type: "array",
      group: "quotes",
      of: [defineArrayMember({ type: "quote" })],
    }),
    defineField({
      name: "helpCta",
      title: "Help CTA",
      type: "ctaBlock",
      group: "cta",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
