import { defineField, defineType } from "sanity";

export const sectionConfig = defineType({
  name: "sectionConfig",
  title: "Section Configurations",
  type: "document",
  fields: [
    defineField({
      name: "sectionKey",
      title: "Section Key",
      type: "string",
      description: "استخدمي section1 للقسم الأول، و section2 للقسم الثاني",
      options: {
        list: [
          { title: "Section 1", value: "section1" },
          { title: "Section 2", value: "section2" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      initialValue: "Selected Works",
    }),
  ],
});