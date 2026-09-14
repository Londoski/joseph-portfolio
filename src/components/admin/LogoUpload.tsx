"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Upload, X, ImageIcon, Crop } from "lucide-react";
import { LogoCropper } from "./LogoCropper";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export function LogoUpload({ value, onChange, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingSrc, setPendingSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  function pickFile() {
    inputRef.current?.click();
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!/^image\/(jpeg|png|webp|gif|avif)$/.test(file.type)) {
      setError("Please upload a JPG, PNG, WEBP, GIF or AVIF image");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("File too large. Max 15MB.");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = () => setPendingSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setError("Please upload an image");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPendingSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleCropped(dataUrl: string) {
    setPendingSrc(null);
    setUploading(true);
    setProgress(0);
    setError("");

    try {
      // Convert data URL to Blob
      const blobRes = await fetch(dataUrl);
      const blob = await blobRes.blob();

      const pathname = "logos/" + Date.now() + "-" + Math.random().toString(36).slice(2, 10) + ".png";

      const uploaded = await upload(pathname, blob, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });

      onChange(uploaded.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  function clearLogo() {
    onChange("");
  }

  return (
    <div>
      {label && (
        <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={onPick}
        className="hidden"
      />

      {!value && !uploading && (
        <button
          type="button"
          onClick={pickFile}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="w-full border-2 border-dashed border-base rounded-xl p-8 hover:border-[var(--color-primary)] hover:bg-[rgba(232,122,45,0.05)] transition-colors flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-[rgba(232,122,45,0.12)] flex items-center justify-center">
            <ImageIcon size={20} className="text-primary" />
          </div>
          <p className="text-sm text-base font-medium">
            Click to upload logo
          </p>
          <p className="text-xs text-muted text-center">
            or drag &amp; drop &middot; JPG, PNG, WEBP up to 15MB
          </p>
          <p className="text-[10px] uppercase tracking-widest text-primary mt-1">
            You&apos;ll be able to crop and resize next
          </p>
        </button>
      )}

      {uploading && (
        <div className="w-full border border-base rounded-xl p-8 flex flex-col items-center gap-3">
          <div className="w-full max-w-xs">
            <div className="h-2 rounded-full bg-base overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{ width: progress + "%" }}
              />
            </div>
            <p className="text-xs text-center text-muted mt-2">
              Uploading... {progress}%
            </p>
          </div>
        </div>
      )}

      {value && !uploading && (
        <div className="relative group rounded-xl overflow-hidden border border-base bg-base">
          <div className="bg-[#0a0a0a] flex items-center justify-center p-6 min-h-[140px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              className="max-w-full max-h-[160px] object-contain"
            />
          </div>

          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={pickFile}
              className="w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-primary"
              aria-label="Replace and re-crop"
              title="Replace & re-crop"
            >
              <Crop size={14} />
            </button>
            <button
              type="button"
              onClick={clearLogo}
              className="w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-500"
              aria-label="Remove"
              title="Remove"
            >
              <X size={14} />
            </button>
          </div>

          <div className="px-3 py-2 text-[10px] text-muted truncate border-t border-base">
            {value}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

      {pendingSrc && (
        <LogoCropper
          imageSrc={pendingSrc}
          onCancel={() => setPendingSrc(null)}
          onConfirm={handleCropped}
        />
      )}
    </div>
  );
}