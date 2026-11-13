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
const SPACING = 280; // المسافة بين منتصف كل مشروع (تم تقليلها لتناسب العرض الأصغر)

export default function ProjectsCarousel({ projects, title }: Props) {
  // تكرار المشاريع 5 مرات لضمان وجود عناصر كافية على الجانبين
  const repeatedProjects = [...projects, ...projects, ...projects, ...projects, ...projects];
  
  // نبدأ من المنتصف (الدورة الثالثة) لضمان وجود عناصر على اليسار واليمين
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
    // إعادة التوجيه للدورة الأقرب
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
        // الارتفاع 90% من الشاشة مع ضبط الحشو الداخلي
        className="relative z-20 flex flex-col items-center justify-center h-[90vh] py-6 overflow-hidden"
        style={{
          background: "radial-gradient(circle at center, #2A2624 0%, #1C1A19 100%)"
        }}
      >
        {title && (
          // مسافة أكبر بين العنوان والكاروسيل (mb-12)
          <h2 className="text-center font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#F4EFE6] mb-12 px-6">
            {title}
          </h2>
        )}

        {/* حاوية الكاروسيل تأخذ المساحة المتبقية */}
        <div className="relative flex flex-1 w-full items-center justify-center">
          <div className="relative flex w-full max-w-7xl items-center justify-center">
            {repeatedProjects.map((project, index) => {
              const offset = getOffset(index);
              const isCenter = offset === 0;
              // نعرض 5 عناصر فقط (من -2 إلى 2) لضمان الأداء
              const isVisible = Math.abs(offset) <= 2;

              // حساب الشفافية والحجم بناءً على المسافة
              const scale = isCenter ? 1 : Math.abs(offset) === 1 ? 0.65 : 0.4;
              const opacity = isCenter ? 1 : Math.abs(offset) === 1 ? 0.35 : 0;
              const zIndex = isCenter ? 10 : Math.abs(offset) === 1 ? 5 : 1;

              return (
                <motion.div
                  key={`${project._id}-${index}`}
                  // عرض أصغر للمشاريع (w-[200px] للشاشات الصغيرة، وحتى w-[280px] للكبيرة)
                  className="absolute w-[200px] sm:w-[240px] md:w-[260px] lg:w-[280px]"
                  animate={{
                    x: offset * SPACING,
                    scale,
                    opacity,
                    zIndex,
                    // دوران خفيف جداً للعناصر الجانبية
                    rotateY: offset * -5,
                  }}
                  // حركة انسيابية بدون ارتداد (tween)
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
                        sizes="(max-width: 768px) 240px, 280px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-800">
                        <span className="text-white/20 text-6xl font-bold">
                          {String((index % projects.length) + 1).padStart(2, '0')}
                        </span>
                      </div>
                    )}

                    {/* تدرج لضمان وضوح النص */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <h3 className="font-heading text-lg sm:text-xl font-bold text-white mb-1 leading-tight">
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
            aria-label="Previous project"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/5 p-4 text-white backdrop-blur-md hover:bg-white/15 transition-all"
            aria-label="Next project"
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