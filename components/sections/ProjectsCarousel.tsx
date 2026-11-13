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

const AUTO_SCROLL_INTERVAL = 3500; // وقت الانتظار بين كل حركة (3.5 ثانية)
const TRANSITION_DURATION = 1.2; // وقت الحركة نفسها (1.2 ثانية) عشان تبان بوضوح
const SPACING = 320; // المسافة بين منتصف كل مشروع

export default function ProjectsCarousel({ projects, title }: Props) {
  // تكرار المشاريع 7 مرات عشان نضمن وجود عناصر كافية على الجانبين بدون تقطيع
  const extendedProjects = [
    ...projects, ...projects, ...projects, ...projects, 
    ...projects, ...projects, ...projects
  ];
  
  // نبدأ من النص (الدورة الرابعة)
  const [activeIndex, setActiveIndex] = useState(projects.length * 3);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const count = extendedProjects.length;

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
    if (offset > Math.floor(count / 2)) offset -= count;
    if (offset < -Math.floor(count / 2)) offset += count;
    return offset;
  };

  if (!projects || projects.length === 0) {
    return null;
  }

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
          // مسافة واضحة بين العنوان والمشاريع (mb-16)
          <h2 className="text-center font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4EFE6] mb-16 px-6">
            {title}
          </h2>
        )}

        {/* حاوية المشاريع */}
        <div className="relative flex h-[60vh] w-full items-center justify-center">
          <div className="relative flex w-full max-w-7xl items-center justify-center">
            {extendedProjects.map((project, index) => {
              const offset = getOffset(index);
              
              // 1. العنصر في النص (Center)
              const isCenter = offset === 0;
              // 2. العنصر اللي جنبه يمين أو شمال (Adjacent)
              const isAdjacent = Math.abs(offset) === 1;
              // 3. العنصر الأبعد (Hidden/Fading out)
              const isFar = Math.abs(offset) === 2;

              // مش بنخفي العنصر بـ return null عشان مفيش نطة، بس بنخلي شفافيته 0
              // بنعرض 5 عناصر بس لتحسين الأداء
              if (Math.abs(offset) > 2) return null;

              return (
                <motion.div
                  key={`${project._id}-${index}`}
                  // تصغير مساحة العرض (w-[200px] لحد w-[280px])
                  className="absolute w-[200px] sm:w-[240px] md:w-[260px] lg:w-[280px]"
                  animate={{
                    x: offset * SPACING, 
                    // الحجم: النص كبير، اللي جنبه أصغر، واللي بيختفي أصغر بكتير
                    scale: isCenter ? 1 : isAdjacent ? 0.75 : 0.5,
                    // الشفافية: النص كامل، اللي جنبه خفيف، واللي في الآخر بيختفي
                    opacity: isCenter ? 1 : isAdjacent ? 0.4 : 0,
                    zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                    // ميلان خفيف جداً للعناصر الجانبية
                    rotateY: offset * -5,
                  }}
                  // زمن الحركة 1.2 ثانية مع نعومة في البداية والنهاية
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

                    {/* تدرج عشان النص يبان */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 right-0 p-5">
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