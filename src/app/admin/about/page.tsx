"use client";

import { useEffect, useState } from "react";
import { MediaUpload } from "@/components/admin/MediaUpload";

type S = Record<string, string>;

const TEXT_FIELDS: { key: string; label: string; type?: "text" | "textarea" | "array" }[] = [
  { key: "aboutName", label: "Name" },
  { key: "aboutHeadline", label: "Headline" },
  { key: "aboutAvailability", label: "Availability" },
  { key: "aboutLocation", label: "Location" },
  { key: "aboutEmail", label: "About Email" },
  { key: "aboutPhone", label: "About Phone" },
  { key: "aboutBio", label: "Bio", type: "textarea" },
  { key: "aboutExperience", label: "Experience", type: "textarea" },
  { key: "aboutSkills", label: "Skills (one per line)", type: "array" },
  { key: "aboutTools", label: "Tools & Software (one per line)", type: "array" },
];

export default function AboutCmsPage() {
  const [data, setData] = useState<S>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const json = await res.json();
        for (const f of TEXT_FIELDS) {
          if (f.type === "array") {
            try {
              const arr = json[f.key] ? JSON.parse(json[f.key]) : [];
              json[f.key] = Array.isArray(arr) ? arr.join("\n") : "";
            } catch {
              json[f.key] = "";
            }
          }
        }
        setData(json);
      }
      setLoading(false);
    })();
  }, []);

  function update(k: string, v: string) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function save() {
    setSaving(true);
    const payload: S = {};
    // text fields
    for (const f of TEXT_FIELDS) {
      const v = data[f.key] ?? "";
      if (f.type === "array") {
        const arr = v.split("\n").map((s) => s.trim()).filter(Boolean);
        payload[f.key] = JSON.stringify(arr);
      } else {
        payload[f.key] = v;
      }
    }
    // profile image
    payload.aboutImage = data.aboutImage ?? "";

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
            <h1 className="text-2xl font-bold text-base">About Content</h1>
            <p className="text-muted text-sm mt-0.5">
              Bio, skills, tools, and profile image
            </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Image — left column */}
          <div className="lg:col-span-1">
            <MediaUpload
              kind="image"
              label="Profile Image"
              value={data.aboutImage ?? ""}
              onChange={(url) => update("aboutImage", url)}
            />
          </div>

          {/* Text fields — right two columns */}
          <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-4 content-start">
            {TEXT_FIELDS.map((f) => {
              const spanFull = f.type === "textarea" || f.type === "array";
              return (
                <div key={f.key} className={spanFull ? "lg:col-span-2" : ""}>
                  <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">
                    {f.label}
                  </label>
                  {spanFull ? (
                    <textarea
                      rows={f.type === "array" ? 4 : 3}
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
    </div>
  );
}