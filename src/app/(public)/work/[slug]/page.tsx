import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project || !project.published) notFound();

  const all = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    select: { slug: true, title: true },
  });

  const idx = all.findIndex((p) => p.slug === project.slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  let gallery: string[] = [];
  try {
    gallery = project.gallery ? JSON.parse(project.gallery) : [];
  } catch {
    gallery = [];
  }

  return (
    <article className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
      <Link href="/work" className="text-sm text-muted hover:text-primary">
        Back to Work
      </Link>

      <header className="mt-8 mb-12">
        <div className="flex items-center gap-3 text-xs text-muted uppercase tracking-widest mb-4">
          <span className="text-primary">{project.category}</span>
          {project.year && <span>· {project.year}</span>}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-base leading-tight">
          {project.title}
        </h1>
      </header>

      <div className="relative aspect-video bg-surface border border-base rounded-2xl overflow-hidden mb-12">
        {project.videoUrl ? (
          <video
            src={project.videoUrl}
            controls
            playsInline
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />
        ) : project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted">
            No media available
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div className="md:col-span-2">
          <h2 className="text-xs uppercase tracking-widest text-primary mb-4">
            About this project
          </h2>
          <p className="text-base leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>

        <aside className="space-y-6">
          {project.client && (
            <div>
              <p className="text-xs uppercase tracking-widest text-muted mb-1">Client</p>
              <p className="text-base">{project.client}</p>
            </div>
          )}
          {project.role && (
            <div>
              <p className="text-xs uppercase tracking-widest text-muted mb-1">Role</p>
              <p className="text-base">{project.role}</p>
            </div>
          )}
          {project.year && (
            <div>
              <p className="text-xs uppercase tracking-widest text-muted mb-1">Year</p>
              <p className="text-base">{project.year}</p>
            </div>
          )}
        </aside>
      </div>

      {gallery.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-widest text-primary mb-6">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gallery.map((src, i) => (
              <div key={i} className="relative aspect-video bg-surface border border-base rounded-xl overflow-hidden">
                <Image src={src} alt={project.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            ))}
          </div>
        </section>
      )}

      <nav className="border-t border-base pt-8 flex justify-between gap-4">
        {prev ? (
          <Link href={`/work/${prev.slug}`} className="group max-w-[45%]">
            <p className="text-xs uppercase tracking-widest text-muted mb-1">Previous</p>
            <p className="text-base group-hover:text-primary">{prev.title}</p>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link href={`/work/${next.slug}`} className="group text-right max-w-[45%] ml-auto">
            <p className="text-xs uppercase tracking-widest text-muted mb-1">Next</p>
            <p className="text-base group-hover:text-primary">{next.title}</p>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}