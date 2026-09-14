import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
        Services
      </p>
      <h1 className="text-5xl md:text-7xl font-bold text-base leading-[0.95] mb-6">
        What I Offer
      </h1>
      <p className="text-muted max-w-2xl mb-16">
        End-to-end creative production from concept to final delivery.
      </p>

      {services.length === 0 ? (
        <p className="text-muted">No services available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <div
              key={s.id}
              className="bg-surface border border-base rounded-2xl p-8 hover:border-[var(--color-primary)] transition-colors"
            >
              <p className="text-xs text-primary mb-4">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="text-xl font-semibold text-base mb-3">
                {s.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      )}

      <section className="mt-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-base mb-4">
          Have a project in mind?
        </h2>
        <Link
          href="/contact"
          className="inline-block bg-primary text-white font-semibold px-7 py-3.5 rounded-full"
        >
          Start a Project
        </Link>
      </section>
    </div>
  );
}
