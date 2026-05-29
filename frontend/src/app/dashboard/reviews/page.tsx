"use client";

import { useEffect, useState } from "react";
import { Star, Check, Eye, EyeOff } from "lucide-react";
import { cn, formatDate, formatRating } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface DashboardReview {
  id: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  title?: string;
  body: string;
  tourDate?: string;
  isApproved: boolean;
  isPublished: boolean;
  createdAt: string;
  reviewToken?: { customerName?: string };
}

export default function ReviewsDashboardPage() {
  const [reviews, setReviews] = useState<DashboardReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get("/api/reviews/all");
        setReviews(response.data.reviews);
      } catch {
        toast.error("Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleApproveToggle = async (review: DashboardReview) => {
    const newApproved = !review.isApproved;
    try {
      await api.patch(`/api/reviews/${review.id}/approve`, {
        isApproved: newApproved,
        isPublished: newApproved ? review.isPublished : false,
      });
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id
            ? {
                ...r,
                isApproved: newApproved,
                isPublished: newApproved ? r.isPublished : false,
              }
            : r,
        ),
      );
      toast.success(newApproved ? "Review approved" : "Approval removed");
    } catch {
      toast.error("Failed to update review");
    }
  };

  const handlePublishToggle = async (review: DashboardReview) => {
    if (!review.isApproved) {
      toast.error("Approve the review first before publishing");
      return;
    }
    const newPublished = !review.isPublished;
    try {
      await api.patch(`/api/reviews/${review.id}/approve`, {
        isApproved: review.isApproved,
        isPublished: newPublished,
      });
      setReviews((prev) =>
        prev.map((r) =>
          r.id === review.id ? { ...r, isPublished: newPublished } : r,
        ),
      );
      toast.success(
        newPublished ? "Published to homepage" : "Hidden from homepage",
      );
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.isApproved;
    if (filter === "approved") return r.isApproved;
    return true;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-gold mb-2">
          <Star size={16} />
          <span className="text-xs tracking-widest uppercase font-sans font-light">
            Review Management
          </span>
        </div>
        <h1 className="font-serif text-4xl text-cream font-light">
          Customer Reviews
        </h1>
        <p className="text-cream-dark font-sans font-light text-sm mt-1">
          {reviews.filter((r) => !r.isApproved).length} pending approval ·{" "}
          {reviews.filter((r) => r.isPublished).length} published
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 border border-gold/10 p-1 w-fit">
        {(["all", "pending", "approved"] as const).map((f) => (
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
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-navy-mid animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-gold/10 p-16 text-center">
          <p className="font-serif text-2xl text-cream-dark font-light">
            No reviews found
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <div
              key={review.id}
              className="border border-gold/10 p-6 bg-navy-light hover:border-gold/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-gold text-base">
                      {formatRating(review.rating)}
                    </span>
                    <span className="text-cream font-sans text-sm font-medium">
                      {review.customerName}
                    </span>
                    {review.customerEmail && (
                      <span className="text-cream-dark/60 text-xs font-sans">
                        {review.customerEmail}
                      </span>
                    )}
                    <span className="text-cream-dark/40 text-xs font-sans">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  {review.title && (
                    <p className="font-serif text-lg text-cream font-light mb-2">
                      &ldquo;{review.title}&rdquo;
                    </p>
                  )}
                  <p className="text-cream-dark font-sans text-sm font-light leading-relaxed">
                    {review.body}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleApproveToggle(review)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 text-xs font-sans tracking-wide border transition-all duration-200",
                      review.isApproved
                        ? "border-teal text-teal bg-teal/10"
                        : "border-gold/30 text-cream-dark hover:border-gold",
                    )}
                  >
                    <Check size={12} />
                    {review.isApproved ? "Approved" : "Approve"}
                  </button>
                  <button
                    onClick={() => handlePublishToggle(review)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 text-xs font-sans tracking-wide border transition-all duration-200",
                      review.isPublished
                        ? "border-gold text-gold bg-gold/10"
                        : "border-gold/20 text-cream-dark hover:border-gold/50",
                      !review.isApproved && "opacity-40 cursor-not-allowed",
                    )}
                  >
                    {review.isPublished ? (
                      <>
                        <Eye size={12} />
                        Published
                      </>
                    ) : (
                      <>
                        <EyeOff size={12} />
                        Publish
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
