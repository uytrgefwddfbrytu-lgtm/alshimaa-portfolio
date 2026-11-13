"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import Modal from "@/components/ui/Modal";

type Project = {
  _id: string;
  title: string;
  tags: string[];
  year?: string;
  thumbnail?: any;
  videoUrl?: string;
};

interface Props {
  projects: Project[];
  title?: string;
}

const AUTO_SCROLL_INTERVAL = 3000;

export default function ProjectsCarousel({ projects, title }: Props) {
  // لو مفيش مشاريع متسجلة
  if (!projects || projects.length === 0) {
    return null;
  }

  // 1. نكرر المشاريع 3 مرات عشان نعمل شريط طويل (Infinite Loop)
  const displayProjects = [...projects, ...projects, ...projects];
  
  // 2. نبدأ من النص بالظبط
  const [activeIndex, setActiveIndex] = useState(projects.length);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const count = displayProjects.length;

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    if (selectedVideo || count <= 1) return;
    
    intervalRef.current = setInterval(next, AUTO_SCROLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedVideo, next, count]);

  // 3. حساب المسافة بين العناصر عشان تلف في دايرة
  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    if (offset > Math.floor(count / 2)) offset -= count;
    if (offset < -Math.floor(count / 2)) offset += count;
    return offset;
  };

  return (
    <>
      <section 
        // السيكشن بياخد 90% من طول الشاشة
        className="relative z-20 flex flex-col items-center justify-center h-[90vh] py-8 overflow-hidden"
        style={{
          background: "radial-gradient(circle at center, #2A2624 0%, #1C1A19 100%)"
        }}
      >
        {title && (
          <h2 className="text-center font-heading text-4xl sm:text-5xl font-bold text-[#F4EFE6] mb-10 px-6">
            {title}
          </h2>
        )}

        <div className="relative flex h-[65vh] w-full items-center justify-center">
          <div className="relative flex w-full max-w-7xl items-center justify-center">
            {displayProjects.map((project, index) => {
              const offset = getOffset(index);
              const isCenter = offset === 0;
              // بنعرض 5 عناصر بس عشان الأداء والانسيابية
              const isVisible = Math.abs(offset) <= 2; 

              if (!isVisible) return null;

              return (
                <motion.div
                  // ضفنا index للـ key عشان نمنع مشاكل التكرار
                  key={`${project._id}-${index}`}
                  className="absolute w-[240px] sm:w-[280px] md:w-[320px] lg:w-[340px]"
                  animate={{
                    x: offset * 340, 
                    scale: isCenter ? 1 : Math.abs(offset) === 1 ? 0.65 : 0.4,
                    opacity: isCenter ? 1 : Math.abs(offset) === 1 ? 0.35 : 0,
                    zIndex: isCenter ? 10 : Math.abs(offset) === 1 ? 5 : 1,
                    rotateY: offset * -8, 
                  }}
                  // سرعة الحركة والانسيابية
                  transition={{ type: "tween", duration: 0.8, ease: "easeInOut" }}
                  style={{ perspective: 1200 }}
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A1A] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    
                    {project.thumbnail ? (
                      <Image
                        src={urlFor(project.thumbnail).width(1000).url()}
                        alt={project.title}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 280px, 340px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-800">
                        <span className="text-white/20 text-6xl font-bold">0{(index % projects.length) + 1}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-1 leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#F4EFE6]/60 font-semibold">
                        {project.tags?.join(" · ")}
                        {project.year ? ` · ${project.year}` : ""}
                      </p>
                    </div>

                    {isCenter && project.videoUrl && (
                      <button
                        onClick={() => setSelectedVideo(project.videoUrl!)}
                        className="absolute inset-0 flex items-center justify-center z-30 group"
                      >
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D49A2A] text-[#2D2926] shadow-xl transition-transform group-hover:scale-110">
                          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveIndex((i) => (i - 1 + count) % count)}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/5 p-4 text-white backdrop-blur-md hover:bg-white/15 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/5 p-4 text-white backdrop-blur-md hover:bg-white/15 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </section>

      <Modal open={!!selectedVideo} onClose={() => setSelectedVideo(null)}>
        {selectedVideo && (
          <video
            src={selectedVideo}
            controls
            autoPlay
            className="h-full w-full rounded-lg object-contain"
            style={{ backgroundColor: 'black' }}
          />
        )}
      </Modal>
    </>
  );
}