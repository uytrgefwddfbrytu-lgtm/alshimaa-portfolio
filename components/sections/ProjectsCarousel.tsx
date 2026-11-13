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
  title?: string; // إضافة العنوان
}

const AUTO_SCROLL_INTERVAL = 2000; // تسريع الحركة (كانت 3500)

export default function ProjectsCarousel({ projects, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const count = projects.length;

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    if (isPaused || count <= 1) return;
    intervalRef.current = setInterval(next, AUTO_SCROLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, next, count]);

  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    if (offset > Math.floor(count / 2)) offset -= count;
    if (offset < -Math.floor(count / 2)) offset += count;
    return offset;
  };

  if (!projects || projects.length === 0) {
    return null; // لو مفيش مشاريع في القسم ده، ميظهرش حاجة
  }

  return (
    <>
      {/* تغيير الخلفية لدرجة أفتح وإضافة العنوان */}
      <section className="relative flex flex-col items-center justify-center bg-[#262422] py-20 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* العنوان الديناميكي */}
        {title && (
          <h2 className="text-center font-heading text-4xl sm:text-5xl font-bold text-[#F9F6F0] mb-16 px-6">
            {title}
          </h2>
        )}

        <div className="relative flex h-[60vh] min-h-[500px] w-full items-center justify-center">
          <div className="relative flex w-full max-w-7xl items-center justify-center">
            {projects.map((project, index) => {
              const offset = getOffset(index);
              const isCenter = offset === 0;
              const isVisible = Math.abs(offset) <= 1;

              if (!isVisible) return null;

              return (
                <motion.div
                  key={project._id}
                  className="absolute w-[280px] sm:w-[340px] md:w-[400px] lg:w-[450px]"
                  animate={{
                    x: offset * 380,
                    scale: isCenter ? 1 : 0.8,
                    opacity: isCenter ? 1 : 0.3,
                    zIndex: isCenter ? 10 : 1,
                    rotateY: offset * -10,
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  style={{ perspective: 1200 }}
                >
                  {/* الإطار الواضح */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border-[3px] border-[#F9F6F0]/50 bg-[#1A1A1A] shadow-2xl">
                    
                    {project.thumbnail ? (
                      <Image
                        src={urlFor(project.thumbnail).width(1000).url()}
                        alt={project.title}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 340px, 450px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-800">
                        <span className="text-white/20 text-6xl font-bold">{index + 1}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm uppercase tracking-widest text-[#F9F6F0]/70 font-semibold">
                        {project.tags?.join(" · ")}
                        {project.year ? ` · ${project.year}` : ""}
                      </p>
                    </div>

                    {isCenter && project.videoUrl && (
                      <button
                        onClick={() => setSelectedVideo(project.videoUrl!)}
                        className="absolute inset-0 flex items-center justify-center z-30"
                      >
                        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#D49A2A] text-[#2D2926] shadow-xl transition-transform hover:scale-110">
                          <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* أزرار التحكم */}
          <button
            onClick={() => setActiveIndex((i) => (i - 1 + count) % count)}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white backdrop-blur-md hover:bg-white/30 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white backdrop-blur-md hover:bg-white/30 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
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