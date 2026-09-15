"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  featured: boolean;
  published: boolean;
  order: number;
  year: number | null;
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<Project | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/projects");
    if (res.ok) setProjects(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function confirmDelete() {
    if (!toDelete) return;
    await fetch(`/api/admin/projects/${toDelete.id}`, { method: "DELETE" });
    setToDelete(null);
    load();
  }

  async function toggleField(p: Project, field: "published" | "featured") {
    const updated = { ...p, [field]: !p[field] };
    setProjects((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
    await fetch(`/api/admin/projects/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  }

  return (
    <div className="p-4 md:p-8 w-full overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-base">
              Projects
            </h1>
            <p className="text-muted text-sm mt-1">
              Manage your portfolio work
            </p>
          </div>
          <Link
            href="/admin/projects/new"
            prefetch={true}
            className="inline-flex items-center justify-center bg-primary text-white font-semibold px-5 py-2.5 rounded-full text-sm self-start sm:self-auto"
          >
            + New Project
          </Link>
        </div>

        {loading ? (
          <div className="bg-surface border border-base rounded-2xl p-8">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-1 h-4 bg-base rounded-full" />
                  <div className="w-20 h-4 bg-base rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-surface border border-base rounded-2xl p-8 md:p-12 text-center">
            <p className="text-muted text-sm md:text-base">
              No projects yet.
            </p>
            <Link
              href="/admin/projects/new"
              prefetch={true}
              className="text-primary text-sm mt-3 inline-block"
            >
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="bg-surface border border-base rounded-2xl overflow-hidden">
            {/* Horizontal scroll wrapper for the table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-base text-left text-xs uppercase tracking-widest text-muted">
                    <th className="px-3 md:px-5 py-3 md:py-4">Title</th>
                    <th className="px-3 md:px-5 py-3 md:py-4">Category</th>
                    <th className="px-3 md:px-5 py-3 md:py-4">Year</th>
                    <th className="px-3 md:px-5 py-3 md:py-4">Order</th>
                    <th className="px-3 md:px-5 py-3 md:py-4">Status</th>
                    <th className="px-3 md:px-5 py-3 md:py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-base last:border-0 hover:bg-base/40"
                    >
                      <td className="px-3 md:px-5 py-3 md:py-4">
                        <p className="font-medium text-base text-sm md:text-base truncate max-w-[180px] md:max-w-none">
                          {p.title}
                        </p>
                        <p className="text-xs text-muted truncate max-w-[180px] md:max-w-none">
                          {p.slug}
                        </p>
                      </td>
                      <td className="px-3 md:px-5 py-3 md:py-4 text-xs md:text-sm text-muted">
                        {p.category}
                      </td>
                      <td className="px-3 md:px-5 py-3 md:py-4 text-xs md:text-sm text-muted">
                        {p.year ?? "-"}
                      </td>
                      <td className="px-3 md:px-5 py-3 md:py-4 text-xs md:text-sm text-muted">
                        {p.order}
                      </td>
                      <td className="px-3 md:px-5 py-3 md:py-4">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => toggleField(p, "published")}
                            className={`text-xs px-2.5 py-1 rounded-full border ${
                              p.published
                                ? "border-green-500/40 text-green-400"
                                : "border-base text-muted"
                            }`}
                          >
                            {p.published ? "Published" : "Draft"}
                          </button>
                          <button
                            onClick={() => toggleField(p, "featured")}
                            className={`text-xs px-2.5 py-1 rounded-full border ${
                              p.featured
                                ? "border-[var(--color-primary)] text-primary"
                                : "border-base text-muted"
                            }`}
                          >
                            {p.featured ? "Featured" : "Normal"}
                          </button>
                        </div>
                      </td>
                      <td className="px-3 md:px-5 py-3 md:py-4 text-right">
                        <div className="inline-flex gap-3 text-xs md:text-sm">
                          <Link
                            href={`/admin/projects/${p.id}`}
                            prefetch={true}
                            className="text-primary hover:underline"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setToDelete(p)}
                            className="text-red-400 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete project?"
        message={`"${toDelete?.title}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete Project"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}