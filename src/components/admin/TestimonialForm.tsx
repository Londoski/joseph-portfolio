"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TData = {
  id?: string;
  clientName: string;
  company: string;
  role: string;
  content: string;
  image: string;
  order: number;
  published: boolean;
};

export function TestimonialForm({ initial }: { initial?: Partial<TData> }) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [form, setForm] = useState<TData>({
    clientName: initial?.clientName ?? "",
    company: initial?.company ?? "",
    role: initial?.role ?? "",
    content: initial?.content ?? "",
    image: initial?.image ?? "",
    order: initial?.order ?? 0,
    published: initial?.published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof TData>(k: K, v: TData[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = isEdit ? `/api/admin/testimonials/${initial!.id}` : "/api/admin/testimonials";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Save failed.");
      return;
    }
    router.push("/admin/testimonials");
    router.refresh();
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-base border border-base outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(232,122,45,0.15)] transition-all text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">Client name *</label>
          <input required value={form.clientName} onChange={(e) => update("clientName", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">Company</label>
          <input value={form.company} onChange={(e) => update("company", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">Role</label>
          <input value={form.role} onChange={(e) => update("role", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">Order</label>
          <input type="number" value={form.order} onChange={(e) => update("order", Number(e.target.value))} className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">Testimonial *</label>
        <textarea
          required
          minLength={10}
          rows={4}
          value={form.content}
          onChange={(e) => update("content", e.target.value)}
          className={inputCls + " resize-y"}
        />
      </div>
      <div>
        <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">Image URL</label>
        <input value={form.image} onChange={(e) => update("image", e.target.value)} className={inputCls} placeholder="https://..." />
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => update("published", e.target.checked)}
          className="w-5 h-5 accent-[var(--color-primary)]"
        />
        <span className="text-sm text-base">Published</span>
      </label>
      {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-2.5">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-primary text-white font-semibold px-5 py-2.5 rounded-full disabled:opacity-50 text-sm">
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Testimonial"}
        </button>
        <button type="button" onClick={() => router.back()} className="border border-base px-5 py-2.5 rounded-full hover:bg-surface text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}