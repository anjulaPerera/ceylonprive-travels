import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import ToasterProvider from "@/components/layout/ToasterProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

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
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-navy text-cream font-sans antialiased dark:bg-navy dark:text-cream light:bg-cream light:text-navy transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
