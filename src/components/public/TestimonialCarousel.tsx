"use client";

import { useEffect, useState, useCallback } from "react";
import { Quote } from "lucide-react";

type Testimonial = {
  id: string;
  clientName: string;
  company: string | null;
  role: string | null;
  content: string;
  image: string | null;
};

export function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [active, setActive] = useState(0);
  const count = testimonials.length;

  const next = useCallback(() => {
    setActive((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, count]);

  if (count === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 lg:px-8 py-24">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
          Testimonials
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-base">
          What Clients Say
        </h2>
      </div>

      <div className="overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ transform: "translateX(-" + active * 100 + "%)" }}
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="w-full flex-shrink-0 bg-surface border border-base rounded-3xl p-8 md:p-12"
            >
              <Quote
                size={32}
                className="text-primary opacity-40 mb-6"
                strokeWidth={2.5}
              />

              <p className="text-lg md:text-2xl leading-relaxed text-base font-light italic min-h-[140px] md:min-h-[160px]">
                {"\u201C" + t.content + "\u201D"}
              </p>

              <div className="mt-8 pt-6 border-t border-base flex items-center gap-4">
                {t.image ? (
                  <img
                    src={t.image}
                    alt={t.clientName}
                    className="w-14 h-14 rounded-full object-cover border border-base"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[rgba(232,122,45,0.15)] border border-[rgba(232,122,45,0.35)] flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-lg">
                      {t.clientName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-base font-semibold text-base">
                    {t.clientName}
                  </p>
                  <p className="text-xs text-muted">
                    {[t.role, t.company].filter(Boolean).join(" \u00B7 ") ||
                      "Client"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}