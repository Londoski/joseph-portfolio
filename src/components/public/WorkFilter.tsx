"use client";

import Link from "next/link";

export function WorkFilter({
  categories,
  active,
}: {
  categories: string[];
  active: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-base pb-6">
      {categories.map((cat) => {
        const isActive = cat === active;
        const href =
          cat === "All"
            ? "/work"
            : `/work?category=${encodeURIComponent(cat)}`;
        return (
          <Link
            key={cat}
            href={href}
            className={`text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-colors ${
              isActive
                ? "bg-primary text-white border-[var(--color-primary)]"
                : "border-base text-muted hover:text-base hover:border-[var(--color-primary)]"
            }`}
          >
            {cat}
          </Link>
        );
      })}
    </div>
  );
}
