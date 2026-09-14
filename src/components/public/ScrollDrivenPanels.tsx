"use client";

import { useEffect, useRef, useState } from "react";

export type Panel = {
  id: string;
  eyebrow?: string;
  title: string;
  body: string;
};

export function ScrollDrivenPanels({ panels }: { panels: Panel[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [maxX, setMaxX] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Measure horizontal overflow to set section height
  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const track = container.querySelector("[data-track]") as HTMLElement | null;
      if (!track) return;
      const needed = Math.max(0, track.scrollWidth - window.innerWidth);
      setMaxX(needed);
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 300);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [panels.length]);

  // Compute scroll progress
  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = container.getBoundingClientRect();
      const total = container.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;

      if (scrolled < -50 || scrolled > total + 50) {
        setInView(false);
      } else {
        setInView(true);
        setProgress(Math.max(0, Math.min(1, scrolled / total)));
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, maxX]);

  if (reduced) {
    return (
      <section className="py-24 overflow-hidden">
        <div className="flex gap-6 overflow-x-auto px-6">
          {panels.map((p) => (
            <GlassPanel key={p.id} panel={p} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: "calc(100vh + " + maxX + "px)" }}
    >
      {inView && (
        <div
          className="fixed top-0 left-0 right-0 h-screen z-20 overflow-hidden flex items-center"
          style={{
            // Nice dark gradient + subtle orange glow so frosted glass is visible
            background:
              "radial-gradient(circle at 20% 30%, rgba(232,122,45,0.14), transparent 45%), radial-gradient(circle at 80% 70%, rgba(232,122,45,0.08), transparent 50%), #0A0A0A",
          }}
        >
          {/* Grid pattern for extra depth */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          <div
            data-track
            className="flex gap-6 px-6 lg:px-8 will-change-transform"
            style={{
              transform:
                "translate3d(" + -progress * maxX + "px, 0, 0)",
              transition: "transform 80ms linear",
            }}
          >
            {panels.map((p) => (
              <GlassPanel key={p.id} panel={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function GlassPanel({ panel }: { panel: Panel }) {
  return (
    <article
      className="flex-shrink-0 w-[80vw] sm:w-[62vw] md:w-[46vw] lg:w-[34vw] xl:w-[28vw] rounded-3xl p-8 md:p-10 border"
      style={{
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        borderColor: "rgba(255,255,255,0.14)",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {panel.eyebrow && (
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4">
          {panel.eyebrow}
        </p>
      )}
      <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">
        {panel.title}
      </h3>
      <p className="text-sm md:text-base text-white/70 leading-relaxed">
        {panel.body}
      </p>
    </article>
  );
}