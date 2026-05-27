"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { GalleryItem } from "@/types/models";

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch published gallery items from the backend
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await api.get("/api/gallery");
        setItems(response.data.items);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxItem(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Placeholder items shown while loading
  const placeholders = Array.from({ length: 6 });

  return (
    <section id="gallery" ref={sectionRef} className="py-28 bg-navy">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={cn(
            "text-center mb-16 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-[11px] tracking-[0.5em] uppercase text-gold font-sans font-light">
            Visual Journey
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-cream mt-4 mb-6 font-light">
            Ceylon Through My Lens
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gold/40" />
            <div className="w-1.5 h-1.5 bg-gold rotate-45" />
            <div className="h-px w-16 bg-gold/40" />
          </div>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          // Skeleton loading state — shows the grid shape while loading
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {placeholders.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "bg-navy-mid animate-pulse",
                  i === 0 || i === 3 ? "aspect-[4/5]" : "aspect-square",
                )}
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          // Empty state — shown before any photos are uploaded
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-cream-dark font-light">
              Gallery coming soon
            </p>
            <p className="text-sm text-cream-dark/60 mt-2 font-sans">
              Check back as we add our finest captures
            </p>
          </div>
        ) : (
          // Actual gallery grid
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "relative overflow-hidden cursor-pointer group border border-gold/0 hover:border-gold/30 transition-all duration-500",
                  // Make every 4th item taller for visual variety
                  index % 4 === 0 ? "aspect-[4/5]" : "aspect-square",
                  "transition-all duration-700",
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => setLightboxItem(item)}
              >
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                  <ZoomIn size={24} className="text-gold" />
                  <p className="font-serif text-cream text-lg font-light">
                    {item.title}
                  </p>
                  {item.category && (
                    <span className="text-xs tracking-widest uppercase text-gold/80 font-sans">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-navy/95 flex items-center justify-center p-4 md:p-12"
          onClick={() => setLightboxItem(null)}
        >
          <button
            className="absolute top-6 right-6 text-cream hover:text-gold transition-colors z-10"
            onClick={() => setLightboxItem(null)}
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          <div
            className="relative max-w-5xl w-full max-h-[85vh] aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxItem.url}
              alt={lightboxItem.title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <div className="absolute bottom-8 text-center">
            <p className="font-serif text-2xl text-cream font-light">
              {lightboxItem.title}
            </p>
            {lightboxItem.description && (
              <p className="text-cream-dark text-sm font-sans mt-1">
                {lightboxItem.description}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
