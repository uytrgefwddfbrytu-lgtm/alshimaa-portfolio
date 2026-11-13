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