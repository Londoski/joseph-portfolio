"use client";

import { InstallPrompt } from "@/components/admin/InstallPrompt";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Quote,
  Inbox,
  Home,
  User,
  Share2,
  Link2,
  Settings as SettingsIcon,
  Palette,
  Globe,
  LogOut,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/share-links", label: "Share Links", icon: Link2 },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/social", label: "Social Links", icon: Share2 },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
  { href: "/admin/theme", label: "Theme", icon: Palette },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-base flex">
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-surface border-b border-base flex items-center justify-between px-4 h-14">
        <Link href="/admin" className="text-base font-bold text-primary">
          JCE
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-base transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-base transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-base transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 w-64 h-screen bg-surface border-r border-base flex flex-col transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-5 border-b border-base">
          <Link href="/" className="text-lg font-bold text-primary">
            JCE
          </Link>
          <p className="text-[10px] uppercase tracking-widest text-muted mt-0.5">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-all duration-150 ${
                  active
                    ? "bg-[rgba(232,122,45,0.12)] text-primary font-bold shadow-[inset_0_0_0_1px_rgba(232,122,45,0.4)]"
                    : "text-muted font-bold hover:text-primary hover:bg-[rgba(232,122,45,0.08)] hover:shadow-[inset_0_0_0_1px_rgba(232,122,45,0.35)] hover:shadow-[0_0_20px_rgba(232,122,45,0.15)]"
                }`}
              >
                <span
                  className={`absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-primary transition-all ${
                    active
                      ? "opacity-100 shadow-[0_0_8px_rgba(232,122,45,0.8)]"
                      : "opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_8px_rgba(232,122,45,0.8)]"
                  }`}
                />
                <Icon
                  size={18}
                  strokeWidth={2.2}
                  className={`flex-shrink-0 transition-all ${
                    active
                      ? "text-primary drop-shadow-[0_0_6px_rgba(232,122,45,0.7)]"
                      : "text-muted group-hover:text-primary group-hover:drop-shadow-[0_0_6px_rgba(232,122,45,0.7)]"
                  }`}
                />
                <span
                  style={
                    active
                      ? { textShadow: "0 0 12px rgba(232,122,45,0.6)" }
                      : undefined
                  }
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-base space-y-1">
          <Link
            href="/"
            className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-muted transition-all duration-150 hover:text-primary hover:bg-[rgba(232,122,45,0.08)] hover:shadow-[inset_0_0_0_1px_rgba(232,122,45,0.35)]"
          >
            <Globe
              size={14}
              strokeWidth={2.2}
              className="group-hover:drop-shadow-[0_0_6px_rgba(232,122,45,0.7)]"
            />
            View Site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full group flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-red-400 transition-all duration-150 hover:bg-red-500/10 hover:shadow-[inset_0_0_0_1px_rgba(239,68,68,0.4)] text-left"
          >
            <LogOut size={14} strokeWidth={2.2} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 pt-14 md:pt-0">{children}</main>
      <InstallPrompt />
    </div>
  );
}