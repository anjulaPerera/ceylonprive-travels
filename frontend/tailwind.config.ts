import type { Config } from "tailwindcss";

const config: Config = {
  // darkMode: 'class' means dark mode is controlled by adding
  // the 'dark' class to the <html> element, not by OS preference.
  // next-themes handles this for us automatically.
  darkMode: "class",

  // Tell Tailwind where your components live so it can
  // tree-shake unused styles in production builds.
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      // ── Brand Colors ────────────────────────────────────────
      colors: {
        // Primary gold — headlines, CTAs, decorative accents
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8D08A",
          dark: "#A07830",
        },
        // Deep navy — primary background
        navy: {
          DEFAULT: "#0A0F1E",
          light: "#141929",
          mid: "#1E2640",
        },
        // Ceylon teal — signature brand color
        teal: {
          DEFAULT: "#1A6B5A",
          light: "#2A8B74",
          dark: "#0F4A3D",
        },
        // Warm cream — body text on dark backgrounds
        cream: {
          DEFAULT: "#F5F0E8",
          dark: "#D4C9B0",
        },
      },

      // ── Typography ───────────────────────────────────────────
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },

      // ── Custom Font Sizes ────────────────────────────────────
      fontSize: {
        // Extra large display text for hero headings
        "display-xl": ["5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": [
          "3.75rem",
          { lineHeight: "1.15", letterSpacing: "-0.02em" },
        ],
        "display-md": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },

      // ── Animations ───────────────────────────────────────────
      animation: {
        "fade-in": "fadeIn 0.8s ease-in-out forwards",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-up-delay": "fadeUp 0.8s ease-out 0.3s forwards",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },

      // ── Spacing & Sizing ─────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      // ── Backdrop Blur ────────────────────────────────────────
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
