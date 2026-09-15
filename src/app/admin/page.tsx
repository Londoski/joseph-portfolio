import { prisma } from "@/lib/prisma";
import { EnableNotifications } from "@/components/admin/EnableNotifications";

export default async function DashboardPage() {
  const [projectStats, serviceCount, messageCount] = await Promise.all([
    prisma.project.groupBy({
      by: ["published", "featured"],
      _count: true,
    }),
    prisma.service.count(),
    prisma.message.count({ where: { read: false } }),
  ]);

  const total = projectStats.reduce((sum, g) => sum + g._count, 0);
  const published = projectStats
    .filter((g) => g.published)
    .reduce((sum, g) => sum + g._count, 0);
  const featured = projectStats
    .filter((g) => g.featured)
    .reduce((sum, g) => sum + g._count, 0);
  const drafts = total - published;
  const services = serviceCount;
  const messages = messageCount;

  const stats = [
    { label: "Total Projects", value: total },
    { label: "Published", value: published },
    { label: "Drafts", value: drafts },
    { label: "Featured", value: featured },
    { label: "Services", value: services },
    { label: "Unread Messages", value: messages },
  ];

  return (
    <div className="p-4 md:p-8">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-base">
          Dashboard
        </h1>
        <p className="text-muted mt-1 text-sm md:text-base">
          Overview of your portfolio
        </p>
      </header>

      <div className="mb-6">
        <EnableNotifications />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-surface border border-base rounded-2xl p-4 md:p-6"
          >
            <p className="text-muted text-[10px] md:text-xs uppercase tracking-widest">
              {s.label}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-primary mt-2">
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}