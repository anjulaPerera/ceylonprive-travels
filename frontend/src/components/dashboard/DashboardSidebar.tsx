"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  Star,
  Link2,
  Mail,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Gallery", href: "/dashboard/gallery", icon: Images },
  { label: "Reviews", href: "/dashboard/reviews", icon: Star },
  { label: "Review Links", href: "/dashboard/tokens", icon: Link2 },
  { label: "Enquiries", href: "/dashboard/contacts", icon: Mail },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-navy-light border-r border-gold/10 flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-gold/10">
        <Link href="/" className="block">
          <div className="font-serif text-xl font-light tracking-[0.15em] text-gradient-gold">
            CeylonPrivé
          </div>
          <div className="text-[9px] tracking-[0.4em] text-cream-dark uppercase font-sans font-light">
            Guide Dashboard
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gold/10">
        <p className="text-xs text-cream-dark/60 font-sans tracking-wide">
          Signed in as
        </p>
        <p className="text-sm text-cream font-sans font-medium truncate mt-0.5">
          {user?.name ?? "Guide"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-sans font-light transition-all duration-200",
                    isActive
                      ? "bg-gold/10 text-gold border-l-2 border-gold"
                      : "text-cream-dark hover:text-cream hover:bg-navy/50 border-l-2 border-transparent",
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gold/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-sm font-sans font-light text-cream-dark hover:text-red-400 transition-colors duration-200"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
