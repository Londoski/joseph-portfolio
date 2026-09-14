import Link from "next/link";
import Image from "next/image";

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
      className="group block bg-surface border border-base rounded-2xl overflow-hidden hover:border-[var(--color-primary)] transition-colors"
    >
      <div className="relative aspect-video bg-black overflow-hidden">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
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
