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

const AUTO_SCROLL_INTERVAL = 3000; // وقت الانتظار قبل الحركة (3 ثواني)
const TRANSITION_DURATION = 1.0; // وقت الحركة نفسها (ثانية واحدة)
const SPACING = 300; // المسافة بين منتصف كل مشروع

export default function ProjectsCarousel({ projects, title }: Props) {
  // لو مفيش مشاريع، الكومبوننت مش هيظهر
  if (!projects || projects.length === 0) {
    return null;
  }

  // تكرار المشاريع 5 مرات عشان نضمن وجود عناصر كافية على الجانبين
  // لو المشاريع قليلة، التكرار ده بيخلي الشريط طويل ومفيش تقطيع
  const repeatedProjects = [...projects, ...projects, ...projects, ...projects, ...projects];
  
  // نبدأ من النص (الدورة التالتة)
  const [activeIndex, setActiveIndex] = useState(projects.length * 2);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const count = repeatedProjects.length;

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

  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    // لفة لا نهائية
    if (offset > Math.floor(count / 2)) offset -= count;
    if (offset < -Math.floor(count / 2)) offset += count;
    return offset;
  };

  return (
    <>
      <section 
        className="relative z-20 flex flex-col items-center justify-center h-[90vh] py-8 overflow-hidden"
        style={{
          background: "radial-gradient(circle at center, #2A2624 0%, #1C1A19 100%)"
        }}
      >
        {title && (
          <h2 className="text-center font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4EFE6] mb-16 px-6">
            {title}
          </h2>
        )}

        <div className="relative flex h-[60vh] w-full items-center justify-center">
          <div className="relative flex w-full max-w-7xl items-center justify-center">
            {repeatedProjects.map((project, index) => {
              const offset = getOffset(index);
              
              const isCenter = offset === 0;
              const isAdjacent = Math.abs(offset) === 1;
              
              return (
                <motion.div
                  key={`${project._id}-${index}`}
                  // عرض أصغر عشان يبان عمق الحركة
                  className="absolute w-[200px] sm:w-[240px] md:w-[260px] lg:w-[280px]"
                  animate={{
                    x: offset * SPACING, 
                    // الحجم: النص 1، اللي جنبه 0.7، البعيد جداً بيصغر لـ 0.4
                    scale: isCenter ? 1 : isAdjacent ? 0.7 : 0.4,
                    // الشفافية: النص 1، اللي جنبه 0.3، البعيد جداً 0 (عشان يختفي بنعومة)
                    opacity: isCenter ? 1 : isAdjacent ? 0.3 : 0,
                    // الترتيب
                    zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                    // دوران خفيف
                    rotateY: offset * -10,
                  }}
                  transition={{ type: "tween", duration: TRANSITION_DURATION, ease: "easeInOut" }}
                  style={{ perspective: 1200 }}
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A1A] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    
                    {project.thumbnail ? (
                      <Image
                        src={urlFor(project.thumbnail).width(1000).url()}
                        alt={project.title}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 240px, 280px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-800">
                        <span className="text-white/20 text-6xl font-bold">
                          {String((index % projects.length) + 1).padStart(2, '0')}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <h3 className="font-heading text-lg sm:text-xl font-bold text-white mb-1 leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-[10px] uppercase tracking-widest text-[#F4EFE6]/60 font-semibold">
                        {project.tags?.join(" · ")}
                        {project.year ? ` · ${project.year}` : ""}
                      </p>
                    </div>

                    {isCenter && project.videoUrl && (
                      <button
                        onClick={() => setSelectedVideo(project.videoUrl!)}
                        className="absolute inset-0 flex items-center justify-center z-30 group"
                      >
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D49A2A] text-[#2D2926] shadow-xl transition-transform group-hover:scale-110">
                          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
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
            className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/5 p-4 text-white backdrop-blur-md hover:bg-white/15 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/5 p-4 text-white backdrop-blur-md hover:bg-white/15 transition-all"
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