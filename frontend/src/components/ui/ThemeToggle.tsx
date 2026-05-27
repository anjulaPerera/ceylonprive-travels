"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Must wait for mount to avoid hydration mismatch
  // Server doesn't know the theme — client does
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative w-14 h-7 rounded-full border transition-all duration-300 flex items-center",
        isDark ? "border-gold/40 bg-navy-mid" : "border-gold/60 bg-cream-dark",
      )}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Track icons */}
      <Moon
        size={11}
        className={cn(
          "absolute left-1.5 transition-opacity duration-300",
          isDark ? "opacity-100 text-gold" : "opacity-30 text-navy",
        )}
      />
      <Sun
        size={11}
        className={cn(
          "absolute right-1.5 transition-opacity duration-300",
          isDark ? "opacity-30 text-cream-dark" : "opacity-100 text-gold-dark",
        )}
      />

      {/* Sliding knob */}
      <div
        className={cn(
          "absolute w-5 h-5 rounded-full transition-all duration-300 shadow-sm",
          isDark ? "left-1 bg-gold" : "left-8 bg-gold-dark",
        )}
      />
    </button>
  );
}
