"use client";

import { useEffect, useState } from "react";

type S = Record<string, string>;

const FIELDS: { key: string; label: string; type?: "text" | "textarea" }[] = [
  { key: "siteName", label: "Site Name" },
  { key: "navCtaLabel", label: "Nav CTA Label" },
  { key: "contactEmail", label: "Contact Email" },
  { key: "contactPhone", label: "Contact Phone" },
  { key: "whatsappNumber", label: "WhatsApp Number" },
  { key: "seoTitle", label: "SEO Title" },
  { key: "seoOgImage", label: "OG Image URL" },
  { key: "seoDescription", label: "SEO Description", type: "textarea" },
  { key: "footerNavigateTitle", label: "Footer Navigate Title" },
  { key: "footerConnectTitle", label: "Footer Connect Title" },
  { key: "footerText", label: "Footer Copyright Text" },
  { key: "formSuccessTitle", label: "Form Success Title" },
  { key: "formSuccessText", label: "Form Success Text", type: "textarea" },
];

export default function SettingsPage() {
  const [data, setData] = useState<S>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/settings");
      if (res.ok) setData(await res.json());
      setLoading(false);
    })();
  }, []);

  function update(k: string, v: string) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function save() {
    setSaving(true);
    const payload: S = {};
    for (const f of FIELDS) payload[f.key] = data[f.key] ?? "";
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <div className="p-6 text-muted text-sm">Loading...</div>;

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-base border border-base outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(232,122,45,0.15)] transition-all text-sm";

  return (
    <div className="p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base">Site Settings</h1>
            <p className="text-muted text-sm mt-0.5">Contact, SEO, footer</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-xs text-green-400">Saved</span>}
            <button
              onClick={save}
              disabled={saving}
              className="bg-primary text-white font-semibold px-5 py-2.5 rounded-full disabled:opacity-50 text-sm"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-4">
          {FIELDS.map((f) => {
            const spanFull = f.type === "textarea";
            return (
              <div key={f.key} className={spanFull ? "lg:col-span-2" : ""}>
                <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">
                  {f.label}
                </label>
                {spanFull ? (
                  <textarea
                    rows={3}
                    value={data[f.key] ?? ""}
                    onChange={(e) => update(f.key, e.target.value)}
                    className={inputCls + " resize-y"}
                  />
                ) : (
                  <input
                    value={data[f.key] ?? ""}
                    onChange={(e) => update(f.key, e.target.value)}
                    className={inputCls}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}