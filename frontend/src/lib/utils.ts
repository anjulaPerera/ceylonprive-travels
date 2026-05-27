import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn() — the standard utility for combining Tailwind classes safely.
// Used in virtually every component in the project.
// Usage: cn("base-class", condition && "conditional-class", "another-class")
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Format a date to a readable string
// Usage: formatDate(new Date()) → "January 15, 2025"
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Truncate text to a maximum length with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

// Format star rating to display stars
// Usage: formatRating(4) → "★★★★☆"
export function formatRating(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}
