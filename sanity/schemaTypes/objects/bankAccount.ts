import { defineType, defineField } from "sanity";
import { CreditCardIcon } from "@sanity/icons";

// a donatable bank account. accountNumber is a plain string on purpose —
// donors must be able to select/copy the real digits.
export const bankAccount = defineType({
  name: "bankAccount",
  title: "Bank account",
  type: "object",
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: "bankName",
      title: "Bank name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      options: {
        list: [
          { title: "PHP", value: "PHP" },
          { title: "USD", value: "USD" },
          { title: "EUR", value: "EUR" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "accountName",
      title: "Account name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "accountNumber",
      title: "Account number",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "swift",
      title: "SWIFT / BIC",
      type: "string",
    }),
  ],
  preview: {
    select: {
      bankName: "bankName",
      currency: "currency",
      accountNumber: "accountNumber",
    },
    prepare({ bankName, currency, accountNumber }) {
      return {
        title: `${bankName} (${currency})`,
        subtitle: accountNumber,
      };
    },
  },
});
