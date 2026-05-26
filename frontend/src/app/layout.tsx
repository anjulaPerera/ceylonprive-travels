import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// Load Cormorant Garamond — luxury serif for headings
// We load multiple weights for design flexibility
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant", // CSS variable we reference in Tailwind
  display: "swap",
});

// Load Inter — clean sans-serif for body text
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CeylonPrivé Travels — Luxury Sri Lanka Tours",
    template: "%s | CeylonPrivé Travels",
  },
  description:
    "Experience Sri Lanka through the eyes of an elite private guide. Curated luxury tours, hidden temples, pristine beaches, and authentic cultural encounters.",
  keywords: ["Sri Lanka tours", "luxury travel", "private guide", "Ceylon"],
  openGraph: {
    title: "CeylonPrivé Travels",
    description: "Luxury private tours in Sri Lanka",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // Apply both font variables to the HTML element so Tailwind
      // can access them via the font-serif and font-sans utilities
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-navy text-cream font-sans antialiased">
        {children}
        {/* Toaster sits here so toast notifications work everywhere */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1E2640",
              color: "#F5F0E8",
              border: "1px solid #C9A84C",
            },
          }}
        />
      </body>
    </html>
  );
}
