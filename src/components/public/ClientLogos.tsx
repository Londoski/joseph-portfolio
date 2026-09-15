"use client";

import { useEffect, useState } from "react";

type Client = {
  id: string;
  name: string;
  logoUrl: string;
  website: string | null;
};

export function ClientLogos({ clients }: { clients: Client[] }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  if (clients.length === 0) return null;

  if (reduced) {
    return (
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            Trusted By
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-base">
            Brands I&apos;ve Worked With
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 justify-center flex-wrap">
          {clients.map((c) => (
            <LogoCard key={c.id} client={c} />
          ))}
        </div>
      </section>
    );
  }

  const doubled = [...clients, ...clients, ...clients];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full -translate-y-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(232,122,45,0.15), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full -translate-y-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(232,122,45,0.10), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Heading */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
          Trusted By
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-base">
          Brands I&apos;ve Worked With
        </h2>
        <p className="text-muted text-sm mt-4 max-w-xl mx-auto">
          Companies and creative teams I&apos;ve had the privilege to collaborate with.
        </p>
      </div>

      {/* Marquee viewport */}
      <div className="relative z-10">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 md:w-48 z-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, var(--bg) 0%, transparent 100%)",
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 md:w-48 z-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, var(--bg) 0%, transparent 100%)",
          }}
        />

        {/* Track */}
        <div className="clients-marquee-track flex gap-6">
          {doubled.map((c, i) => (
            <LogoCard key={c.id + "-" + i} client={c} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .clients-marquee-track {
          width: max-content;
          animation: clients-marquee-slide 30s linear infinite;
          will-change: transform;
        }

        @keyframes clients-marquee-slide {
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

function LogoCard({ client }: { client: Client }) {
  const Wrapper = client.website ? "a" : "div";
  const linkProps = client.website
    ? {
        href: client.website,
        target: "_blank",
        rel: "noreferrer noopener",
      }
    : {};

  return (
    <Wrapper
      {...(linkProps as Record<string, string>)}
      className="group flex-shrink-0 w-[180px] h-[110px] rounded-2xl border border-base flex items-center justify-center p-5 transition-all hover:border-[var(--color-primary)] hover:shadow-[0_0_24px_rgba(232,122,45,0.25)]"
      style={{
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={client.logoUrl}
        alt={client.name}
        className="max-w-full max-h-full object-contain opacity-95 transition-all duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </Wrapper>
  );
}