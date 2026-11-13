import { defineField, defineType } from "sanity";

export const sectionConfig = defineType({
  name: "sectionConfig",
  title: "Sections Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      description: "اكتبي اسم السيكشن (مثلاً: Selected Works, 2D Animation, etc.)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "رقم الترتيب (1 يظهر أولاً، ثم 2، إلخ)",
      initialValue: 1,
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "order" },
  },
});