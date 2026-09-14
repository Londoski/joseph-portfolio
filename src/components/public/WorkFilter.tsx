"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

export function WorkFilter({
  categories,
  active,
}: {
  categories: string[];
  active: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  // Debounced URL sync
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      const trimmed = query.trim();
      if (trimmed) next.set("q", trimmed);
      else next.delete("q");
      const qs = next.toString();
      router.replace(`/work${qs ? `?${qs}` : ""}`, { scroll: false });
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function buildCategoryHref(cat: string) {
    const next = new URLSearchParams();
    if (cat !== "All") next.set("category", cat);
    if (query.trim()) next.set("q", query.trim());
    const qs = next.toString();
    return `/work${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, clients, categories…"
          className="w-full pl-11 pr-11 py-3 rounded-full bg-surface border border-base outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(232,122,45,0.15)] transition-all text-sm"
          aria-label="Search projects"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 border-b border-base pb-6">
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <Link
              key={cat}
              href={buildCategoryHref(cat)}
              scroll={false}
              className={`text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                isActive
                  ? "bg-primary text-white border-[var(--color-primary)]"
                  : "border-base text-muted hover:text-primary hover:border-[var(--color-primary)] hover:bg-[rgba(232,122,45,0.08)]"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>
    </div>
  );
}