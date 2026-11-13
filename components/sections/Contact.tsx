"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

interface ContactData {
  email: string;
  contactText: string;
  behanceUrl?: string;
  dribbbleUrl?: string;
  linkedinUrl?: string;
}

export default function Contact({ data }: { data: ContactData }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(data.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socials = [
    { label: "Behance", url: data.behanceUrl },
    { label: "Dribbble", url: data.dribbbleUrl },
    { label: "LinkedIn", url: data.linkedinUrl },
  ].filter((s) => s.url);

  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-24 text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-mustard" />
        <span className="text-xs font-semibold uppercase tracking-widest text-charcoal/60">
          Contact
        </span>
        <span className="h-px w-8 bg-mustard" />
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-heading text-4xl font-bold text-charcoal sm:text-5xl"
      >
        Let's make something move.
      </motion.h2>

      <p className="mx-auto mt-6 max-w-xl text-charcoal/70">
        {data.contactText}
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href={`mailto:${data.email}`}
          className="text-lg font-semibold text-teal underline-offset-4 hover:underline"
        >
          {data.email}
        </a>
        <Button variant="outline" size="sm" onClick={copyEmail}>
          {copied ? "Copied!" : "Copy Email"}
        </Button>
      </div>

      {socials.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-charcoal/20 px-5 py-2 text-sm font-medium text-charcoal transition-colors hover:border-mustard hover:text-mustard"
            >
              {s.label} ↗
            </a>
          ))}
        </div>
      )}
    </section>
  );
}