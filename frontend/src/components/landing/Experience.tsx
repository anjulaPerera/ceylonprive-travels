"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const stats = [
  {
    number: "10+",
    label: "Years of Expertise",
    description: "A decade guiding discerning travelers",
  },
  {
    number: "500+",
    label: "Private Tours",
    description: "Bespoke itineraries crafted with care",
  },
  {
    number: "98%",
    label: "5-Star Reviews",
    description: "Excellence in every experience",
  },
];

export default function Experience() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer — triggers animation when section enters viewport
  // This is more performant than listening to scroll events
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      { threshold: 0.2 }, // Trigger when 20% of section is visible
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-28 bg-navy-light">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={cn(
            "text-center mb-20 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-[11px] tracking-[0.5em] uppercase text-gold font-sans font-light">
            The CeylonPrivé Difference
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-cream mt-4 mb-6 font-light">
            Sri Lanka, Revealed
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gold/40" />
            <div className="w-1.5 h-1.5 bg-gold rotate-45" />
            <div className="h-px w-16 bg-gold/40" />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left — Narrative */}
          <div
            className={cn(
              "transition-all duration-1000 delay-200",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8",
            )}
          >
            <p className="font-sans text-cream-dark text-lg leading-relaxed mb-6 font-light">
              Sri Lanka is not a destination — it is a feeling. The scent of
              cinnamon in the hill country, the silence of an ancient dagoba at
              dawn, the emerald waters of a hidden lagoon known only to locals.
            </p>
            <p className="font-sans text-cream-dark text-lg leading-relaxed mb-8 font-light">
              As a native guide with over a decade of experience, I create
              journeys that go beyond the guidebook — connecting you with the
              living, breathing soul of this extraordinary island.
            </p>

            <a // 👈 Fixed the broken anchor opening tag here
              href="#contact"
              className="inline-flex items-center gap-3 text-gold text-sm tracking-[0.3em] uppercase font-sans hover:gap-5 transition-all duration-300"
            >
              Begin Your Story
              <span className="h-px w-8 bg-gold" />
            </a>
          </div>

          {/* Right — Stats */}
          <div
            className={cn(
              "grid grid-cols-1 gap-6 transition-all duration-1000 delay-400",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8",
            )}
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "border border-gold/20 p-8 hover:border-gold/50 transition-all duration-500 group",
                  "transition-all duration-700",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4",
                )}
                style={{ transitionDelay: `${600 + index * 150}ms` }}
              >
                <div className="font-serif text-5xl text-gradient-gold mb-2 font-light">
                  {stat.number}
                </div>
                <div className="text-cream text-sm tracking-widest uppercase font-sans mb-1">
                  {stat.label}
                </div>
                <div className="text-cream-dark text-sm font-light font-sans">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
