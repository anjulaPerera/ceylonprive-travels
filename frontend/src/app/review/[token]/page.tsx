"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Star, Send, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

const reviewSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your name"),
  customerEmail: z
    .string()
    .trim()
    .email("Valid email required")
    .or(z.literal(""))
    .optional(),
  rating: z.number().int().min(1, "Please select a rating").max(5),
  title: z.string().trim().optional(),
  body: z.string().trim().min(20, "Please write at least 20 characters"),
  tourDate: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

type PageState = "loading" | "valid" | "invalid" | "submitted";

export default function ReviewSubmissionPage() {
  const params = useParams();
  const token = params.token as string;

  const [pageState, setPageState] = useState<PageState>("loading");
  const [invalidReason, setInvalidReason] = useState("");
  const [customerNameFromToken, setCustomerNameFromToken] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0 },
  });

  // Verify the token is valid when page loads
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await api.get(`/api/tokens/verify/${token}`);
        if (response.data.valid) {
          setPageState("valid");
          if (response.data.customerName) {
            setCustomerNameFromToken(response.data.customerName);
            setValue("customerName", response.data.customerName);
          }
        } else {
          setPageState("invalid");
          setInvalidReason(response.data.reason ?? "This link is not valid.");
        }
      } catch {
        setPageState("invalid");
        setInvalidReason("This review link is invalid or has expired.");
      }
    };
    verifyToken();
  }, [token, setValue]);

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue("rating", rating);
  };

  const onSubmit = async (data: ReviewFormData) => {
    if (selectedRating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/api/reviews", {
        token,
        customerName: data.customerName,
        customerEmail: data.customerEmail || undefined,
        rating: selectedRating,
        title: data.title || undefined,
        body: data.body,
        tourDate: data.tourDate || undefined,
      });
      setPageState("submitted");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed to submit review. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  // ── Loading ───────────────────────────────────────────────
  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-gold animate-spin" />
          <p className="text-cream-dark font-sans text-sm tracking-widest">
            Verifying your link...
          </p>
        </div>
      </div>
    );
  }

  // ── Invalid Token ─────────────────────────────────────────
  if (pageState === "invalid") {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <XCircle size={48} className="text-red-400 mx-auto mb-6" />
          <h1 className="font-serif text-3xl text-cream font-light mb-4">
            Link Unavailable
          </h1>
          <p className="text-cream-dark font-sans font-light mb-8">
            {invalidReason}
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 border border-gold/40 text-gold text-sm tracking-widest uppercase font-sans hover:bg-gold hover:text-navy transition-all duration-300"
          >
            Visit CeylonPrivé
          </Link>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────
  if (pageState === "submitted") {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          {/* Brand */}
          <div className="mb-12">
            <div className="font-serif text-2xl font-light tracking-[0.15em] text-gradient-gold mb-1">
              CeylonPrivé
            </div>
            <div className="text-[9px] tracking-[0.4em] text-cream-dark uppercase font-sans">
              Travels
            </div>
          </div>

          <CheckCircle size={48} className="text-teal mx-auto mb-6" />
          <h1 className="font-serif text-3xl text-cream font-light mb-4">
            Thank You
          </h1>
          <p className="text-cream-dark font-sans font-light leading-relaxed mb-4">
            Your review has been received and means the world to us. It will
            appear on our website after a brief review.
          </p>
          <p className="text-cream-dark/60 font-sans text-sm mb-10">
            We hope to welcome you back to Sri Lanka very soon.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-16 bg-gold/30" />
            <div className="w-1.5 h-1.5 bg-gold rotate-45" />
            <div className="h-px w-16 bg-gold/30" />
          </div>

          <p className="text-cream-dark/60 font-sans text-xs mb-4">
            Share your experience on TripAdvisor too?
          </p>

          <a
            href="https://www.tripadvisor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 border border-gold/30 text-gold text-sm tracking-widest uppercase font-sans hover:bg-gold hover:text-navy transition-all duration-300 mb-6"
          >
            Review on TripAdvisor
          </a>

          <div className="block mt-4">
            <Link
              href="/"
              className="text-cream-dark/50 text-xs font-sans hover:text-cream-dark transition-colors tracking-widest"
            >
              Return to CeylonPrivé →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Review Form ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-navy py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block">
            <div className="font-serif text-2xl font-light tracking-[0.15em] text-gradient-gold mb-1">
              CeylonPrivé
            </div>
            <div className="text-[9px] tracking-[0.4em] text-cream-dark uppercase font-sans">
              Travels
            </div>
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center mb-12">
          <span className="text-[11px] tracking-[0.5em] uppercase text-gold font-sans font-light">
            Share Your Experience
          </span>
          <h1 className="font-serif text-4xl text-cream mt-4 mb-4 font-light">
            {customerNameFromToken
              ? `Welcome back, ${customerNameFromToken.split(" ")[0]}`
              : "We&apos;d Love Your Feedback"}
          </h1>
          <p className="text-cream-dark font-sans font-light max-w-md mx-auto text-sm leading-relaxed">
            Your experience matters deeply to us. Please share your honest
            thoughts — it takes just a few minutes and helps future travellers
            discover Sri Lanka.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-12 bg-gold/40" />
            <div className="w-1 h-1 bg-gold rotate-45" />
            <div className="h-px w-12 bg-gold/40" />
          </div>
        </div>

        {/* Form */}
        <div className="border border-gold/20 bg-navy-light p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Star Rating */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-4">
                Overall Rating *
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => handleRatingClick(star)}
                    className="transition-transform duration-100 hover:scale-110"
                    aria-label={`${star} stars`}
                  >
                    <Star
                      size={36}
                      className={cn(
                        "transition-colors duration-150",
                        star <= (hoveredRating || selectedRating)
                          ? "text-gold fill-gold"
                          : "text-gold/30",
                      )}
                    />
                  </button>
                ))}
                {(hoveredRating || selectedRating) > 0 && (
                  <span className="text-cream font-serif text-lg font-light ml-2">
                    {ratingLabels[hoveredRating || selectedRating]}
                  </span>
                )}
              </div>
              {errors.rating && (
                <p className="text-red-400 text-xs font-sans mt-2">
                  {errors.rating.message}
                </p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                Your Name *
              </label>
              <input
                {...register("customerName")}
                className={cn(
                  "w-full bg-navy border px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors",
                  errors.customerName
                    ? "border-red-500/50"
                    : "border-gold/20 focus:border-gold",
                )}
                placeholder="James Anderson"
              />
              {errors.customerName && (
                <p className="text-red-400 text-xs font-sans mt-1">
                  {errors.customerName.message}
                </p>
              )}
            </div>

            {/* Email (optional) */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                Email Address (Optional)
              </label>
              <input
                {...register("customerEmail")}
                type="email"
                className="w-full bg-navy border border-gold/20 focus:border-gold px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors"
                placeholder="james@example.com"
              />
              <p className="text-cream-dark/50 text-xs font-sans mt-1">
                We won&apos;t share your email publicly
              </p>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                Review Title (Optional)
              </label>
              <input
                {...register("title")}
                className="w-full bg-navy border border-gold/20 focus:border-gold px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors"
                placeholder="e.g. A journey I will never forget"
              />
            </div>

            {/* Tour Date */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                When Did You Travel? (Optional)
              </label>
              <input
                {...register("tourDate")}
                type="month"
                className="w-full bg-navy border border-gold/20 focus:border-gold px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Review Body */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                Your Review *
              </label>
              <textarea
                {...register("body")}
                rows={6}
                className={cn(
                  "w-full bg-navy border px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors resize-none",
                  errors.body
                    ? "border-red-500/50"
                    : "border-gold/20 focus:border-gold",
                )}
                placeholder="Share your experience — the highlights, the hidden gems, the moments that made your Sri Lanka journey extraordinary..."
              />
              {errors.body && (
                <p className="text-red-400 text-xs font-sans mt-1">
                  {errors.body.message}
                </p>
              )}
            </div>

            {/* Disclaimer */}
            <div className="border border-gold/10 bg-gold/5 px-5 py-4">
              <p className="text-cream-dark/70 text-xs font-sans leading-relaxed">
                By submitting this review, you confirm it reflects your genuine
                experience. Reviews are moderated before appearing publicly.
              </p>
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
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit My Review
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-cream-dark/30 text-xs font-sans mt-8 tracking-wider">
          This is a private, single-use review link sent specifically to you.
        </p>
      </div>
    </div>
  );
}
