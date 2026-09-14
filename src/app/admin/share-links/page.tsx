"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  ExternalLink,
  Globe,
  Home,
  FolderKanban,
  User,
  Sparkles,
  Mail,
} from "lucide-react";

const PAGES = [
  { href: "/", label: "Home", icon: Home, desc: "Landing page with featured work" },
  { href: "/work", label: "Work", icon: FolderKanban, desc: "Full portfolio grid" },
  { href: "/about", label: "About", icon: User, desc: "Bio, skills, tools" },
  { href: "/services", label: "Services", icon: Sparkles, desc: "What you offer" },
  { href: "/contact", label: "Contact", icon: Mail, desc: "Get in touch form" },
];

export default function ShareLinksPage() {
  const [origin, setOrigin] = useState("");
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function copyMain() {
    await navigator.clipboard.writeText(origin);
    setCopiedMain(true);
    setTimeout(() => setCopiedMain(false), 2000);
  }

  async function copyPath(path: string) {
    await navigator.clipboard.writeText(`${origin}${path}`);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  }

  return (
    <div className="p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-base">Share Your Site</h1>
          <p className="text-muted text-sm mt-1">
            Copy a link to send to clients. Your portfolio is public — anyone with the link can view it.
          </p>
        </header>

        {/* Main URL card */}
        <div className="bg-surface border border-base rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[rgba(232,122,45,0.12)] border border-[rgba(232,122,45,0.35)] flex items-center justify-center">
              <Globe size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-base">Your Portfolio URL</h2>
              <p className="text-xs text-muted">Send this to clients and collaborators</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-base border border-base rounded-xl px-4 py-3">
            <span className="flex-1 font-mono text-sm text-base truncate">{origin}</span>
            <button
              onClick={copyMain}
              className="inline-flex items-center gap-2 text-xs text-muted hover:text-primary transition-colors flex-shrink-0 px-2"
              aria-label="Copy URL"
            >
              {copiedMain ? (
                <>
                  <Check size={14} className="text-green-400" />
                  <span className="text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
            <a
              href={origin}
              target="_blank"
              rel="noreferrer"
              className="text-muted hover:text-primary transition-colors flex-shrink-0"
              aria-label="Open in new tab"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Page links */}
        <div className="bg-surface border border-base rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-base">
            <h2 className="text-sm font-bold text-base">Individual Page Links</h2>
            <p className="text-xs text-muted mt-0.5">Share a direct link to a specific page</p>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {PAGES.map((page) => {
              const Icon = page.icon;
              const fullUrl = `${origin}${page.href}`;
              const isCopied = copiedPath === page.href;
              return (
                <div
                  key={page.href}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-base/40 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-base border border-base flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-base">{page.label}</p>
                    <p className="text-xs text-muted truncate">{page.desc}</p>
                  </div>

                  <div className="hidden sm:block flex-shrink-0">
                    <code className="text-xs text-muted bg-base px-2.5 py-1 rounded-md border border-base">
                      {page.href}
                    </code>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => copyPath(page.href)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-base transition-colors"
                      aria-label={`Copy ${page.label} link`}
                    >
                      {isCopied ? (
                        <Check size={15} className="text-green-400" />
                      ) : (
                        <Copy size={15} />
                      )}
                    </button>
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-base transition-colors"
                      aria-label={`Open ${page.label}`}
                    >
                      <ExternalLink size={15} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info footer */}
        <div className="mt-6 bg-[rgba(232,122,45,0.06)] border border-[rgba(232,122,45,0.25)] rounded-xl p-4">
          <p className="text-xs text-muted leading-relaxed">
            <span className="text-primary font-semibold">Tip:</span> When you add a new project from the admin, it will automatically appear on <Link href="/work" className="text-primary hover:underline">/work</Link> and on your homepage if you mark it as Featured.
          </p>
        </div>
      </div>
    </div>
  );
}