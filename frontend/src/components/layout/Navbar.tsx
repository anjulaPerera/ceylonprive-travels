"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Gallery", href: "#gallery" },
  { label: "AI Planner", href: "#ai-planner" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Listen for scroll events — switch from transparent to glass
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "glass py-3 shadow-lg shadow-black/20"
          : "bg-transparent py-6",
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Name */}
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-serif text-2xl font-light tracking-[0.15em] text-gradient-gold">
            CeylonPrivé
          </span>
          <span className="text-[10px] tracking-[0.4em] text-cream-dark uppercase font-sans font-light">
            Travels
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm tracking-widest uppercase font-sans font-light text-cream-dark hover:text-gold transition-colors duration-300"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <a
            href="#contact"
            className="px-6 py-2.5 border border-gold text-gold text-sm tracking-widest uppercase font-sans font-light hover:bg-gold hover:text-navy transition-all duration-300"
          >
            Book Private Tour
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-cream"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden glass border-t border-gold/10 px-6 py-6">
          <ul className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm tracking-widest uppercase text-cream-dark hover:text-gold transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="flex items-center justify-between">
              <span className="text-xs tracking-widest uppercase text-cream-dark/60 font-sans">
                Theme
              </span>
              <ThemeToggle />
            </li>
            <li>
              <a
                href="#contact"
                className="block text-center px-6 py-3 border border-gold text-gold text-sm tracking-widest uppercase hover:bg-gold hover:text-navy transition-all duration-300"
                onClick={() => setIsMobileOpen(false)}
              >
                Book Private Tour
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
