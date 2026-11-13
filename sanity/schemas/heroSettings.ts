import { defineField, defineType } from "sanity";

export const heroSettings = defineType({
  name: "heroSettings",
  title: "Hero Settings",
  type: "document",
  fields: [
    defineField({
      name: "badgeText",
      title: "Badge Text",
      type: "string",
      initialValue: "FREELANCE MOTION DESIGNER",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      initialValue: "I Make Ideas Move.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subheadline",
      title: "Sub-headline",
      type: "text",
      rows: 2,
      initialValue:
        "Al Shimaa Marei - Motion Designer specializing in App UI Motion and 2D Animation.",
    }),
    defineField({
      name: "showreelVideoUrl",
      title: "Showreel Video URL",
      type: "string",
      description: "YouTube, Vimeo, or direct MP4 link",
    }),
  ],
});