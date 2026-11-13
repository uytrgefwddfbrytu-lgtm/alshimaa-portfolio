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
const TRANSITION_DURATION = 0.8; // قللنا وقت الحركة شوية عشان لما تدوسي على مشروع جنب يتحرك بسرعة
const SPACING = 300;

export default function ProjectsCarousel({ projects, title }: Props) {
  if (!projects || projects.length === 0) {
    return null;
  }

  const repeatedProjects = [...projects, ...projects, ...projects, ...projects, ...projects];
  
  const [activeIndex, setActiveIndex] = useState(projects.length * 2);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  // حالة التوقف عند الهوفر
  const [isHovered, setIsHovered] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const count = repeatedProjects.length;

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    // الحركة بتقف تماماً لو: فيه مودال مفتوح، أو الماوس واقف على السيكشن
    if (selectedVideo || selectedImage || isHovered || count <= 1) return;
    
    intervalRef.current = setInterval(next, AUTO_SCROLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedVideo, selectedImage, isHovered, next, count]);

  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    if (offset > Math.floor(count / 2)) offset -= count;
    if (offset < -Math.floor(count / 2)) offset += count;
    return offset;
  };

  return (
    <>
      <section 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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

              const imageUrl = project.thumbnail ? urlFor(project.thumbnail).width(1600).quality(100).url() : null;
              
              return (
                <motion.div
                  key={`${project._id}-${index}`}
                  className="absolute w-[200px] sm:w-[240px] md:w-[260px] lg:w-[280px]"
                  animate={{
                    x: offset * SPACING, 
                    scale: isCenter ? 1 : isAdjacent ? 0.7 : 0.4,
                    opacity: isCenter ? 1 : isAdjacent ? 0.3 : 0,
                    zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                    rotateY: offset * -10,
                  }}
                  transition={{ type: "tween", duration: TRANSITION_DURATION, ease: "easeInOut" }}
                  style={{ perspective: 1200 }}
                >
                  <div 
                    // خليت كل الكروت قابلة للضغط (cursor-pointer)
                    className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A1A] shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer"
                    onClick={() => {
                      if (isCenter) {
                        // لو في النص، افتح الميديا
                        if (project.videoUrl) {
                          setSelectedVideo(project.videoUrl);
                        } else if (imageUrl) {
                          setSelectedImage(imageUrl);
                        }
                      } else {
                        // لو على الجنب، خليه هو اللي في النص
                        setActiveIndex(index);
                      }
                    }}
                  >
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
                      <div className="absolute inset-0 flex items-center justify-center z-30 group pointer-events-none">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D49A2A] text-[#2D2926] shadow-xl transition-transform group-hover:scale-110">
                          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

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

      <Modal 
        open={!!selectedVideo || !!selectedImage} 
        onClose={() => {
          setSelectedVideo(null);
          setSelectedImage(null);
        }}
      >
        {selectedVideo && (
          <video
            src={selectedVideo}
            controls
            autoPlay
            className="max-h-[85vh] w-full rounded-lg object-contain"
            style={{ backgroundColor: 'black' }}
          />
        )}
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Project Fullscreen"
            className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
          />
        )}
      </Modal>
    </>
  );
}