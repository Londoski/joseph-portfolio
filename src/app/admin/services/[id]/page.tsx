import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "@/components/admin/ServiceForm";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await prisma.service.findUnique({ where: { id } });
  if (!s) notFound();
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-base mb-6">Edit Service</h1>
      <ServiceForm
        initial={{
          id: s.id,
          title: s.title,
          description: s.description,
          icon: s.icon ?? "",
          order: s.order,
          published: s.published,
        }}
      />
    </div>
  );
}