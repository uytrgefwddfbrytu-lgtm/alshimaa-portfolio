import { defineField, defineType } from "sanity";

export const contactInfo = defineType({
  name: "contactInfo",
  title: "Contact Info",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      initialValue: "hello@alshimaa.com",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "contactText",
      title: "Contact Paragraph",
      type: "text",
      rows: 3,
      initialValue:
        "Have an app, a launch or a story that needs motion? Send a short note and I'll reply within two business days.",
    }),
    defineField({
      name: "behanceUrl",
      title: "Behance URL",
      type: "url",
    }),
    defineField({
      name: "dribbbleUrl",
      title: "Dribbble URL",
      type: "url",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
  ],
});