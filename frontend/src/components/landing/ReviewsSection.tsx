"use client";

import { useEffect, useRef, useState } from "react";
import { cn, formatDate, formatRating } from "@/lib/utils";
import api from "@/lib/api";
import { Review } from "@/types/models";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get("/api/reviews");
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const placeholderReviews: Partial<Review>[] = [
    {
      id: "1",
      customerName: "James & Caroline M.",
      rating: 5,
      title: "A journey we will never forget",
      body: "From the misty highlands of Ella to the ancient ruins of Anuradhapura, every day felt curated just for us. Our guide's knowledge of hidden gems transformed a holiday into a life-changing experience.",
      tourDate: "2024-11-15",
      createdAt: "2024-11-20",
    },
    {
      id: "2",
      customerName: "Alexandra R.",
      rating: 5,
      title: "The finest travel experience of my life",
      body: "I have traveled to over 40 countries and this private Sri Lanka tour exceeded every expectation. The level of detail, the access to places other tourists never see — truly extraordinary.",
      tourDate: "2024-10-08",
      createdAt: "2024-10-12",
    },
    {
      id: "3",
      customerName: "The Hoffmann Family",
      rating: 5,
      title: "Perfect for our family of five",
      body: "Planning a luxury trip with three children seemed daunting. Our guide thought of everything — the right pace, the right activities, incredible food the kids loved. We are already planning our return.",
      tourDate: "2024-09-22",
      createdAt: "2024-09-28",
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : placeholderReviews;

  return (
    <section id="reviews" ref={sectionRef} className="py-28 bg-navy-light">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={cn(
            "text-center mb-16 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-[11px] tracking-[0.5em] uppercase text-gold font-sans font-light">
            Guest Experiences
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-cream mt-4 mb-6 font-light">
            Words From Our Guests
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gold/40" />
            <div className="w-1.5 h-1.5 bg-gold rotate-45" />
            <div className="h-px w-16 bg-gold/40" />
          </div>
        </div>

        {/* Reviews Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-gold/10 p-8 animate-pulse bg-navy h-64"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayReviews.map((review, index) => (
              <div
                key={review.id}
                className={cn(
                  "border border-gold/20 p-8 hover:border-gold/40 transition-all duration-500 flex flex-col",
                  "transition-all duration-700",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8",
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Stars */}
                <div className="text-gold text-lg mb-4 tracking-widest">
                  {formatRating(review.rating ?? 5)}
                </div>

                {/* Title */}
                {review.title && (
                  <h4 className="font-serif text-xl text-cream font-light mb-3">
                    &ldquo;{review.title}&rdquo;
                  </h4>
                )}

                {/* Body */}
                <p className="text-cream-dark font-sans font-light text-sm leading-relaxed flex-1 mb-6">
                  {review.body}
                </p>

                {/* Footer */}
                <div className="border-t border-gold/10 pt-4 flex items-end justify-between">
                  <div>
                    <p className="text-cream text-sm font-sans font-medium">
                      {review.customerName}
                    </p>
                    {review.tourDate && (
                      <p className="text-cream-dark/60 text-xs font-sans mt-0.5">
                        {formatDate(review.tourDate)}
                      </p>
                    )}
                  </div>
                  <div className="text-gold/40 font-serif text-4xl leading-none">
                    &ldquo;
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TripAdvisor CTA */}
        {/* TripAdvisor CTA */}
        <div
          className={cn(
            "text-center mt-12 transition-all duration-1000 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <p className="text-cream-dark font-sans font-light text-sm mb-4">
            Read independent reviews on TripAdvisor
          </p>

          <a
            href="https://www.tripadvisor.com/Profile/YOUR_PROFILE_HERE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3 border border-gold/30 text-sm tracking-[0.2em] uppercase font-sans text-cream-dark hover:border-gold hover:text-gold transition-all duration-300"
          >
            View on TripAdvisor
            <span className="h-px w-6 bg-current" />
          </a>
        </div>
      </div>
    </section>
  );
}
