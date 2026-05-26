"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  country: z.string().optional(),
  message: z.string().min(10, "Please tell us a bit more"),
  tripType: z.string().optional(),
  duration: z.coerce.number().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

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

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Check if the user came from the AI planner
      const storedItinerary = sessionStorage.getItem("ceylonprive_itinerary");
      const aiGeneratedPlan = storedItinerary
        ? JSON.parse(storedItinerary)
        : undefined;

      await api.post("/api/contact", {
        ...data,
        aiGeneratedPlan,
        interests: [],
      });

      setIsSubmitted(true);
      reset();
      sessionStorage.removeItem("ceylonprive_itinerary");
      toast.success("Message sent! We will be in touch within 24 hours.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-28 bg-navy">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={cn(
            "text-center mb-16 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-[11px] tracking-[0.5em] uppercase text-gold font-sans font-light">
            Begin Your Journey
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-cream mt-4 mb-4 font-light">
            Let&apos;s Plan Your
            <br />
            <span className="text-gradient-gold italic">Perfect Escape</span>
          </h2>
          <p className="text-cream-dark font-sans font-light max-w-xl mx-auto">
            Every extraordinary journey begins with a conversation. Share your
            vision and we will craft something unforgettable.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-16 bg-gold/40" />
            <div className="w-1.5 h-1.5 bg-gold rotate-45" />
            <div className="h-px w-16 bg-gold/40" />
          </div>
        </div>

        {isSubmitted ? (
          /* Success State */
          <div
            className={cn(
              "border border-gold/30 p-16 text-center bg-navy-light transition-all duration-700",
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
            )}
          >
            <div className="text-gold text-5xl mb-6">✦</div>
            <h3 className="font-serif text-3xl text-cream font-light mb-4">
              Thank You
            </h3>
            <p className="text-cream-dark font-sans font-light">
              Your message has been received. We will be in touch within 24
              hours to begin crafting your journey.
            </p>
          </div>
        ) : (
          /* Contact Form */
          <div
            className={cn(
              "border border-gold/20 p-8 md:p-12 bg-navy-light transition-all duration-1000 delay-200",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8",
            )}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                    First Name *
                  </label>
                  <input
                    {...register("firstName")}
                    className={cn(
                      "w-full bg-navy border px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors",
                      errors.firstName
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-gold/20 focus:border-gold",
                    )}
                    placeholder="James"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-xs font-sans mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                    Last Name *
                  </label>
                  <input
                    {...register("lastName")}
                    className={cn(
                      "w-full bg-navy border px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors",
                      errors.lastName
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-gold/20 focus:border-gold",
                    )}
                    placeholder="Anderson"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-xs font-sans mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className={cn(
                      "w-full bg-navy border px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors",
                      errors.email
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-gold/20 focus:border-gold",
                    )}
                    placeholder="james@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs font-sans mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    {...register("phone")}
                    className="w-full bg-navy border border-gold/20 focus:border-gold px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors"
                    placeholder="+44 7700 000000"
                  />
                </div>
              </div>

              {/* Country & Trip Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                    Country
                  </label>
                  <input
                    {...register("country")}
                    className="w-full bg-navy border border-gold/20 focus:border-gold px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors"
                    placeholder="United Kingdom"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                    Trip Type
                  </label>
                  <select
                    {...register("tripType")}
                    className="w-full bg-navy border border-gold/20 focus:border-gold px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors appearance-none"
                  >
                    <option value="">Select a type</option>
                    <option value="honeymoon">Honeymoon</option>
                    <option value="family">Family Holiday</option>
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural Immersion</option>
                    <option value="wellness">Wellness Retreat</option>
                    <option value="private">Private Custom Tour</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                  Tell Us About Your Dream Journey *
                </label>
                <textarea
                  {...register("message")}
                  rows={5}
                  className={cn(
                    "w-full bg-navy border px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors resize-none",
                    errors.message
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-gold/20 focus:border-gold",
                  )}
                  placeholder="Share your vision — places you'd love to see, experiences that matter, any special occasions..."
                />
                {errors.message && (
                  <p className="text-red-400 text-xs font-sans mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full py-5 flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase font-sans transition-all duration-300",
                  isSubmitting
                    ? "bg-gold/30 text-gold/50 cursor-not-allowed"
                    : "bg-gold text-navy hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20",
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send My Enquiry
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
