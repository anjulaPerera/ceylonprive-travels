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
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const heroElement = document.getElementById("hero");
    if (!heroElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      {
        // Triggers the glass transformation exactly 80px before the hero section leaves the top bounds
        rootMargin: "-80px 0px 0px 0px",
        threshold: 0,
      },
    );

    observer.observe(heroElement);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        isHeroVisible ? "bg-transparent py-6" : "glass-luxury py-3.5 shadow-lg",
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Name / Logo */}
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-serif text-2xl font-light tracking-[0.15em] text-gradient-gold">
            CeylonPrivé
          </span>
          <span
            className={cn(
              "text-[10px] tracking-[0.4em] uppercase font-sans font-light transition-colors duration-500",
              isHeroVisible
                ? "!text-cream-dark"
                : "text-navy/60 dark:text-cream-dark/60",
            )}
          >
            Travels
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={cn(
                  "text-sm tracking-widest uppercase font-sans font-light transition-colors duration-500 hover:text-gold dark:hover:text-gold",
                  isHeroVisible
                    ? "!text-cream-dark"
                    : "text-navy dark:text-cream-dark",
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA & Toggle Utilities */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <a
            href="#contact"
            className={cn(
              "px-6 py-2.5 border text-sm tracking-widest uppercase font-sans font-light transition-all duration-500",
              isHeroVisible
                ? "border-gold text-gold hover:bg-gold hover:text-navy"
                : "border-gold text-gold hover:bg-gold dark:hover:text-navy max-light:hover:text-white",
            )}
          >
            Book Private Tour
          </a>
        </div>

        {/* Mobile Menu Action Icon */}
        <button
          className={cn(
            "md:hidden transition-colors duration-500",
            isHeroVisible ? "!text-cream" : "text-navy dark:text-cream",
          )}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer Menu Layer */}
      {isMobileOpen && (
        <div className="md:hidden glass-luxury border-t border-gold/10 px-6 py-6 base-transition">
          <ul className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={cn(
                    "text-sm tracking-widest uppercase font-sans transition-colors",
                    isHeroVisible
                      ? "!text-cream-dark hover:text-gold"
                      : "text-navy dark:text-cream-dark hover:text-gold",
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="flex items-center justify-between border-t border-gold/10 pt-4">
              <span
                className={cn(
                  "text-xs tracking-widest uppercase font-sans",
                  isHeroVisible
                    ? "!text-cream-dark/60"
                    : "text-navy/60 dark:text-cream-dark/60",
                )}
              >
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
