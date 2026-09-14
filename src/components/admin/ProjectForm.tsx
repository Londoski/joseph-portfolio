"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MediaUpload } from "./MediaUpload";

type ProjectData = {
  id?: string;
  title: string;
  description: string;
  category: string;
  client: string;
  year: string;
  role: string;
  thumbnail: string;
  videoUrl: string;
  gallery: string;
  featured: boolean;
  published: boolean;
  order: number;
};

export function ProjectForm({ initial }: { initial?: Partial<ProjectData> }) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<ProjectData>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "",
    client: initial?.client ?? "",
    year: initial?.year ?? "",
    role: initial?.role ?? "",
    thumbnail: initial?.thumbnail ?? "",
    videoUrl: initial?.videoUrl ?? "",
    gallery: initial?.gallery ?? "",
    featured: initial?.featured ?? false,
    published: initial?.published ?? true,
    order: initial?.order ?? 0,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof ProjectData>(key: K, value: ProjectData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function parseGallery(): string[] {
    if (!form.gallery) return [];
    try {
      const parsed = JSON.parse(form.gallery);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function setGallery(arr: string[]) {
    update("gallery", JSON.stringify(arr));
  }

  function addGalleryImage(url: string) {
    const current = parseGallery();
    setGallery([...current, url]);
  }

  function removeGalleryImage(idx: number) {
    const current = parseGallery();
    setGallery(current.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = isEdit ? `/api/admin/projects/${initial!.id}` : "/api/admin/projects";
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

    router.push("/admin/projects");
    router.refresh();
  }

  const inputCls =
    "w-full px-5 py-4 rounded-xl bg-base border border-base outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(232,122,45,0.15)] transition-all text-base";
  const labelCls = "block text-sm uppercase tracking-widest text-muted mb-2";
  const gallery = parseGallery();

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* ============ LEFT — TEXT FIELDS ============ */}
        <div className="space-y-7">
          <h2 className="text-base uppercase tracking-widest text-primary pb-3 border-b border-base font-bold">
            Project Details
          </h2>

          <div>
            <label className={labelCls}>Title *</label>
            <input
              required
              minLength={2}
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Description *</label>
            <textarea
              required
              minLength={10}
              rows={8}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className={inputCls + " resize-y"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Category *</label>
              <input
                required
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className={inputCls}
                placeholder="Commercial, etc."
              />
            </div>
            <div>
              <label className={labelCls}>Client</label>
              <input
                value={form.client}
                onChange={(e) => update("client", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => update("year", e.target.value)}
                className={inputCls}
                placeholder="2024"
              />
            </div>
            <div>
              <label className={labelCls}>Role</label>
              <input
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div>
              <label className={labelCls}>Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => update("order", Number(e.target.value))}
                className={inputCls}
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer pt-9">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
                className="w-6 h-6 accent-[var(--color-primary)]"
              />
              <span className="text-base text-base">Featured</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer pt-9">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => update("published", e.target.checked)}
                className="w-6 h-6 accent-[var(--color-primary)]"
              />
              <span className="text-base text-base">Published</span>
            </label>
          </div>
        </div>

        {/* ============ RIGHT — MEDIA ============ */}
        <div className="space-y-7">
          <h2 className="text-base uppercase tracking-widest text-primary pb-3 border-b border-base font-bold">
            Media
          </h2>

          <MediaUpload
            kind="video"
            label="Video (Optional)"
            value={form.videoUrl}
            onChange={(url) => update("videoUrl", url)}
          />

          <MediaUpload
            kind="image"
            label="Thumbnail Image"
            value={form.thumbnail}
            onChange={(url) => update("thumbnail", url)}
          />

          <div>
            <label className={labelCls}>Gallery Images</label>

            {gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {gallery.map((src, i) => (
                  <div
                    key={i}
                    className="relative group rounded-lg overflow-hidden border border-base bg-base"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Gallery ${i + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-opacity"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <MediaUpload
              kind="image"
              value=""
              onChange={(url) => {
                if (url) addGalleryImage(url);
              }}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-8">
          {error}
        </p>
      )}

      <div className="flex gap-4 pt-8 mt-8 border-t border-base">
        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white font-semibold px-8 py-3.5 rounded-full disabled:opacity-50 text-base"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Project"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-base px-8 py-3.5 rounded-full hover:bg-surface text-base"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}