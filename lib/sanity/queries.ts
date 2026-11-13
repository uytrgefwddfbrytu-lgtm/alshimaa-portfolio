import { groq } from "next-sanity";

export const heroQuery = groq`*[_type == "heroSettings"][0]{
  badgeText,
  headline,
  subheadline,
  showreelVideoUrl
}`;

export const projectsQuery = groq`*[_type == "project"] | order(order asc){
  _id,
  title,
  tags,
  year,
  thumbnail,
  videoUrl,
  "order": order
}`;

export const contactQuery = groq`*[_type == "contactInfo"][0]{
  email,
  contactText,
  behanceUrl,
  dribbbleUrl,
  linkedinUrl
}`;