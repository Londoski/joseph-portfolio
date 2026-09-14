"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

type T = { id: string; clientName: string; company: string | null; content: string; order: number; published: boolean };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<T | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/testimonials");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function confirmDelete() {
    if (!toDelete) return;
    await fetch(`/api/admin/testimonials/${toDelete.id}`, { method: "DELETE" });
    setToDelete(null);
    load();
  }

  return (
    <div className="p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base">Testimonials</h1>
            <p className="text-muted text-sm mt-0.5">Client quotes and feedback</p>
          </div>
          <Link href="/admin/testimonials/new" className="bg-primary text-white font-semibold px-5 py-2.5 rounded-full text-sm">
            + New Testimonial
          </Link>
        </header>

        {loading ? (
          <p className="text-muted text-sm">Loading...</p>
        ) : items.length === 0 ? (
          <div className="bg-surface border border-base rounded-2xl p-10 text-center">
            <p className="text-muted text-sm">No testimonials yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((t) => (
              <div key={t.id} className="bg-surface border border-base rounded-2xl p-5">
                <p className="text-sm text-base italic mb-4">&ldquo;{t.content}&rdquo;</p>
                <p className="text-sm font-semibold text-base">{t.clientName}</p>
                {t.company && <p className="text-xs text-muted">{t.company}</p>}
                <div className="flex items-center justify-between mt-5">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${
                    t.published ? "border-green-500/40 text-green-400" : "border-base text-muted"
                  }`}>
                    {t.published ? "Published" : "Draft"}
                  </span>
                  <div className="flex gap-3 text-sm">
                    <Link href={`/admin/testimonials/${t.id}`} className="text-primary hover:underline">Edit</Link>
                    <button onClick={() => setToDelete(t)} className="text-red-400 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete testimonial?"
        message={`Testimonial from "${toDelete?.clientName}" will be removed.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}