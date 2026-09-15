"use client";

import { useEffect, useState } from "react";
import { LogoUpload } from "@/components/admin/LogoUpload";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Plus, Edit2, Trash2, ExternalLink } from "lucide-react";

type ClientLogo = {
  id: string;
  name: string;
  logoUrl: string;
  website: string | null;
  order: number;
  published: boolean;
};

type Draft = {
  id?: string;
  name: string;
  logoUrl: string;
  website: string;
  order: number;
  published: boolean;
};

const emptyDraft: Draft = {
  name: "",
  logoUrl: "",
  website: "",
  order: 0,
  published: true,
};

export default function AdminClientsPage() {
  const [items, setItems] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState<ClientLogo | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/clients");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startAdd() {
    setEditing({ ...emptyDraft });
    setError("");
  }

  function startEdit(item: ClientLogo) {
    setEditing({
      id: item.id,
      name: item.name,
      logoUrl: item.logoUrl,
      website: item.website ?? "",
      order: item.order,
      published: item.published,
    });
    setError("");
  }

  async function save() {
    if (!editing) return;
    if (!editing.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!editing.logoUrl.trim()) {
      setError("Please upload a logo");
      return;
    }
    setSaving(true);
    setError("");

    const url = editing.id
      ? "/api/admin/clients/" + editing.id
      : "/api/admin/clients";
    const method = editing.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    setSaving(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Save failed");
      return;
    }

    setEditing(null);
    load();
  }

  async function confirmDelete() {
    if (!toDelete) return;
    await fetch("/api/admin/clients/" + toDelete.id, { method: "DELETE" });
    setToDelete(null);
    load();
  }

  async function togglePublished(item: ClientLogo) {
    const updated = { ...item, published: !item.published };
    setItems((prev) => prev.map((x) => (x.id === item.id ? updated : x)));
    await fetch("/api/admin/clients/" + item.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  }

  if (loading) return <div className="p-4 md:p-8 text-muted text-sm">Loading...</div>;

  return (
    <div className="p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base">Client Logos</h1>
            <p className="text-muted text-sm mt-0.5">
              Companies and brands you have worked with
            </p>
          </div>
          <button
            onClick={startAdd}
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-full text-sm"
          >
            <Plus size={16} />
            Add Logo
          </button>
        </header>

        {items.length === 0 ? (
          <div className="bg-surface border border-base rounded-2xl p-12 text-center">
            <p className="text-base text-base mb-2">No client logos yet</p>
            <p className="text-sm text-muted mb-6">
              Add logos of brands and companies you have worked with.
            </p>
            <button
              onClick={startAdd}
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-full text-sm"
            >
              <Plus size={16} />
              Add your first logo
            </button>
          </div>
        ) : (
          <div className="bg-surface border border-base rounded-2xl overflow-hidden">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border-b border-base last:border-0"
              >
                <div className="w-20 h-14 rounded-lg bg-base border border-base flex items-center justify-center overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.logoUrl}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain p-1"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-base truncate">{item.name}</p>
                  {item.website && (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-xs text-muted hover:text-primary inline-flex items-center gap-1 mt-0.5"
                    >
                      <ExternalLink size={10} />
                      {item.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>

                <div className="text-xs text-muted w-12 text-center flex-shrink-0">
                  #{item.order}
                </div>

                <button
                  onClick={() => togglePublished(item)}
                  className={
                    "text-xs px-2.5 py-1 rounded-full border flex-shrink-0 " +
                    (item.published
                      ? "border-green-500/40 text-green-400"
                      : "border-base text-muted")
                  }
                >
                  {item.published ? "Live" : "Hidden"}
                </button>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(item)}
                    className="w-8 h-8 rounded-lg border border-base flex items-center justify-center text-muted hover:text-primary hover:border-[var(--color-primary)] transition-colors"
                    aria-label="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setToDelete(item)}
                    className="w-8 h-8 rounded-lg border border-base flex items-center justify-center text-muted hover:text-red-400 hover:border-red-400/40 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-base bg-surface p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-base mb-5">
              {editing.id ? "Edit Client Logo" : "Add Client Logo"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">
                  Company Name *
                </label>
                <input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-base border border-base outline-none focus:border-[var(--color-primary)] transition-all text-sm"
                  placeholder="e.g. Apex Motors"
                />
              </div>

              <LogoUpload
                label="Logo Image *"
                value={editing.logoUrl}
                onChange={(url) => setEditing({ ...editing, logoUrl: url })}
              />

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">
                  Website (optional)
                </label>
                <input
                  value={editing.website}
                  onChange={(e) =>
                    setEditing({ ...editing, website: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-base border border-base outline-none focus:border-[var(--color-primary)] transition-all text-sm"
                  placeholder="https://company.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">
                    Order
                  </label>
                  <input
                    type="number"
                    value={editing.order}
                    onChange={(e) =>
                      setEditing({ ...editing, order: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-base border border-base outline-none focus:border-[var(--color-primary)] transition-all text-sm"
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer pt-6">
                  <input
                    type="checkbox"
                    checked={editing.published}
                    onChange={(e) =>
                      setEditing({ ...editing, published: e.target.checked })
                    }
                    className="w-5 h-5 accent-[var(--color-primary)]"
                  />
                  <span className="text-sm text-base">Published</span>
                </label>
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-2.5">
                  {error}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-full border border-base text-sm hover:bg-base"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : editing.id ? "Save Changes" : "Add Logo"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete client logo?"
        message={'"' + (toDelete?.name ?? "") + '" will be removed from your portfolio.'}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}