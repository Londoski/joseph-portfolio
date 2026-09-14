import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div className="p-6 lg:p-10 w-full">
      <h1 className="text-3xl font-bold text-base mb-8">Edit Project</h1>
      <ProjectForm
        initial={{
          id: project.id,
          title: project.title,
          description: project.description,
          category: project.category,
          client: project.client ?? "",
          year: project.year ? String(project.year) : "",
          role: project.role ?? "",
          thumbnail: project.thumbnail ?? "",
          videoUrl: project.videoUrl ?? "",
          gallery: project.gallery ?? "",
          featured: project.featured,
          published: project.published,
          order: project.order,
        }}
      />
    </div>
  );
}