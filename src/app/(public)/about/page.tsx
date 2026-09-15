import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findFirst();

  let skills: string[] = [];
  let tools: string[] = [];
  try {
    skills = settings?.aboutSkills ? JSON.parse(settings.aboutSkills) : [];
  } catch {}
  try {
    tools = settings?.aboutTools ? JSON.parse(settings.aboutTools) : [];
  } catch {}

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 md:py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
        About
      </p>
      <h1 className="text-5xl md:text-7xl font-bold text-base leading-[0.95] mb-16">
        {settings?.aboutName ?? "Joseph Chimaobi Egbuonu"}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-20">
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-base">
            {settings?.aboutHeadline ?? "Creative Director & Cinematographer"}
          </h2>
          <p className="text-base leading-relaxed whitespace-pre-line text-muted">
            {settings?.aboutBio ?? "Creative professional."}
          </p>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-square bg-surface border border-base rounded-2xl overflow-hidden flex items-center justify-center">
            <p className="text-muted text-sm">Profile Image</p>
          </div>
          {settings?.aboutLocation && (
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">
                Location
              </p>
              <p className="text-base mt-1">{settings.aboutLocation}</p>
            </div>
          )}
        </div>
      </div>

      {skills.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-widest text-primary mb-6">
            Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((s) => (
              <span
                key={s}
                className="text-sm bg-surface border border-base rounded-full px-5 py-2"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {tools.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-widest text-primary mb-6">
            Tools
          </h2>
          <div className="flex flex-wrap gap-3">
            {tools.map((t) => (
              <span
                key={t}
                className="text-sm bg-surface border border-base rounded-full px-5 py-2"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="bg-surface border border-base rounded-2xl p-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-base mb-4">
          Want to work together?
        </h2>
        <Link
          href="/contact"
          className="inline-block bg-primary text-white font-semibold px-7 py-3.5 rounded-full"
        >
          Get in Touch
        </Link>
      </section>
    </div>
  );
}
