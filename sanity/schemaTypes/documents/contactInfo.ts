import { defineType, defineField, defineArrayMember } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

// contact details singleton.
export const contactInfo = defineType({
  name: "contactInfo",
  title: "Contact Info",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "orgName",
      title: "Organization name",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "phones",
      title: "Phone numbers",
      type: "array",
      of: [defineArrayMember({ type: "phoneNumber" })],
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "geo",
      title: "Map location",
      type: "geopoint",
      description: "Optional coordinates for an embedded map",
    }),
    defineField({
      name: "mapLink",
      title: "Map link",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "officeHours",
      title: "Office hours",
      type: "array",
      of: [defineArrayMember({ type: "officeHour" })],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contact Info" };
    },
  },
});
