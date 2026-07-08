import { defineType, defineField, defineArrayMember } from "sanity";
import { CreditCardIcon } from "@sanity/icons";

// donation details singleton. bank account numbers are selectable strings.
export const donationInfo = defineType({
  name: "donationInfo",
  title: "Donation Info",
  type: "document",
  icon: CreditCardIcon,
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
    defineField({
      name: "bankAccounts",
      title: "Bank accounts",
      type: "array",
      of: [defineArrayMember({ type: "bankAccount" })],
    }),
    defineField({
      name: "qrImage",
      title: "QR code image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "qrCaption",
      title: "QR caption",
      type: "string",
    }),
    defineField({
      name: "gcashInfo",
      title: "GCash info",
      type: "text",
      rows: 3,
      description: "Optional GCash number/details",
    }),
    defineField({
      name: "taxDeductibilityNote",
      title: "Tax deductibility note",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      description: "PCNC / BIR / DSWD tax note",
    }),
    defineField({
      name: "diasporaNote",
      title: "Diaspora note",
      type: "text",
      rows: 3,
      description: "Guidance for overseas / diaspora donors",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Donation Info" };
    },
  },
});
