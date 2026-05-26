import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-light border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="font-serif text-3xl font-light tracking-[0.15em] text-gradient-gold mb-2">
              CeylonPrivé
            </div>
            <div className="text-[10px] tracking-[0.4em] text-cream-dark uppercase font-sans font-light mb-4">
              Travels
            </div>
            <p className="text-sm text-cream-dark font-light leading-relaxed max-w-xs">
              Elite private tours through Sri Lanka&apos;s most extraordinary
              landscapes, temples, and hidden gems.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg text-gold mb-6 tracking-wide">
              Explore
            </h4>
            <ul className="space-y-3">
              {["Experience", "Gallery", "AI Planner", "Reviews"].map(
                (item) => (
                  <li key={item}>
                    <a // 👈 Fixed the broken opening tag here
                      href={`#${item.toLowerCase().replace(" ", "-")}`}
                      className="text-sm text-cream-dark hover:text-gold transition-colors tracking-wide"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg text-gold mb-6 tracking-wide">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-cream-dark">
              <li className="flex items-center gap-2">
                <span>📍</span> Colombo, Sri Lanka
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span> hello@ceylonprive.com
              </li>
              <li className="flex items-center gap-2">
                <span>📱</span> +94 77 000 0000
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gold/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream-dark/60 tracking-widest">
            © {currentYear} CeylonPrivé Travels. All rights reserved.
          </p>
          <Link
            href="/admin/login"
            className="text-xs text-cream-dark/30 hover:text-cream-dark/60 transition-colors tracking-widest"
          >
            Guide Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
