import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await prisma.testimonial.findUnique({ where: { id } });
  if (!t) notFound();
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-base mb-6">Edit Testimonial</h1>
      <TestimonialForm
        initial={{
          id: t.id,
          clientName: t.clientName,
          company: t.company ?? "",
          role: t.role ?? "",
          content: t.content,
          image: t.image ?? "",
          order: t.order,
          published: t.published,
        }}
      />
    </div>
  );
}