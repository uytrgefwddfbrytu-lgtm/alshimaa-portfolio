import { groq } from "next-sanity";

export const heroQuery = groq`*[_type == "heroSettings"][0]{
  badgeText,
  headline,
  subheadline,
  showreelVideoUrl
}`;

export const sectionsQuery = groq`*[_type == "sectionConfig"] | order(order asc){
  _id,
  title
}`;

export const projectsQuery = groq`*[_type == "project"] | order(order asc){
  _id,
  title,
  tags,
  year,
  thumbnail,
  videoUrl,
  "sectionId": section._ref // بنجيب الآي دي بتاع السيكشن اللي المشروع مرتبط بيه
}`;

export const contactQuery = groq`*[_type == "contactInfo"][0]{
  email,
  contactText,
  behanceUrl,
  dribbbleUrl,
  linkedinUrl
}`;