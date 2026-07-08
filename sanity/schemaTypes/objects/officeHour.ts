import { defineType, defineField } from "sanity";
import { ClockIcon } from "@sanity/icons";

export const officeHour = defineType({
  name: "officeHour",
  title: "Office hours",
  type: "object",
  icon: ClockIcon,
  fields: [
    defineField({
      name: "day",
      title: "Day",
      type: "string",
      options: {
        list: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "closed",
      title: "Closed all day",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "opens",
      title: "Opens",
      type: "string",
      description: "24h time, e.g. 09:00",
      hidden: ({ parent }) => parent?.closed === true,
    }),
    defineField({
      name: "closes",
      title: "Closes",
      type: "string",
      description: "24h time, e.g. 17:00",
      hidden: ({ parent }) => parent?.closed === true,
    }),
  ],
  preview: {
    select: {
      day: "day",
      opens: "opens",
      closes: "closes",
      closed: "closed",
    },
    prepare({ day, opens, closes, closed }) {
      return {
        title: day,
        subtitle: closed ? "Closed" : `${opens ?? "?"} – ${closes ?? "?"}`,
      };
    },
  },
});
