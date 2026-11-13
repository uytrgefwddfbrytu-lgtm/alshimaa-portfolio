"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

interface HeroData {
  badgeText: string;
  headline: string;
  subheadline: string;
  showreelVideoUrl?: string;
}

export default function Hero({ data }: { data: HeroData }) {
  const [open, setOpen] = useState(false);

const headlineText = data?.headline || "I Make Ideas Move.";
const headlineParts = headlineText.split(" ");
const lastWord = headlineParts.pop();
const rest = headlineParts.join(" ");

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Badge text={data.badgeText} />

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-8 max-w-4xl font-heading text-5xl font-bold leading-tight tracking-tight text-charcoal sm:text-6xl md:text-7xl lg:text-8xl"
      >
        {rest}{" "}
        <span className="text-mustard">{lastWord}</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-6 max-w-xl text-base text-charcoal/70 sm:text-lg"
      >
        {data.subheadline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="mt-10"
      >
        <Button
          variant="primary"
          size="lg"
          onClick={() => setOpen(true)}
          aria-label="Watch showreel"
        >
          <span className="mr-2 text-xl">▶</span> Watch Showreel
        </Button>
      </motion.div>

      <Modal open={open} onClose={() => setOpen(false)}>
        {data.showreelVideoUrl ? (
          // <video
          //   src={data.showreelVideoUrl}
          //   controls
          //   autoPlay
          //   className="h-full w-full rounded-lg"
          // />
          <video
            src={data.showreelVideoUrl}
            controls
            autoPlay
            className="h-full w-full rounded-lg object-cover"
            playsInline
            style={{ backgroundColor: 'black' }}
          />
        ) : (
          <p className="text-center text-white">Showreel coming soon.</p>
        )}
      </Modal>
    </section>
  );
}