import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import ProjectsCarousel from "@/components/sections/ProjectsCarousel";
import Contact from "@/components/sections/Contact";
import { client } from "@/lib/sanity/client";
import { heroQuery, projectsQuery, contactQuery } from "@/lib/sanity/queries";
import { groq } from "next-sanity";

export const revalidate = 0; // تحديث فوري

// استعلام لجلب إعدادات السيكشن
const sectionsQuery = groq`*[_type == "sectionConfig"] { sectionKey, title }`;

export default async function Home() {
  const [heroData, projects, contactData, sections] = await Promise.all([
    client.fetch(heroQuery),
    client.fetch(projectsQuery),
    client.fetch(contactQuery),
    client.fetch(sectionsQuery),
  ]);

  const fallbackHero = {
    badgeText: "FREELANCE MOTION DESIGNER",
    headline: "I Make Ideas Move.",
    subheadline: "Al Shimaa Marei - Motion Designer specializing in App UI Motion and 2D Animation.",
    showreelVideoUrl: ""
  };

  const fallbackContact = {
    email: "hello@alshimaa.com",
    contactText: "Have an app, a launch or a story that needs motion? Send a short note and I'll reply within two business days.",
    behanceUrl: "#", dribbbleUrl: "#", linkedinUrl: "#"
  };

  // فصل المشاريع حسب السيكشن
  const section1Projects = projects?.filter((p: any) => p.section === "section1") || [];
  const section2Projects = projects?.filter((p: any) => p.section === "section2") || [];

  // جلب عناوين السيكشن
  const sec1Title = sections?.find((s: any) => s.sectionKey === "section1")?.title || "Selected Works";
  const sec2Title = sections?.find((s: any) => s.sectionKey === "section2")?.title || "More Projects";

  return (
    <main className="relative bg-[#F9F6F0]">
      <Navbar />
      <Hero data={heroData || fallbackHero} />
      
      {/* السيكشن الأول */}
      <section id="work">
        <ProjectsCarousel projects={section1Projects} title={sec1Title} />
      </section>

      {/* السيكشن الثاني */}
      <section id="more-work">
        <ProjectsCarousel projects={section2Projects} title={sec2Title} />
      </section>

      <Contact data={contactData || fallbackContact} />
    </main>
  );
}