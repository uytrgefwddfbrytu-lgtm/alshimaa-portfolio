import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import ProjectsCarousel from "@/components/sections/ProjectsCarousel";
import Contact from "@/components/sections/Contact";
import { client } from "@/lib/sanity/client";
import { heroQuery, projectsQuery, contactQuery, sectionsQuery } from "@/lib/sanity/queries";

export const revalidate = 0;

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

  return (
    <main className="relative bg-[#F9F6F0]">
      <Navbar />
      <Hero data={heroData || fallbackHero} />
      
      {sections?.map((section: any) => {
        const sectionProjects = projects?.filter((p: any) => p.sectionId === section._id) || [];
        if (sectionProjects.length === 0) return null;

        return (
          <div key={section._id}>
            <section id={`section-${section._id}`}>
              <ProjectsCarousel projects={sectionProjects} title={section.title} />
            </section>
            {/* الفاصل بلون الصفحة (حوالي 5 سنتي) */}
            <div className="h-[180px] w-full bg-[#F9F6F0]" />
          </div>
        );
      })}

      <Contact data={contactData || fallbackContact} />
    </main>
  );
}