import { defineType, defineField } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

// generic social profile; platform + url keeps the model open to new networks.
export const socialLink = defineType({
  name: "socialLink",
  title: "Social link",
  type: "object",
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Facebook", value: "facebook" },
          { title: "Instagram", value: "instagram" },
          { title: "X / Twitter", value: "twitter" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "YouTube", value: "youtube" },
          { title: "TikTok", value: "tiktok" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { title: "platform", subtitle: "url" },
  },
});
