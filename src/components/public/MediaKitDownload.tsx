"use client";

import { Download, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function MediaKitDownload() {
  return (
    <div className="no-print sticky top-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Site
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-full text-sm hover:shadow-[0_0_20px_rgba(232,122,45,0.35)] transition-all"
        >
          <Download size={14} />
          Download PDF
        </button>
      </div>
    </div>
  );
}