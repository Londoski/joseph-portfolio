"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

type Service = { id: string; title: string; description: string; order: number; published: boolean };

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<Service | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    if (res.ok) setServices(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function confirmDelete() {
    if (!toDelete) return;
    await fetch(`/api/admin/services/${toDelete.id}`, { method: "DELETE" });
    setToDelete(null);
    load();
  }

  async function toggle(p: Service) {
    const updated = { ...p, published: !p.published };
    setServices((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
    await fetch(`/api/admin/services/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  }

  return (
    <div className="p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base">Services</h1>
            <p className="text-muted text-sm mt-0.5">Manage what you offer</p>
          </div>
          <Link href="/admin/services/new" className="bg-primary text-white font-semibold px-5 py-2.5 rounded-full text-sm">
            + New Service
          </Link>
        </header>

        {loading ? (
          <p className="text-muted text-sm">Loading...</p>
        ) : services.length === 0 ? (
          <div className="bg-surface border border-base rounded-2xl p-10 text-center">
            <p className="text-muted text-sm">No services yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((s) => (
              <div key={s.id} className="bg-surface border border-base rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-base">{s.title}</h3>
                  <span className="text-xs text-muted">#{s.order}</span>
                </div>
                <p className="text-sm text-muted mb-5 line-clamp-3">{s.description}</p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggle(s)}
                    className={`text-xs px-2.5 py-1 rounded-full border ${
                      s.published ? "border-green-500/40 text-green-400" : "border-base text-muted"
                    }`}
                  >
                    {s.published ? "Published" : "Draft"}
                  </button>
                  <div className="flex gap-3 text-sm">
                    <Link href={`/admin/services/${s.id}`} className="text-primary hover:underline">Edit</Link>
                    <button onClick={() => setToDelete(s)} className="text-red-400 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete service?"
        message={`"${toDelete?.title}" will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}