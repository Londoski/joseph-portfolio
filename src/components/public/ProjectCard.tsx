import Link from "next/link";

type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: number | null;
  thumbnail: string | null;
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      prefetch={true}
      className="group block bg-surface border border-base rounded-2xl overflow-hidden hover:border-[var(--color-primary)] transition-colors"
    >
      <div className="relative aspect-video bg-black overflow-hidden">
        {project.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.thumbnail}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-sm">
            No thumbnail
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-muted uppercase tracking-widest">
          <span className="text-primary">{project.category}</span>
          {project.year && <span>· {project.year}</span>}
        </div>
        <h3 className="mt-2 text-lg font-semibold text-base group-hover:text-primary transition-colors">
          {project.title}
        </h3>
      </div>
    </Link>
  );
}