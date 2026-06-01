import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Brand */}
        <div className="mb-16">
          <Link href="/" className="inline-block">
            <div className="font-serif text-2xl font-light tracking-[0.15em] text-gradient-gold mb-1">
              CeylonPrivé
            </div>
            <div className="text-[9px] tracking-[0.4em] text-cream-dark uppercase font-sans">
              Travels
            </div>
          </Link>
        </div>

        {/* Decorative number */}
        <div className="font-serif text-[10rem] leading-none text-gold/10 font-light select-none mb-0">
          404
        </div>

        {/* Message */}
        <div className="-mt-4 mb-10">
          <h1 className="font-serif text-3xl text-cream font-light mb-4">
            Page Not Found
          </h1>
          <p className="text-cream-dark font-sans font-light leading-relaxed">
            Like a hidden temple in the Sri Lankan highlands, this page
            doesn&apos;t seem to exist. Let us guide you back.
          </p>
        </div>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-12 bg-gold/30" />
          <div className="w-1 h-1 bg-gold rotate-45" />
          <div className="h-px w-12 bg-gold/30" />
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-block px-10 py-4 bg-gold text-navy text-sm tracking-[0.2em] uppercase font-sans font-medium hover:bg-gold-light transition-all duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
