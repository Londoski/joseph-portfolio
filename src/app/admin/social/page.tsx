"use client";

import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

type SL = { id: string; platform: string; url: string; order: number; active: boolean };

export default function AdminSocialPage() {
  const [items, setItems] = useState<SL[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<SL | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SL | null>(null);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [order, setOrder] = useState(0);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/social");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startAdd() {
    setEditing(null); setPlatform(""); setUrl(""); setOrder(0); setError(""); setShowForm(true);
  }
  function startEdit(s: SL) {
    setEditing(s); setPlatform(s.platform); setUrl(s.url); setOrder(s.order); setError(""); setShowForm(true);
  }

  async function submit() {
    setError("");
    const body = { platform, url, order, active: true };
    const res = editing
      ? await fetch(`/api/admin/social/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/admin/social", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Save failed.");
      return;
    }
    setShowForm(false);
    load();
  }

  async function confirmDelete() {
    if (!toDelete) return;
    await fetch(`/api/admin/social/${toDelete.id}`, { method: "DELETE" });
    setToDelete(null); load();
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-base border border-base outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(232,122,45,0.15)] transition-all text-sm";

  return (
    <div className="p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base">Social Links</h1>
            <p className="text-muted text-sm mt-0.5">Manage your social presence</p>
          </div>
          <button onClick={startAdd} className="bg-primary text-white font-semibold px-5 py-2.5 rounded-full text-sm">
            + Add Link
          </button>
        </header>

        {loading ? (
          <p className="text-muted text-sm">Loading...</p>
        ) : items.length === 0 ? (
          <div className="bg-surface border border-base rounded-2xl p-10 text-center">
            <p className="text-muted text-sm">No social links yet.</p>
          </div>
        ) : (
          <div className="bg-surface border border-base rounded-2xl overflow-hidden">
            {items.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4 border-b border-base last:border-0">
                <div className="min-w-0">
                  <p className="font-medium text-base capitalize">{s.platform}</p>
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-muted hover:text-primary truncate block">
                    {s.url}
                  </a>
                </div>
                <div className="flex gap-3 text-sm">
                  <button onClick={() => startEdit(s)} className="text-primary hover:underline">Edit</button>
                  <button onClick={() => setToDelete(s)} className="text-red-400 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-base bg-surface p-6">
            <h2 className="text-lg font-bold text-base mb-5">{editing ? "Edit" : "Add"} Social Link</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">Platform *</label>
                <input value={platform} onChange={(e) => setPlatform(e.target.value)} className={inputCls} placeholder="Instagram" />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">URL *</label>
                <input value={url} onChange={(e) => setUrl(e.target.value)} className={inputCls} placeholder="https://instagram.com/..." />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">Order</label>
                <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className={inputCls} />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-full border border-base text-sm hover:bg-base">
                Cancel
              </button>
              <button onClick={submit} className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold">
                {editing ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete social link?"
        message={`"${toDelete?.platform}" will be removed.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}