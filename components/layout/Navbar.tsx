"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-charcoal/5 bg-cream/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-teal" />
          <span className="font-heading text-lg font-bold text-charcoal">
            Al Shimaa Marei
          </span>
        </Link>

        <ul className="flex items-center gap-6 text-sm font-medium text-charcoal/70">
          <li>
            <Link href="#work" className="hover:text-charcoal">
              Work
            </Link>
          </li>
          <li>
            <Link href="#about" className="hover:text-charcoal">
              About
            </Link>
          </li>
          <li>
            <Link href="#contact" className="hover:text-charcoal">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}