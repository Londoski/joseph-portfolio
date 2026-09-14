import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/public/ProjectCard";
import { WorkFilter } from "@/components/public/WorkFilter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Work — Joseph Chimaobi Egbuonu",
};

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category || "All";
  const query = (params.q || "").trim();

  const where: {
    published: boolean;
    category?: string;
    OR?: Array<Record<string, { contains: string; mode: "insensitive" }>>;
  } = { published: true };

  if (activeCategory !== "All") {
    where.category = activeCategory;
  }

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { client: { contains: query, mode: "insensitive" } },
      { category: { contains: query, mode: "insensitive" } },
      { role: { contains: query, mode: "insensitive" } },
    ];
  }

  const [projects, allProjects] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: { order: "asc" },
    }),
    prisma.project.findMany({
      where: { published: true },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const categories = ["All", ...allProjects.map((p) => p.category).sort()];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
          Portfolio
        </p>
        <h1 className="text-5xl md:text-7xl font-bold text-base leading-[0.95]">
          Selected Work
        </h1>
      </header>

      <WorkFilter categories={categories} active={activeCategory} />

      {/* Result count */}
      <div className="flex items-center justify-between mt-6 mb-6">
        <p className="text-xs uppercase tracking-widest text-muted">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
          {query && (
            <>
              {" "}for <span className="text-primary">&ldquo;{query}&rdquo;</span>
            </>
          )}
        </p>
        {(query || activeCategory !== "All") && (
          <a
            href="/work"
            className="text-xs uppercase tracking-widest text-muted hover:text-primary transition-colors"
          >
            Clear all
          </a>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="bg-surface border border-base rounded-2xl p-16 text-center">
          <p className="text-base text-base mb-2">No projects found</p>
          <p className="text-sm text-muted mb-6">
            Try a different keyword or category.
          </p>
          <a
            href="/work"
            className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-full text-sm"
          >
            View all work
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}