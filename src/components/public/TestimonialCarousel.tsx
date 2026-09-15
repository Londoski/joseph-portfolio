"use client";

import { useEffect, useState } from "react";
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
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  if (testimonials.length === 0) return null;

  // Static fallback for reduced motion
  if (reduced) {
    return (
      <section className="relative py-24 overflow-hidden w-full max-w-full">
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-base">
            What Clients Say
          </h2>
        </div>
        <div className="relative z-10 flex gap-6 overflow-x-auto px-6 pb-4">
          {testimonials.map((t) => (
            <GlassTestimonial key={t.id} t={t} />
          ))}
        </div>
      </section>
    );
  }

  const doubled = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="relative py-24 overflow-hidden w-full max-w-full">
      {/* Colorful background so glass has something to blur */}
      <DecorativeBackground />

      {/* Heading */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
          Testimonials
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-base">
          What Clients Say
        </h2>
      </div>

      {/* Marquee viewport */}
      <div className="relative z-10 overflow-hidden w-full max-w-full">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 md:w-48 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, var(--bg) 0%, transparent 100%)",
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 md:w-48 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, var(--bg) 0%, transparent 100%)",
          }}
        />

        {/* Sliding track */}
        <div className="marquee-track flex gap-6">
          {doubled.map((t, i) => (
            <GlassTestimonial key={t.id + "-" + i} t={t} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          width: max-content;
          animation: marquee-slide 30s linear infinite;
          will-change: transform;
        }

        @keyframes marquee-slide {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.3333%, 0, 0);
          }
        }
      `}</style>
    </section>
  );
}

function DecorativeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Big soft orange blob top-left */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(232,122,45,0.45), transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Big soft orange blob bottom-right */}
      <div
        className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(232,122,45,0.35), transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Small pink/warm accent center */}
      <div
        className="absolute top-1/3 left-1/2 w-[500px] h-[500px] rounded-full -translate-x-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(255,90,90,0.18), transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}

function GlassTestimonial({ t }: { t: Testimonial }) {
  return (
    <article
      className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[55vw] lg:w-[42vw] xl:w-[36vw] rounded-3xl p-6 md:p-10 border relative"
      style={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        borderColor: "rgba(255,255,255,0.18)",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Subtle top highlight */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.35), transparent)",
        }}
      />

      <Quote
        size={28}
        className="text-primary mb-4 md:mb-6"
        strokeWidth={2.5}
        style={{ filter: "drop-shadow(0 0 12px rgba(232,122,45,0.5))" }}
      />

      <p className="text-base md:text-xl leading-relaxed text-white font-light italic min-h-[140px] md:min-h-[200px]">
        {"\u201C" + t.content + "\u201D"}
      </p>

      <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-white/15 flex items-center gap-4">
        {t.image ? (
          <img
            src={t.image}
            alt={t.clientName}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border border-white/25 flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[rgba(232,122,45,0.25)] border border-[rgba(232,122,45,0.5)] flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold text-base md:text-lg">
              {t.clientName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm md:text-base font-semibold text-white truncate">
            {t.clientName}
          </p>
          <p className="text-xs text-white/70 truncate">
            {[t.role, t.company].filter(Boolean).join(" \u00B7 ") || "Client"}
          </p>
        </div>
      </div>
    </article>
  );
}