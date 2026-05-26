import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Experience from "@/components/landing/Experience";
import GallerySection from "@/components/landing/GallerySection";
import AIPlanner from "@/components/landing/AIPlanner";
import ReviewsSection from "@/components/landing/ReviewsSection";
import ContactSection from "@/components/landing/ContactSection";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Experience />
      <GallerySection />
      <AIPlanner />
      <ReviewsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
