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
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category || "All";

  const [projects, allProjects] = await Promise.all([
    prisma.project.findMany({
      where: {
        published: true,
        ...(activeCategory !== "All" ? { category: activeCategory } : {}),
      },
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
      <header className="mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
          Portfolio
        </p>
        <h1 className="text-5xl md:text-7xl font-bold text-base leading-[0.95]">
          Selected Work
        </h1>
      </header>

      <WorkFilter categories={categories} active={activeCategory} />

      {projects.length === 0 ? (
        <p className="text-muted mt-16">No projects available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
