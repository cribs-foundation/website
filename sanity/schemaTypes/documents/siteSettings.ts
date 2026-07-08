import { defineType, defineField, defineArrayMember } from "sanity";
import { CogIcon } from "@sanity/icons";

// site-wide settings singleton. everything visible in the chrome (org name,
// nav labels, socials, footer) is editable here.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "navigation", title: "Navigation" },
    { name: "social", title: "Social & Newsletter" },
    { name: "seo", title: "SEO Defaults" },
  ],
  fields: [
    defineField({
      name: "orgName",
      title: "Organization name",
      type: "string",
      group: "general",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "general",
      options: { hotspot: true },
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "text",
      rows: 4,
      group: "general",
      description: "The DSWD one-liner shown across the site",
    }),
    defineField({
      name: "primaryNav",
      title: "Primary navigation",
      type: "array",
      group: "navigation",
      of: [defineArrayMember({ type: "navItem" })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      group: "social",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
    defineField({
      name: "newsletterHeading",
      title: "Newsletter heading",
      type: "string",
      group: "social",
    }),
    defineField({
      name: "footerCopyright",
      title: "Footer copyright text",
      type: "string",
      group: "general",
    }),
    defineField({
      name: "seo",
      title: "SEO defaults",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
