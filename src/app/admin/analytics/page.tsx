"use client";

import { useEffect, useState } from "react";
import { Eye, TrendingUp, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Analytics = {
  totals: { allTime: number; today: number; week: number };
  topProjects: { id: string; title: string; slug: string; views: number }[];
  topPages: { path: string; views: number }[];
  days: { date: string; views: number }[];
};

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) setData(await res.json());
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-5xl animate-pulse space-y-6">
          <div className="h-8 w-48 bg-surface rounded-lg" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-surface rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 md:p-8 text-center text-muted">Failed to load analytics</div>
    );
  }

  const maxDaily = Math.max(...data.days.map((d) => d.views), 1);
  const maxProject = Math.max(...data.topProjects.map((p) => p.views), 1);
  const maxPage = Math.max(...data.topPages.map((p) => p.views), 1);

  return (
    <div className="p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <header className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-base">Analytics</h1>
            <p className="text-muted text-sm mt-0.5">
              Page views from the last 14 days
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={12} />
            Back to dashboard
          </Link>
        </header>

        {/* Totals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Eye size={18} />}
            label="All Time Views"
            value={data.totals.allTime}
          />
          <StatCard
            icon={<Calendar size={18} />}
            label="Today"
            value={data.totals.today}
          />
          <StatCard
            icon={<TrendingUp size={18} />}
            label="Last 7 Days"
            value={data.totals.week}
          />
        </div>

        {/* Chart */}
        <div className="bg-surface border border-base rounded-2xl p-6 mb-6">
          <h2 className="text-xs uppercase tracking-widest text-muted mb-5">
            Daily views — last 14 days
          </h2>

          {data.days.every((d) => d.views === 0) ? (
            <p className="text-muted text-sm py-8 text-center">
              No traffic yet. Share your site to start collecting data.
            </p>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {data.days.map((d) => {
                const height = (d.views / maxDaily) * 100;
                const dateLabel = new Date(d.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.views}
                    </div>
                    <div
                      className="w-full bg-primary rounded-t-md transition-all hover:brightness-125"
                      style={{
                        height: `${Math.max(height, d.views > 0 ? 4 : 2)}%`,
                        minHeight: "4px",
                        opacity: d.views > 0 ? 1 : 0.15,
                      }}
                    />
                    <div className="text-[9px] text-muted whitespace-nowrap rotate-45 origin-top-left mt-1">
                      {dateLabel}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Projects */}
          <div className="bg-surface border border-base rounded-2xl p-6">
            <h2 className="text-xs uppercase tracking-widest text-muted mb-5">
              Top Projects
            </h2>

            {data.topProjects.length === 0 ? (
              <p className="text-muted text-sm py-6 text-center">
                No project views yet.
              </p>
            ) : (
              <div className="space-y-3">
                {data.topProjects.map((p) => {
                  const width = (p.views / maxProject) * 100;
                  return (
                    <div key={p.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <Link
                          href={`/work/${p.slug}`}
                          target="_blank"
                          className="text-sm text-base hover:text-primary transition-colors truncate"
                        >
                          {p.title}
                        </Link>
                        <span className="text-xs text-primary font-semibold flex-shrink-0 ml-3">
                          {p.views}
                        </span>
                      </div>
                      <div className="h-1.5 bg-base rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Pages */}
          <div className="bg-surface border border-base rounded-2xl p-6">
            <h2 className="text-xs uppercase tracking-widest text-muted mb-5">
              Top Pages
            </h2>

            {data.topPages.length === 0 ? (
              <p className="text-muted text-sm py-6 text-center">
                No page views yet.
              </p>
            ) : (
              <div className="space-y-3">
                {data.topPages.map((p) => {
                  const width = (p.views / maxPage) * 100;
                  return (
                    <div key={p.path}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-base truncate font-mono">
                          {p.path}
                        </span>
                        <span className="text-xs text-primary font-semibold flex-shrink-0 ml-3">
                          {p.views}
                        </span>
                      </div>
                      <div className="h-1.5 bg-base rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-surface border border-base rounded-2xl p-6">
      <div className="flex items-center gap-2 text-muted mb-3">
        <span className="text-primary">{icon}</span>
        <span className="text-[11px] uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-3xl font-bold text-base">
        {value.toLocaleString()}
      </p>
    </div>
  );
}