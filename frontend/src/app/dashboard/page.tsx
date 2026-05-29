"use client";

import { Mail, Image as ImageIcon, Star } from "lucide-react";
import Link from "next/link"; // 1. Import Link

export default function DashboardOverviewPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-serif text-4xl text-cream font-light">
          Dashboard Overview
        </h1>
        <p className="text-cream-dark font-sans font-light text-sm mt-1">
          Welcome back to your CeylonPrivé Guide Dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Enquiries Card wrapped in Link */}
        <Link
          href="/dashboard/contacts"
          className="block border border-gold/10 bg-navy-light p-6 space-y-2 hover:border-gold/30 transition-colors cursor-pointer"
        >
          <div className="flex justify-between text-gold">
            <span className="text-xs uppercase tracking-widest font-sans">
              Enquiries
            </span>
            <Mail size={18} />
          </div>
          <p className="font-serif text-2xl text-cream">Manage Submissions</p>
        </Link>

        {/* Gallery Card wrapped in Link */}
        <Link
          href="/dashboard/gallery"
          className="block border border-gold/10 bg-navy-light p-6 space-y-2 hover:border-gold/30 transition-colors cursor-pointer"
        >
          <div className="flex justify-between text-gold">
            <span className="text-xs uppercase tracking-widest font-sans">
              Gallery
            </span>
            <ImageIcon size={18} />
          </div>
          <p className="font-serif text-2xl text-cream">Media Assets</p>
        </Link>

        {/* Reviews Card wrapped in Link */}
        <Link
          href="/dashboard/reviews"
          className="block border border-gold/10 bg-navy-light p-6 space-y-2 hover:border-gold/30 transition-colors cursor-pointer"
        >
          <div className="flex justify-between text-gold">
            <span className="text-xs uppercase tracking-widest font-sans">
              Reviews
            </span>
            <Star size={18} />
          </div>
          <p className="font-serif text-2xl text-cream">Customer Feedback</p>
        </Link>
      </div>
    </div>
  );
}