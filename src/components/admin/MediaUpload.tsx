"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Upload, X, ImageIcon, Film } from "lucide-react";

type Props = {
  kind: "image" | "video";
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export function MediaUpload({ kind, value, onChange, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [orientation, setOrientation] = useState<"landscape" | "portrait" | "square">("landscape");

  const accept =
    kind === "image"
      ? "image/jpeg,image/png,image/webp,image/gif,image/avif"
      : "video/mp4,video/webm,video/quicktime,video/x-msvideo,video/ogg";

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    setProgress(0);

    try {
      const folder = kind === "video" ? "videos" : "images";
      const ext = file.name.split(".").pop()?.toLowerCase() || (kind === "video" ? "mp4" : "jpg");
      const pathname = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        onUploadProgress: ({ percentage }) => {
          setProgress(Math.round(percentage));
        },
      });

      onChange(blob.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function detectOrientation(w: number, h: number) {
    if (w > h * 1.05) setOrientation("landscape");
    else if (h > w * 1.05) setOrientation("portrait");
    else setOrientation("square");
  }

  const Icon = kind === "image" ? ImageIcon : Film;

  const previewWidth =
    kind === "video" && orientation === "portrait"
      ? "max-w-[320px]"
      : kind === "video" && orientation === "square"
        ? "max-w-[480px]"
        : "w-full";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm uppercase tracking-widest text-muted">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onPick}
        className="hidden"
      />

      {!value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          disabled={uploading}
          className="w-full border-2 border-dashed border-base rounded-xl p-10 hover:border-[var(--color-primary)] hover:bg-[rgba(232,122,45,0.05)] transition-colors flex flex-col items-center gap-3 disabled:opacity-60"
        >
          {uploading ? (
            <>
              <div className="w-full max-w-xs">
                <div className="h-2 rounded-full bg-base overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-center text-muted mt-2">
                  Uploading directly to Blob… {progress}%
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-[rgba(232,122,45,0.12)] flex items-center justify-center">
                <Icon size={24} className="text-primary" />
              </div>
              <p className="text-base text-base font-medium">
                Click to upload {kind}
              </p>
              <p className="text-xs text-muted text-center">
                or drag &amp; drop ·{" "}
                {kind === "image"
                  ? "JPG, PNG, WEBP up to 15MB"
                  : "MP4, WEBM, MOV up to 500MB"}
              </p>
            </>
          )}
        </button>
      )}

      {value && (
        <div className={previewWidth}>
          <div className="relative group rounded-xl overflow-hidden border border-base bg-base">
            {kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt=""
                onLoad={(e) =>
                  detectOrientation(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)
                }
                className="w-full h-auto max-h-[500px] object-contain bg-black"
              />
            ) : (
              <video
                src={value}
                controls
                onLoadedMetadata={(e) =>
                  detectOrientation(e.currentTarget.videoWidth, e.currentTarget.videoHeight)
                }
                className="w-full h-auto max-h-[500px] bg-black"
              />
            )}

            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-primary"
                aria-label="Replace"
              >
                <Upload size={16} />
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-500"
                aria-label="Remove"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 mt-2">
            <p className="text-xs text-muted truncate flex-1">{value}</p>
            <p className="text-xs text-primary uppercase tracking-widest flex-shrink-0">
              {orientation}
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}