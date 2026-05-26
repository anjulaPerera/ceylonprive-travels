import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Experience from "@/components/landing/Experience";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Experience />
      {/* Gallery, AI Planner, Reviews, Contact sections coming next */}
      <Footer />
    </main>
  );
}
