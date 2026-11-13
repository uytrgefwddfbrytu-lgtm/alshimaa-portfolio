import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import ProjectsCarousel from "@/components/sections/ProjectsCarousel";
import Contact from "@/components/sections/Contact";
import { client } from "@/lib/sanity/client";
import { heroQuery, projectsQuery, contactQuery } from "@/lib/sanity/queries";

// export const revalidate = 60;
 export const revalidate = 0;
export default async function Home() {
  const [heroData, projects, contactData] = await Promise.all([
    client.fetch(heroQuery),
    client.fetch(projectsQuery),
    client.fetch(contactQuery),
  ]);

  // بيانات مؤقتة (تظهر فقط لو قاعدة البيانات فاضية)
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
    <main className="relative">
      <Navbar />
      {/* بنبعت البيانات الحقيقية، ولو مفيش بنبعت الـ fallback */}
      <Hero data={heroData || fallbackHero} />
      <section id="work">
        <ProjectsCarousel projects={projects || []} />
      </section>
      <Contact data={contactData || fallbackContact} />
    </main>
  );
}