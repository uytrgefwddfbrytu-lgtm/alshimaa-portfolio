import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: 'e.g. ["2D ANIMATION", "EXPLAINER", "2024"]',
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 10,
    }),
    // تم نقل الحقل هنا ليكون داخل الـ fields
    defineField({
      name: "section",
      title: "Section",
      type: "string",
      description: "اختي القسم الذي سيظهر فيه المشروع",
      options: {
        list: [
          { title: "Section 1", value: "section1" },
          { title: "Section 2", value: "section2" },
        ],
      },
      initialValue: "section1",
    }),
  ],
  orderings: [
    {
      title: "Manual Order",
      name: "manualOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", media: "thumbnail", subtitle: "year" },
  },
});