"use client";

import { useEffect, useState } from "react";
import { Mail, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import api from "@/lib/api";
import { ContactSubmission } from "@/types/models";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  PENDING: "text-gold border-gold/30 bg-gold/5",
  VIEWED: "text-cream border-cream/30 bg-cream/5",
  REPLIED: "text-teal border-teal/30 bg-teal/5",
  CLOSED: "text-cream-dark border-cream-dark/30",
};

export default function ContactsDashboardPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ContactSubmission["status"] | "ALL">(
    "ALL",
  );

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api.get("/api/contact");
        setSubmissions(response.data.submissions);
      } catch {
        toast.error("Failed to load enquiries");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const handleStatusChange = async (
    id: string,
    status: ContactSubmission["status"],
  ) => {
    try {
      await api.patch(`/api/contact/${id}/status`, { status });
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s)),
      );
      toast.success(`Status updated to ${status.toLowerCase()}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filtered = submissions.filter(
    (s) => filter === "ALL" || s.status === filter,
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-gold mb-2">
          <Mail size={16} />
          <span className="text-xs tracking-widest uppercase font-sans font-light">
            Enquiry Management
          </span>
        </div>
        <h1 className="font-serif text-4xl text-cream font-light">
          Customer Enquiries
        </h1>
        <p className="text-cream-dark font-sans font-light text-sm mt-1">
          {submissions.filter((s) => s.status === "PENDING").length} new
          enquiries
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-1 mb-6 border border-gold/10 p-1 w-fit">
        {(["ALL", "PENDING", "VIEWED", "REPLIED", "CLOSED"] as const).map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 text-xs tracking-widest uppercase font-sans transition-all duration-200",
                filter === f
                  ? "bg-gold text-navy"
                  : "text-cream-dark hover:text-cream",
              )}
            >
              {f}
            </button>
          ),
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-navy-mid animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-gold/10 p-16 text-center">
          <p className="font-serif text-2xl text-cream-dark font-light">
            No enquiries found
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => (
            <div
              key={sub.id}
              className="border border-gold/10 bg-navy-light hover:border-gold/20 transition-colors"
            >
              {/* Header Row */}
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left"
                onClick={() =>
                  setExpandedId(expandedId === sub.id ? null : sub.id)
                }
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-cream font-sans text-sm font-medium">
                      {sub.firstName} {sub.lastName}
                    </p>
                    <p className="text-cream-dark/60 text-xs font-sans mt-0.5">
                      {sub.email}
                      {sub.country && ` · ${sub.country}`}
                      {sub.tripType && ` · ${sub.tripType}`}
                    </p>
                  </div>
                  {sub.aiGeneratedPlan && (
                    <span className="flex items-center gap-1 px-2 py-1 border border-gold/30 text-gold text-[10px] tracking-widest uppercase font-sans">
                      <Sparkles size={9} />
                      AI Plan
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cream-dark/50 text-xs font-sans">
                    {formatDate(sub.createdAt)}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] tracking-widest uppercase font-sans border px-2 py-1",
                      STATUS_COLORS[sub.status],
                    )}
                  >
                    {sub.status}
                  </span>
                  {expandedId === sub.id ? (
                    <ChevronUp size={14} className="text-gold" />
                  ) : (
                    <ChevronDown size={14} className="text-cream-dark/40" />
                  )}
                </div>
              </button>

              {/* Expanded Detail */}
              {expandedId === sub.id && (
                <div className="px-6 pb-6 border-t border-gold/10 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs tracking-widest uppercase text-gold font-sans mb-1">
                          Contact
                        </p>
                        <p className="text-cream-dark text-sm font-sans">
                          {sub.email}
                        </p>
                        {sub.phone && (
                          <p className="text-cream-dark text-sm font-sans">
                            {sub.phone}
                          </p>
                        )}
                      </div>
                      {sub.message && (
                        <div>
                          <p className="text-xs tracking-widest uppercase text-gold font-sans mb-1">
                            Message
                          </p>
                          <p className="text-cream-dark text-sm font-sans leading-relaxed">
                            {sub.message}
                          </p>
                        </div>
                      )}
                      {sub.interests.length > 0 && (
                        <div>
                          <p className="text-xs tracking-widest uppercase text-gold font-sans mb-2">
                            Interests
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {sub.interests.map((i) => (
                              <span
                                key={i}
                                className="px-2 py-1 border border-gold/20 text-xs text-cream-dark font-sans"
                              >
                                {i}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs tracking-widest uppercase text-gold font-sans mb-1">
                          Trip Details
                        </p>
                        <div className="text-cream-dark text-sm font-sans space-y-1">
                          {sub.duration && <p>{sub.duration} days</p>}
                          {sub.groupSize && <p>{sub.groupSize} people</p>}
                          {sub.preferredDate && (
                            <p>Preferred: {formatDate(sub.preferredDate)}</p>
                          )}
                          {sub.budget && <p>Budget: {sub.budget}</p>}
                        </div>
                      </div>

                      {/* Update Status */}
                      <div>
                        <p className="text-xs tracking-widest uppercase text-gold font-sans mb-2">
                          Update Status
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {(["VIEWED", "REPLIED", "CLOSED"] as const).map(
                            (s) => (
                              <button
                                key={s}
                                onClick={() => handleStatusChange(sub.id, s)}
                                disabled={sub.status === s}
                                className={cn(
                                  "px-3 py-1.5 text-xs tracking-widest uppercase font-sans border transition-all duration-200",
                                  sub.status === s
                                    ? "border-gold bg-gold/10 text-gold cursor-default"
                                    : "border-gold/20 text-cream-dark hover:border-gold hover:text-gold",
                                )}
                              >
                                Mark {s.toLowerCase()}
                              </button>
                            ),
                          )}
                        </div>
                      </div>

                      {/* AI Generated Plan */}
                      {sub.aiGeneratedPlan && (
                        <div className="md:col-span-2 mt-4 border-t border-gold/10 pt-4">
                          <p className="text-xs tracking-widest uppercase text-gold font-sans mb-3 flex items-center gap-2">
                            <Sparkles size={12} />
                            AI Generated Itinerary They Saw
                          </p>
                          {(() => {
                            const plan = sub.aiGeneratedPlan as {
                              title?: string;
                              summary?: string;
                              duration?: number;
                              highlights?: string[];
                              bestTimeToVisit?: string;
                              days?: Array<{
                                day: number;
                                title: string;
                                location: string;
                                activities: string[];
                              }>;
                            };
                            return (
                              <div className="bg-navy border border-gold/10 p-4 space-y-3">
                                {plan.title && (
                                  <p className="font-serif text-lg text-cream font-light">
                                    {plan.title}
                                  </p>
                                )}
                                {plan.summary && (
                                  <p className="text-cream-dark text-sm font-sans leading-relaxed">
                                    {plan.summary}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-3 text-xs text-cream-dark font-sans">
                                  {plan.duration && (
                                    <span>🗓️ {plan.duration} days</span>
                                  )}
                                  {plan.bestTimeToVisit && (
                                    <span>
                                      ☀️ Best time: {plan.bestTimeToVisit}
                                    </span>
                                  )}
                                </div>
                                {plan.highlights &&
                                  plan.highlights.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {plan.highlights.map((h: string) => (
                                        <span
                                          key={h}
                                          className="px-2 py-1 border border-gold/20 text-[10px] tracking-widest uppercase text-gold font-sans"
                                        >
                                          {h}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                {plan.days && plan.days.length > 0 && (
                                  <div className="space-y-2 mt-2">
                                    {plan.days.map(
                                      (day: {
                                        day: number;
                                        title: string;
                                        location: string;
                                        activities: string[];
                                      }) => (
                                        <div
                                          key={day.day}
                                          className="border-l border-gold/20 pl-3"
                                        >
                                          <p className="text-cream text-xs font-sans font-medium">
                                            Day {day.day}: {day.title} ·{" "}
                                            {day.location}
                                          </p>
                                          <p className="text-cream-dark text-xs font-sans mt-0.5">
                                            {day.activities
                                              .slice(0, 2)
                                              .join(" · ")}
                                            {day.activities.length > 2 &&
                                              " ..."}
                                          </p>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
