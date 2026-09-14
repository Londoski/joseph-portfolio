import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [projects, published, drafts, services, messages, featured] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.project.count({ where: { published: false } }),
      prisma.service.count(),
      prisma.message.count({ where: { read: false } }),
      prisma.project.count({ where: { featured: true } }),
    ]);

  const stats = [
    { label: "Total Projects", value: projects },
    { label: "Published", value: published },
    { label: "Drafts", value: drafts },
    { label: "Featured", value: featured },
    { label: "Services", value: services },
    { label: "Unread Messages", value: messages },
  ];

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-base">Dashboard</h1>
        <p className="text-muted mt-1">Overview of your portfolio</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface border border-base rounded-2xl p-6">
            <p className="text-muted text-xs uppercase tracking-widest">{s.label}</p>
            <p className="text-3xl font-bold text-primary mt-2">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}