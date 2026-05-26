"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Utensils,
  Bed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { GeneratedItinerary } from "@/types/models";
import toast from "react-hot-toast";

const interestOptions = [
  { value: "beaches", label: "Beaches", emoji: "🏖️" },
  { value: "temples", label: "Ancient Temples", emoji: "🏛️" },
  { value: "wildlife", label: "Wildlife Safari", emoji: "🐘" },
  { value: "tea-country", label: "Tea Highlands", emoji: "🍃" },
  { value: "culture", label: "Local Culture", emoji: "🎭" },
  { value: "adventure", label: "Adventure Sports", emoji: "🧗" },
  { value: "cuisine", label: "Ceylon Cuisine", emoji: "🍛" },
  { value: "wellness", label: "Ayurveda & Wellness", emoji: "🧘" },
];

const budgetOptions = [
  {
    value: "budget",
    label: "Comfortable",
    description: "Guesthouses & local restaurants",
  },
  {
    value: "mid-range",
    label: "Premium",
    description: "Boutique hotels & fine dining",
  },
  {
    value: "luxury",
    label: "Ultra-Luxury",
    description: "5-star resorts & private dining",
  },
];

export default function AIPlanner() {
  const [days, setDays] = useState(7);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [groupSize, setGroupSize] = useState(2);
  const [budget, setBudget] = useState("mid-range");
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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

  const toggleInterest = (value: string) => {
    setSelectedInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
    );
  };

  const handleGenerate = async () => {
    if (selectedInterests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    setIsGenerating(true);
    setItinerary(null);

    try {
      const response = await api.post("/api/ai/itinerary", {
        days,
        interests: selectedInterests,
        groupSize,
        budget,
      });

      setItinerary(response.data.itinerary);

      // Scroll to results smoothly after generation
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed to generate itinerary. Please try again.";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="ai-planner" ref={sectionRef} className="py-28 bg-navy-light">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={cn(
            "text-center mb-16 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <span className="text-[11px] tracking-[0.5em] uppercase text-gold font-sans font-light">
            Powered by AI
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-cream mt-4 mb-4 font-light">
            Your Itinerary, Crafted
            <br />
            <span className="text-gradient-gold italic">Instantly</span>
          </h2>
          <p className="text-cream-dark font-sans font-light max-w-xl mx-auto">
            Tell us your vision. Our AI concierge — trained on years of Sri
            Lanka expertise — builds your perfect journey in seconds.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-16 bg-gold/40" />
            <div className="w-1.5 h-1.5 bg-gold rotate-45" />
            <div className="h-px w-16 bg-gold/40" />
          </div>
        </div>

        {/* Planner Form */}
        <div
          className={cn(
            "border border-gold/20 p-8 md:p-12 bg-navy transition-all duration-1000 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          {/* Duration */}
          <div className="mb-10">
            <label
              htmlFor="duration-slider"
              className="block text-sm tracking-widest uppercase text-gold font-sans mb-4"
            >
              Duration — {days} Days
            </label>
            <input
              id="duration-slider"
              type="range"
              min={3}
              max={21}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full h-px bg-gold/20 appearance-none cursor-pointer accent-gold"
            />
            <div className="flex justify-between text-xs text-cream-dark/60 font-sans mt-2">
              <span>3 Days</span>
              <span>21 Days</span>
            </div>
          </div>

          {/* Interests */}
          <div className="mb-10">
            <label className="block text-sm tracking-widest uppercase text-gold font-sans mb-4">
              Interests — Select All That Apply
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest.value}
                  onClick={() => toggleInterest(interest.value)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 border text-sm font-sans font-light transition-all duration-300 text-left",
                    selectedInterests.includes(interest.value)
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-gold/20 text-cream-dark hover:border-gold/50",
                  )}
                >
                  <span>{interest.emoji}</span>
                  <span className="text-xs tracking-wide">
                    {interest.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Group Size & Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Group Size */}
            <div>
              <label
                htmlFor="group-size-slider"
                className="block text-sm tracking-widest uppercase text-gold font-sans mb-4"
              >
                Group Size — {groupSize} {groupSize === 1 ? "Person" : "People"}
              </label>
              <input
                id="group-size-slider"
                type="range"
                min={1}
                max={12}
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                className="w-full h-px bg-gold/20 appearance-none cursor-pointer accent-gold"
              />
              <div className="flex justify-between text-xs text-cream-dark/60 font-sans mt-2">
                <span>Solo</span>
                <span>12 People</span>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm tracking-widest uppercase text-gold font-sans mb-4">
                Experience Level
              </label>
              <div className="flex flex-col gap-2">
                {budgetOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setBudget(option.value)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 border text-left transition-all duration-300",
                      budget === option.value
                        ? "border-gold bg-gold/10"
                        : "border-gold/20 hover:border-gold/50",
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-sans font-light",
                        budget === option.value
                          ? "text-gold"
                          : "text-cream-dark",
                      )}
                    >
                      {option.label}
                    </span>
                    <span className="text-xs text-cream-dark/60 font-sans hidden md:block">
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={cn(
              "w-full py-5 flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase font-sans transition-all duration-300",
              isGenerating
                ? "bg-gold/30 text-gold/50 cursor-not-allowed"
                : "bg-gold text-navy hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20",
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Crafting Your Journey...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate My Itinerary
              </>
            )}
          </button>
        </div>

        {/* Generated Itinerary Results */}
        {itinerary && (
          <div ref={resultsRef} className="mt-12 border border-gold/20 bg-navy">
            {/* Itinerary Header */}
            <div className="p-8 md:p-12 border-b border-gold/10">
              <span className="text-[11px] tracking-[0.5em] uppercase text-gold font-sans font-light">
                Your Personalised Itinerary
              </span>
              <h3 className="font-serif text-3xl md:text-5xl text-cream mt-3 mb-4 font-light">
                {itinerary.title}
              </h3>
              <p className="text-cream-dark font-sans font-light leading-relaxed">
                {itinerary.summary}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-3 mt-6">
                {itinerary.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="px-4 py-1.5 border border-gold/30 text-xs tracking-widest uppercase text-gold font-sans"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 mt-6 text-sm text-cream-dark font-sans font-light">
                <span>🗓️ {itinerary.duration} days</span>
                <span>💰 {itinerary.estimatedBudget}</span>
                <span>☀️ Best time: {itinerary.bestTimeToVisit}</span>
              </div>
            </div>

            {/* Day by Day */}
            <div className="divide-y divide-gold/10">
              {itinerary.days.map((day) => (
                <div key={day.day} className="overflow-hidden">
                  {/* Day Header */}
                  <button
                    className="w-full p-6 md:p-8 flex items-center justify-between text-left hover:bg-navy-light/50 transition-colors duration-200"
                    onClick={() =>
                      setExpandedDay(expandedDay === day.day ? null : day.day)
                    }
                  >
                    <div className="flex items-center gap-6">
                      <span className="font-serif text-3xl text-gold/40 font-light w-12">
                        {String(day.day).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-serif text-xl text-cream font-light">
                          {day.title}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-cream-dark/60 font-sans mt-1">
                          <MapPin size={10} />
                          {day.location}
                          {day.travelTime && ` · ${day.travelTime}`}
                        </p>
                      </div>
                    </div>
                    {expandedDay === day.day ? (
                      <ChevronUp size={16} className="text-gold shrink-0" />
                    ) : (
                      <ChevronDown
                        size={16}
                        className="text-gold/40 shrink-0"
                      />
                    )}
                  </button>

                  {/* Day Detail */}
                  {expandedDay === day.day && (
                    <div className="px-6 md:px-8 pb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Description + Activities */}
                      <div className="md:col-span-2">
                        <p className="text-cream-dark font-sans font-light text-sm leading-relaxed mb-6">
                          {day.description}
                        </p>
                        <h5 className="text-xs tracking-widest uppercase text-gold font-sans mb-3">
                          Activities
                        </h5>
                        <ul className="space-y-2">
                          {day.activities.map((activity, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-cream-dark font-sans font-light"
                            >
                              <span className="text-gold mt-0.5 shrink-0">
                                ✦
                              </span>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Accommodation & Meals */}
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-gold font-sans mb-2">
                            <Bed size={12} />
                            Stay
                          </div>
                          <p className="text-sm text-cream-dark font-sans font-light">
                            {day.accommodation}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-gold font-sans mb-2">
                            <Utensils size={12} />
                            Dining
                          </div>
                          <ul className="space-y-1">
                            {day.meals.map((meal, i) => (
                              <li
                                key={i}
                                className="text-sm text-cream-dark font-sans font-light"
                              >
                                {meal}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA after itinerary */}
            <div className="p-8 md:p-12 border-t border-gold/10 text-center">
              <p className="font-serif text-2xl text-cream font-light mb-2">
                Love this itinerary?
              </p>
              <p className="text-cream-dark font-sans font-light text-sm mb-6">
                Send it directly to us and we&apos;ll make it a reality.
              </p>

              <a // 👈 Added missing anchor open tag here
                href={`#contact`}
                className="inline-block px-10 py-4 bg-gold text-navy text-sm tracking-[0.2em] uppercase font-sans font-medium hover:bg-gold-light transition-all duration-300"
                onClick={() => {
                  sessionStorage.setItem(
                    "ceylonprive_itinerary",
                    JSON.stringify(itinerary),
                  );
                }}
              >
                Book This Journey
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
