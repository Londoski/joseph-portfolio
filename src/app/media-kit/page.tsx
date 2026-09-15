import { prisma } from "@/lib/prisma";
import { MediaKitDownload } from "@/components/public/MediaKitDownload";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Media Kit — Joseph Chimaobi Egbuonu",
  description: "Portfolio summary, services, and selected work.",
};

export default async function MediaKitPage() {
  const [settings, projects, services, clients, testimonials] =
    await Promise.all([
      prisma.siteSettings.findFirst(),
      prisma.project.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        take: 6,
      }),
      prisma.service.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
      prisma.clientLogo.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
      prisma.testimonial.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        take: 3,
      }),
    ]);

  let skills: string[] = [];
  let tools: string[] = [];
  try {
    skills = settings?.aboutSkills ? JSON.parse(settings.aboutSkills) : [];
  } catch {}
  try {
    tools = settings?.aboutTools ? JSON.parse(settings.aboutTools) : [];
  } catch {}

  return (
    <main className="media-kit bg-white text-black">
      <MediaKitDownload />

      {/* PAGE 1 — COVER */}
      <section className="media-page" style={{ pageBreakAfter: "always" }}>
        <div className="page-content cover">
          <div className="cover-inner">
            <p className="cover-eyebrow">MEDIA KIT</p>

            <h1 className="cover-title">
              {settings?.aboutName ?? "Joseph Chimaobi Egbuonu"}
            </h1>

            <p className="cover-subtitle">
              {settings?.aboutHeadline ??
                "Cinematographer & Creative Director"}
            </p>

            <div className="cover-accent" />

            <p className="cover-intro">
              {settings?.aboutBio ||
                "Creative professional specializing in cinematography, videography and video editing."}
            </p>

            <div className="cover-contact">
              {settings?.contactEmail && (
                <p>
                  <strong>Email:</strong> {settings.contactEmail}
                </p>
              )}
              {settings?.contactPhone && (
                <p>
                  <strong>Phone:</strong> {settings.contactPhone}
                </p>
              )}
              {settings?.aboutLocation && (
                <p>
                  <strong>Based in:</strong> {settings.aboutLocation}
                </p>
              )}
              <p>
                <strong>Website:</strong> joseph-portfolio-kohl.vercel.app
              </p>
            </div>

            <p className="cover-footer">
              © {new Date().getFullYear()} {settings?.aboutName ??
                "Joseph Chimaobi Egbuonu"}
            </p>
          </div>
        </div>
      </section>

      {/* PAGE 2 — ABOUT + SERVICES */}
      <section className="media-page" style={{ pageBreakAfter: "always" }}>
        <div className="page-content">
          <p className="page-eyebrow">01 — ABOUT</p>
          <h2 className="page-title">
            {settings?.aboutHeadline ?? "Creative Director & Cinematographer"}
          </h2>

          <p className="body-text">
            {settings?.aboutBio ||
              "Creative professional specializing in cinematography, videography and video editing."}
          </p>

          {settings?.aboutExperience && (
            <>
              <p className="section-label">Experience</p>
              <p className="body-text">{settings.aboutExperience}</p>
            </>
          )}

          <div className="two-col">
            {skills.length > 0 && (
              <div>
                <p className="section-label">Core Skills</p>
                <ul className="skill-list">
                  {skills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {tools.length > 0 && (
              <div>
                <p className="section-label">Tools & Software</p>
                <ul className="skill-list">
                  {tools.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {services.length > 0 && (
            <>
              <p className="page-eyebrow" style={{ marginTop: "48px" }}>
                02 — SERVICES
              </p>
              <h2 className="page-title">What I Offer</h2>

              <div className="services-grid">
                {services.map((s) => (
                  <div key={s.id} className="service-item">
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* PAGE 3 — SELECTED WORK */}
      <section className="media-page" style={{ pageBreakAfter: "always" }}>
        <div className="page-content">
          <p className="page-eyebrow">03 — SELECTED WORK</p>
          <h2 className="page-title">Recent Projects</h2>

          <div className="projects-grid">
            {projects.map((p) => (
              <div key={p.id} className="project-item">
                <p className="project-category">{p.category}</p>
                <h3 className="project-title">{p.title}</h3>
                {p.client && (
                  <p className="project-meta">
                    <strong>Client:</strong> {p.client}
                  </p>
                )}
                {p.year && (
                  <p className="project-meta">
                    <strong>Year:</strong> {p.year}
                  </p>
                )}
                {p.role && (
                  <p className="project-meta">
                    <strong>Role:</strong> {p.role}
                  </p>
                )}
                <p className="project-description">
                  {p.description.slice(0, 200)}
                  {p.description.length > 200 ? "..." : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAGE 4 — CLIENTS + TESTIMONIALS */}
      <section className="media-page">
        <div className="page-content">
          {clients.length > 0 && (
            <>
              <p className="page-eyebrow">04 — CLIENTS</p>
              <h2 className="page-title">Brands I&apos;ve Worked With</h2>

              <div className="clients-grid">
                {clients.map((c) => (
                  <div key={c.id} className="client-item">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.logoUrl} alt={c.name} />
                    <p>{c.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {testimonials.length > 0 && (
            <>
              <p className="page-eyebrow" style={{ marginTop: "48px" }}>
                05 — TESTIMONIALS
              </p>
              <h2 className="page-title">What Clients Say</h2>

              <div className="testimonials-list">
                {testimonials.map((t) => (
                  <blockquote key={t.id} className="testimonial-item">
                    <p className="testimonial-quote">&ldquo;{t.content}&rdquo;</p>
                    <footer className="testimonial-author">
                      <strong>{t.clientName}</strong>
                      {t.role && t.company && (
                        <span>
                          {" — "}
                          {t.role}, {t.company}
                        </span>
                      )}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </>
          )}

          <div className="end-cta">
            <p>Let&apos;s create something together.</p>
            <p className="end-email">
              {settings?.contactEmail ?? "josephchimaobi28@gmail.com"}
            </p>
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: MEDIA_KIT_STYLES,
        }}
      />
    </main>
  );
}

const MEDIA_KIT_STYLES = `
  .media-kit {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #111;
    background: #fff;
  }

  .media-kit .media-page {
    position: relative;
    background: #fff;
  }

  .media-kit .page-content {
    max-width: 820px;
    margin: 0 auto;
    padding: 80px 60px;
  }

  .media-kit .cover {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px;
  }

  .media-kit .cover-inner {
    max-width: 640px;
  }

  .media-kit .cover-eyebrow {
    font-size: 11px;
    letter-spacing: 0.35em;
    font-weight: 700;
    color: #E87A2D;
    margin-bottom: 32px;
  }

  .media-kit .cover-title {
    font-size: 52px;
    font-weight: 800;
    line-height: 1.05;
    margin: 0 0 12px;
    letter-spacing: -0.02em;
  }

  .media-kit .cover-subtitle {
    font-size: 18px;
    color: #666;
    margin: 0 0 32px;
    font-weight: 500;
  }

  .media-kit .cover-accent {
    width: 64px;
    height: 4px;
    background: #E87A2D;
    margin-bottom: 32px;
  }

  .media-kit .cover-intro {
    font-size: 16px;
    line-height: 1.7;
    color: #333;
    margin: 0 0 40px;
  }

  .media-kit .cover-contact {
    font-size: 13px;
    color: #555;
    line-height: 1.9;
    padding: 24px 0;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
  }

  .media-kit .cover-contact p {
    margin: 0;
  }

  .media-kit .cover-contact strong {
    color: #111;
    font-weight: 600;
    display: inline-block;
    min-width: 90px;
  }

  .media-kit .cover-footer {
    font-size: 11px;
    color: #999;
    margin-top: 40px;
    letter-spacing: 0.05em;
  }

  .media-kit .page-eyebrow {
    font-size: 11px;
    letter-spacing: 0.3em;
    font-weight: 700;
    color: #E87A2D;
    margin-bottom: 16px;
  }

  .media-kit .page-title {
    font-size: 34px;
    font-weight: 800;
    line-height: 1.15;
    margin: 0 0 28px;
    letter-spacing: -0.015em;
  }

  .media-kit .body-text {
    font-size: 14px;
    line-height: 1.75;
    color: #333;
    margin: 0 0 24px;
  }

  .media-kit .section-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    font-weight: 700;
    color: #999;
    text-transform: uppercase;
    margin: 24px 0 12px;
  }

  .media-kit .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    margin-top: 24px;
  }

  .media-kit .skill-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .media-kit .skill-list li {
    font-size: 13px;
    padding: 6px 0;
    border-bottom: 1px solid #f0f0f0;
    color: #333;
  }

  .media-kit .services-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 8px;
  }

  .media-kit .service-item {
    padding: 20px;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    break-inside: avoid;
  }

  .media-kit .service-item h3 {
    font-size: 15px;
    font-weight: 700;
    margin: 0 0 8px;
    color: #111;
  }

  .media-kit .service-item p {
    font-size: 12px;
    line-height: 1.6;
    color: #666;
    margin: 0;
  }

  .media-kit .projects-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 8px;
  }

  .media-kit .project-item {
    padding: 20px;
    border-left: 3px solid #E87A2D;
    break-inside: avoid;
  }

  .media-kit .project-category {
    font-size: 10px;
    letter-spacing: 0.15em;
    font-weight: 700;
    color: #E87A2D;
    text-transform: uppercase;
    margin: 0 0 8px;
  }

  .media-kit .project-title {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 12px;
    color: #111;
    line-height: 1.3;
  }

  .media-kit .project-meta {
    font-size: 11px;
    color: #888;
    margin: 2px 0;
  }

  .media-kit .project-meta strong {
    color: #444;
  }

  .media-kit .project-description {
    font-size: 12px;
    line-height: 1.65;
    color: #555;
    margin: 12px 0 0;
  }

  .media-kit .clients-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 8px;
  }

  .media-kit .client-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    break-inside: avoid;
  }

  .media-kit .client-item img {
    max-width: 100%;
    max-height: 48px;
    object-fit: contain;
    margin-bottom: 12px;
  }

  .media-kit .client-item p {
    font-size: 10px;
    color: #666;
    margin: 0;
    text-align: center;
    letter-spacing: 0.05em;
  }

  .media-kit .testimonials-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 8px;
  }

  .media-kit .testimonial-item {
    margin: 0;
    padding: 20px 24px;
    border-left: 3px solid #E87A2D;
    background: #fafafa;
    break-inside: avoid;
  }

  .media-kit .testimonial-quote {
    font-size: 13px;
    line-height: 1.7;
    color: #333;
    font-style: italic;
    margin: 0 0 12px;
  }

  .media-kit .testimonial-author {
    font-size: 11px;
    color: #666;
    font-style: normal;
  }

  .media-kit .testimonial-author strong {
    color: #111;
    font-weight: 700;
  }

  .media-kit .end-cta {
    margin-top: 64px;
    padding-top: 32px;
    border-top: 2px solid #111;
    text-align: center;
  }

  .media-kit .end-cta p {
    font-size: 16px;
    color: #333;
    margin: 0 0 8px;
  }

  .media-kit .end-email {
    font-size: 14px !important;
    color: #E87A2D !important;
    font-weight: 700;
  }

  /* Print styles */
  @media print {
    @page {
      margin: 0;
      size: A4;
    }

    body {
      background: #fff !important;
    }

    .no-print {
      display: none !important;
    }

    .media-page {
      page-break-after: always;
      break-after: page;
    }

    .media-page:last-child {
      page-break-after: auto;
      break-after: auto;
    }

    .cover {
      min-height: 100vh;
    }
  }
`;