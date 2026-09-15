import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About — Joseph Chimaobi Egbuonu",
};

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
    <div className="w-full max-w-6xl mx-auto px-6 lg:px-8 py-12 md:py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
        About
      </p>
      <h1 className="text-4xl md:text-7xl font-bold text-base leading-[0.95] mb-12 md:mb-16">
        {settings?.aboutName ?? "Joseph Chimaobi Egbuonu"}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 mb-16 md:mb-20">
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-base">
            {settings?.aboutHeadline ?? "Creative Director & Cinematographer"}
          </h2>
          <p className="text-base leading-relaxed whitespace-pre-line text-muted">
            {settings?.aboutBio ||
              "I am a creative professional specializing in cinematography, videography and video editing."}
          </p>

          {settings?.aboutExperience && (
            <>
              <h3 className="text-xs uppercase tracking-widest text-primary pt-6">
                Experience
              </h3>
              <p className="text-base leading-relaxed whitespace-pre-line text-muted">
                {settings.aboutExperience}
              </p>
            </>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Profile Image */}
          <div className="relative aspect-square bg-surface border border-base rounded-2xl overflow-hidden">
            {settings?.aboutImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.aboutImage}
                alt={settings.aboutName ?? "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted text-sm">
                Profile Image
              </div>
            )}
          </div>

          <div className="space-y-4 text-sm">
            {settings?.aboutLocation && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">
                  Location
                </p>
                <p className="text-base mt-1">{settings.aboutLocation}</p>
              </div>
            )}
            {settings?.aboutAvailability && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">
                  Availability
                </p>
                <p className="text-base mt-1">{settings.aboutAvailability}</p>
              </div>
            )}
          </div>
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
            Tools & Software
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

      <section className="bg-surface border border-base rounded-2xl p-8 md:p-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-base mb-4">
          Want to work together?
        </h2>
        <Link
          href="/contact"
          prefetch={true}
          className="inline-block bg-primary text-white font-semibold px-7 py-3.5 rounded-full transition-all hover:shadow-[0_0_20px_rgba(232,122,45,0.4)]"
        >
          Get in Touch
        </Link>
      </section>
    </div>
  );
}