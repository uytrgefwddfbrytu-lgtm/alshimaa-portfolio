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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1C1A19]/80 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            // شيلنا max-w-5xl عشان نسمح للصورة الطولية تظهر كاملة
            className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center overflow-hidden rounded-xl bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-2 top-2 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/80 transition-colors backdrop-blur-md"
              aria-label="Close"
            >
              ✕
            </button>
            
            {/* الحاوية دي بتدي الصورة مساحة تظهر كاملة من غير قص */}
            <div className="flex h-full w-full items-center justify-center">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}