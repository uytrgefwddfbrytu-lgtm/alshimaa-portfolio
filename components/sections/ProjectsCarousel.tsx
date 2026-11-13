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

const AUTO_SCROLL_INTERVAL = 4500;
const TRANSITION_DURATION = 0.8;
const SPACING = 300;

export default function ProjectsCarousel({ projects, title }: Props) {
  if (!projects || projects.length === 0) {
    return null;
  }

  const repeatedProjects = [...projects, ...projects, ...projects, ...projects, ...projects];
  
  const [activeIndex, setActiveIndex] = useState(projects.length * 2);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  const [isHovered, setIsHovered] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const count = repeatedProjects.length;

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    if (isHovered || selectedVideo || selectedImage || count <= 1) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    
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
          background: "radial-gradient(circle at center, #111111 0%, #000000 100%)"
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
                    // 👈 هنا التعديل: غيرنا الشفافية من 0.3 لـ 0.8
                    opacity: isCenter ? 1 : isAdjacent ? 0.8 : 0,
                    zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                    rotateY: offset * -10,
                  }}
                  transition={{ type: "tween", duration: TRANSITION_DURATION, ease: "easeInOut" }}
                  style={{ perspective: 1200 }}
                >
                  {/* الغلاف الملون + الظل الأصفر */}
                  <div 
                    className="rounded-[20px] p-[3px] shadow-[0_25px_50px_rgba(212,154,42,0.35)] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(212,154,42,0.5)]"
                    style={{
                      background: "conic-gradient(from 90deg, #2D2926 0%, #F9F6F0 33%, #288B8B 66%, #2D2926 100%)"
                    }}
                  >
                    <div 
                      className="relative aspect-[4/5] w-full overflow-hidden rounded-[17px] bg-[#1A1A1A] cursor-pointer"
                      onClick={() => {
                        if (isCenter) {
                          if (project.videoUrl) {
                            setSelectedVideo(project.videoUrl);
                          } else if (imageUrl) {
                            setSelectedImage(imageUrl);
                          }
                        } else {
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
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D49A2A] text-[#2D2926] shadow-[0_0_25px_rgba(212,154,42,0.8)] transition-transform group-hover:scale-110">
                            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          </span>
                        </div>
                      )}
                    </div>
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