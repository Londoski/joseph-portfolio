import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About — Joseph Chimaobi Egbuonu",
};

type ExperienceEntry = {
  role: string;
  company: string | null;
  period: string | null;
  description: string;
};

function parseExperience(raw: string | null | undefined): ExperienceEntry[] {
  if (!raw) return [];
  const blocks = raw
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block) => {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const first = lines[0] ?? "";
    let role = first;
    let company: string | null = null;

    const sepMatch = first.match(/^(.+?)\s+(?:—|–|\||-)\s+(.+)$/);
    if (sepMatch) {
      role = sepMatch[1].trim();
      company = sepMatch[2].trim();
    }

    let period: string | null = null;
    let descStart = 1;

    if (lines[1] && looksLikePeriod(lines[1])) {
      period = lines[1];
      descStart = 2;
    }

    const description = lines.slice(descStart).join(" ");

    return { role, company, period, description };
  });
}

function looksLikePeriod(s: string): boolean {
  if (s.length > 40) return false;
  return (
    /\d{4}/.test(s) ||
    /present|ongoing|current|previous|past/i.test(s)
  );
}

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

  const experience = parseExperience(settings?.aboutExperience);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 lg:px-8 py-12 md:py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
        About
      </p>
      <h1 className="text-4xl md:text-7xl font-bold text-base leading-[0.95] mb-12 md:mb-16 break-words">
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
        </div>

        <div className="lg:col-span-2 space-y-6">
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

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-8 md:mb-10">
            <p className="text-xs uppercase tracking-widest text-primary">
              Experience
            </p>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <div className="space-y-4 md:space-y-6">
            {experience.map((exp, i) => (
              <article
                key={i}
                className="group relative bg-surface border border-base rounded-2xl p-6 md:p-8 transition-all hover:border-[var(--color-primary)]"
              >
                {/* Left accent bar */}
                <span className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r bg-primary opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-6 mb-3">
                  <div className="min-w-0">
                    <h3 className="text-lg md:text-xl font-semibold text-base leading-snug">
                      {exp.role}
                    </h3>
                    {exp.company && (
                      <p className="text-sm text-primary font-medium mt-1">
                        {exp.company}
                      </p>
                    )}
                  </div>

                  {exp.period && (
                    <span className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-muted bg-base border border-base rounded-full px-3 py-1.5 self-start whitespace-nowrap flex-shrink-0">
                      {exp.period}
                    </span>
                  )}
                </div>

                {exp.description && (
                  <p className="text-sm md:text-base text-muted leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <p className="text-xs uppercase tracking-widest text-primary">
              Skills
            </p>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>
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

      {/* TOOLS */}
      {tools.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <p className="text-xs uppercase tracking-widest text-primary">
              Tools & Software
            </p>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>
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

      {/* CTA */}
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