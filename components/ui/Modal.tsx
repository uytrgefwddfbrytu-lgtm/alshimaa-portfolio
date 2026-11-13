"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // هنا التعديل: شفافية 60% للون الغامق + تغبيش قوي للخلفية
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1C1A19]/60 p-4 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-[#1A1A1A] shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()} // عشان لما تدوسي جوه الفيديو ميقفلش
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="aspect-video w-full">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}