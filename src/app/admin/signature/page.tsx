"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Download, Trash2 } from "lucide-react";

type Template = "minimal" | "card" | "branded";

type SignatureData = {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  instagram: string;
  linkedin: string;
  template: Template;
  accent: string;
};

const DEFAULT_DATA: SignatureData = {
  name: "Joseph Chimaobi Egbuonu",
  title: "Cinematographer & Creative Director",
  email: "josephchimaobi28@gmail.com",
  phone: "",
  website: "https://joseph-portfolio-kohl.vercel.app",
  location: "Lagos, Nigeria",
  instagram: "",
  linkedin: "",
  template: "branded",
  accent: "#E87A2D",
};

const STORAGE_KEY = "jce_signature_v1";

export default function SignaturePage() {
  const [data, setData] = useState<SignatureData>(DEFAULT_DATA);
  const [copied, setCopied] = useState<"rich" | "html" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setData({ ...DEFAULT_DATA, ...JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, mounted]);

  function update<K extends keyof SignatureData>(key: K, value: SignatureData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function reset() {
    if (!confirm("Reset signature to defaults?")) return;
    setData(DEFAULT_DATA);
  }

  async function copyRichText() {
    try {
      const html = buildHtml(data);
      const plain = buildPlain(data);
      const blob = new Blob([html], { type: "text/html" });
      const textBlob = new Blob([plain], { type: "text/plain" });
      const item = new ClipboardItem({
        "text/html": blob,
        "text/plain": textBlob,
      });
      await navigator.clipboard.write([item]);
      setCopied("rich");
      setTimeout(() => setCopied(null), 2200);
    } catch {
      alert("Copy failed. Try the HTML button instead.");
    }
  }

  async function copyHtml() {
    try {
      await navigator.clipboard.writeText(buildHtml(data));
      setCopied("html");
      setTimeout(() => setCopied(null), 2200);
    } catch {
      alert("Copy failed");
    }
  }

  function downloadHtml() {
    const html =
      "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Email Signature</title></head><body style=\"padding:40px;background:#f5f5f5;font-family:sans-serif;\"><h2>Your signature:</h2><div style=\"background:#fff;padding:24px;border-radius:12px;\">" +
      buildHtml(data) +
      "</div></body></html>";
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email-signature.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-base border border-base outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(232,122,45,0.15)] transition-all text-sm";
  const labelCls =
    "block text-[11px] uppercase tracking-widest text-muted mb-1.5";

  return (
    <div className="p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-base">Email Signature</h1>
            <p className="text-muted text-sm mt-0.5">
              Build a signature and copy it into Gmail, Outlook, or Apple Mail
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 text-xs text-muted hover:text-red-400 transition-colors px-3 py-2"
            >
              <Trash2 size={12} />
              Reset
            </button>
            <button
              onClick={downloadHtml}
              className="inline-flex items-center gap-2 border border-base px-4 py-2.5 rounded-full text-sm hover:bg-surface transition-colors"
            >
              <Download size={14} />
              Download
            </button>
            <button
              onClick={copyRichText}
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-full text-sm hover:shadow-[0_0_20px_rgba(232,122,45,0.35)] transition-all"
            >
              {copied === "rich" ? (
                <>
                  <Check size={14} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy Signature
                </>
              )}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface border border-base rounded-2xl p-6">
            <h2 className="text-xs uppercase tracking-widest text-primary pb-3 border-b border-base mb-5">
              Signature Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>Full Name</label>
                <input
                  value={data.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Job Title</label>
                <input
                  value={data.title}
                  onChange={(e) => update("title", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    value={data.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input
                    value={data.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+234..."
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Website</label>
                <input
                  value={data.website}
                  onChange={(e) => update("website", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Location</label>
                <input
                  value={data.location}
                  onChange={(e) => update("location", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Instagram URL</label>
                  <input
                    value={data.instagram}
                    onChange={(e) => update("instagram", e.target.value)}
                    placeholder="https://instagram.com/..."
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>LinkedIn URL</label>
                  <input
                    value={data.linkedin}
                    onChange={(e) => update("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Template</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["minimal", "card", "branded"] as Template[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update("template", t)}
                      className={
                        "py-2.5 rounded-xl border text-xs font-semibold capitalize transition-all " +
                        (data.template === t
                          ? "bg-primary text-white border-[var(--color-primary)]"
                          : "border-base text-muted hover:text-primary hover:border-[var(--color-primary)]")
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={data.accent}
                    onChange={(e) => update("accent", e.target.value)}
                    className="w-12 h-12 rounded-xl border border-base cursor-pointer bg-transparent"
                  />
                  <input
                    value={data.accent}
                    onChange={(e) => update("accent", e.target.value)}
                    className={inputCls + " flex-1 font-mono"}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-base rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-base mb-5">
              <h2 className="text-xs uppercase tracking-widest text-primary">
                Live Preview
              </h2>
              <button
                onClick={copyHtml}
                className="inline-flex items-center gap-1.5 text-[11px] text-muted hover:text-primary transition-colors"
              >
                {copied === "html" ? (
                  <>
                    <Check size={11} />
                    HTML copied
                  </>
                ) : (
                  <>
                    <Copy size={11} />
                    Copy HTML
                  </>
                )}
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 overflow-x-auto">
              <div dangerouslySetInnerHTML={{ __html: buildHtml(data) }} />
            </div>

            <div className="mt-5 pt-4 border-t border-base">
              <p className="text-[11px] text-muted leading-relaxed">
                <span className="text-primary font-semibold">Install: </span>
                Click Copy Signature above, then paste it into Gmail / Outlook / Apple Mail signature settings. Formatting is preserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildHtml(d: SignatureData): string {
  const esc = escapeHtml;
  const name = esc(d.name);
  const title = esc(d.title);
  const email = esc(d.email);
  const phone = esc(d.phone);
  const website = esc(d.website);
  const location = esc(d.location);
  const instagram = esc(d.instagram);
  const linkedin = esc(d.linkedin);
  const accent = d.accent;

  const cleanWebsite = d.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const cleanInstagram = d.instagram
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, "@")
    .replace(/\/$/, "");
  const cleanLinkedin = d.linkedin
    .replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")
    .replace(/\/$/, "");

  const contactRow =
    "<tr><td style=\"padding:3px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;color:#444;line-height:1.5;\">" +
    (email
      ? "<a href=\"mailto:" +
        email +
        "\" style=\"color:#444;text-decoration:none;\">" +
        email +
        "</a>"
      : "") +
    (phone
      ? (email ? " &nbsp;&middot;&nbsp; " : "") +
        "<a href=\"tel:" +
        phone +
        "\" style=\"color:#444;text-decoration:none;\">" +
        phone +
        "</a>"
      : "") +
    "</td></tr>";

  const linkRow =
    "<tr><td style=\"padding:3px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;line-height:1.5;\">" +
    (website
      ? "<a href=\"" +
        website +
        "\" style=\"color:" +
        accent +
        ";text-decoration:none;font-weight:600;\">" +
        cleanWebsite +
        "</a>"
      : "") +
    (instagram
      ? (website ? " &nbsp;&middot;&nbsp; " : "") +
        "<a href=\"" +
        instagram +
        "\" style=\"color:" +
        accent +
        ";text-decoration:none;font-weight:600;\">" +
        cleanInstagram +
        "</a>"
      : "") +
    (linkedin
      ? (website || instagram ? " &nbsp;&middot;&nbsp; " : "") +
        "<a href=\"" +
        linkedin +
        "\" style=\"color:" +
        accent +
        ";text-decoration:none;font-weight:600;\">" +
        cleanLinkedin +
        "</a>"
      : "") +
    "</td></tr>";

  const locationRow = location
    ? "<tr><td style=\"padding:3px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:12px;color:#888;line-height:1.5;\">" +
      location +
      "</td></tr>"
    : "";

  if (d.template === "minimal") {
    return (
      "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;\">" +
      "<tr><td style=\"padding:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:16px;font-weight:700;color:#111;\">" +
      name +
      "</td></tr>" +
      "<tr><td style=\"padding:0 0 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;color:#666;\">" +
      title +
      "</td></tr>" +
      contactRow +
      linkRow +
      locationRow +
      "</table>"
    );
  }

  if (d.template === "card") {
    return (
      "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;\">" +
      "<tr><td style=\"border:1px solid #e5e5e5;border-radius:8px;padding:16px 20px;\">" +
      "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;\">" +
      "<tr><td style=\"padding:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;font-weight:700;color:#111;\">" +
      name +
      "</td></tr>" +
      "<tr><td style=\"padding:0 0 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:12px;color:#888;\">" +
      title +
      "</td></tr>" +
      contactRow +
      linkRow +
      locationRow +
      "</table>" +
      "</td></tr>" +
      "</table>"
    );
  }

  return (
    "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;\">" +
    "<tr>" +
    "<td style=\"padding-right:16px;vertical-align:top;\">" +
    "<div style=\"width:4px;background:" +
    accent +
    ";border-radius:2px;min-height:80px;\">&nbsp;</div>" +
    "</td>" +
    "<td style=\"vertical-align:top;\">" +
    "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;\">" +
    "<tr><td style=\"padding:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:17px;font-weight:700;color:#111;\">" +
    name +
    "</td></tr>" +
    "<tr><td style=\"padding:0 0 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:12px;color:" +
    accent +
    ";font-weight:600;text-transform:uppercase;letter-spacing:0.05em;\">" +
    title +
    "</td></tr>" +
    contactRow +
    linkRow +
    locationRow +
    "</table>" +
    "</td>" +
    "</tr>" +
    "</table>"
  );
}

function buildPlain(d: SignatureData): string {
  const lines = [d.name, d.title, ""];
  if (d.email) lines.push(d.email);
  if (d.phone) lines.push(d.phone);
  if (d.website) lines.push(d.website);
  if (d.instagram) lines.push(d.instagram);
  if (d.linkedin) lines.push(d.linkedin);
  if (d.location) lines.push(d.location);
  return lines.join("\n");
}

function escapeHtml(s: string): string {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}