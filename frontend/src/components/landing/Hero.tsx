"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-[#0A0F1E]"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[10000ms]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070')`,
        }}
      />

      {/* Cinematic Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1E]/80 via-[#0A0F1E]/40 to-[#0A0F1E]/90" />

      {/* Luxury Grain Texture */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Eyebrow Label */}
        <div
          className={cn(
            "transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="inline-block text-[11px] tracking-[0.5em] uppercase text-gold font-sans font-light mb-8">
            ✦ Private Luxury Tours · Sri Lanka ✦
          </span>
        </div>

        {/* Main Headline - Enforced Cream Color */}
        <h1
          className={cn(
            "font-serif font-light !text-cream mb-6 transition-all duration-1000 delay-200",
            "text-5xl md:text-7xl lg:text-8xl leading-tight",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          Discover Ceylon
          <br />
          <span className="text-gradient-gold italic">Like Never Before</span>
        </h1>

        {/* Decorative Divider */}
        <div
          className={cn(
            "flex items-center justify-center gap-4 mb-8 transition-all duration-1000 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <div className="h-px w-16 bg-gold/60" />
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-sans">
            Est. 2015
          </span>
          <div className="h-px w-16 bg-gold/60" />
        </div>

        {/* Subheading Description - Enforced Light Text */}
        <p
          className={cn(
            "font-sans font-light !text-cream-dark text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          Immerse yourself in Sri Lanka&apos;s ancient temples, pristine shores,
          and untamed wilderness — guided by an expert who calls this paradise
          home.
        </p>

        {/* CTA Actions */}
        <div
          className={cn(
            "flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <a
            href="#contact"
            className="px-10 py-4 bg-gold !text-navy text-sm tracking-[0.2em] uppercase font-sans font-medium hover:bg-gold-light transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
          >
            Plan Your Journey
          </a>

          <a
            href="#ai-planner"
            className="px-10 py-4 border border-gold/60 !text-cream text-sm tracking-[0.2em] uppercase font-sans font-light hover:border-gold hover:text-gold transition-all duration-300"
          >
            AI Itinerary Planner
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-1000",
          isVisible ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="text-[10px] tracking-[0.4em] uppercase !text-cream-dark/60 font-sans">
          Scroll
        </span>
        <ChevronDown size={16} className="text-gold animate-bounce" />
      </div>
    </section>
  );
}
