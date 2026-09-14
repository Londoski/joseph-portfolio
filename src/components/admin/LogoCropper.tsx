"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { X, Check } from "lucide-react";

type Area = { x: number; y: number; width: number; height: number };

const ASPECTS = [
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "16:9", value: 16 / 9 },
  { label: "2:1", value: 2 },
  { label: "Free", value: 0 },
];

export function LogoCropper({
  imageSrc,
  onCancel,
  onConfirm,
}: {
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (dataUrl: string) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function cropAndSave() {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const dataUrl = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      onConfirm(dataUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to crop image");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-base bg-surface overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base">
          <div>
            <h2 className="text-base font-bold text-base">Crop Logo</h2>
            <p className="text-xs text-muted mt-0.5">
              Drag to move, slide to zoom, pick aspect ratio
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-9 h-9 rounded-lg border border-base flex items-center justify-center text-muted hover:text-red-400 hover:border-red-400/40 transition-colors"
            aria-label="Cancel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Cropper area */}
        <div className="relative w-full bg-black" style={{ height: "360px" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect === 0 ? undefined : aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            objectFit="contain"
            showGrid
            style={{
              containerStyle: { background: "#0a0a0a" },
              cropAreaStyle: {
                border: "2px solid #E87A2D",
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.65)",
              },
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-5 space-y-4 border-t border-base">
          {/* Aspect ratio */}
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-muted mb-2">
              Aspect Ratio
            </label>
            <div className="flex flex-wrap gap-2">
              {ASPECTS.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => setAspect(a.value)}
                  className={
                    "text-xs px-3.5 py-1.5 rounded-full border transition-all " +
                    (aspect === a.value
                      ? "bg-primary text-white border-[var(--color-primary)]"
                      : "border-base text-muted hover:text-primary hover:border-[var(--color-primary)]")
                  }
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom */}
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-muted mb-2">
              Zoom
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[var(--color-primary)]"
            />
          </div>

          {/* Rotation */}
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-muted mb-2">
              Rotation
            </label>
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full accent-[var(--color-primary)]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-full border border-base text-sm hover:bg-base"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={cropAndSave}
              disabled={processing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold disabled:opacity-50"
            >
              <Check size={14} />
              {processing ? "Processing..." : "Apply Crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Canvas crop helper -------------------- */

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  maxOutputSize = 800
): Promise<string> {
  const image = await loadImage(imageSrc);
  const rotRad = (rotation * Math.PI) / 180;

  // Compute the bounding box after rotation
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // Draw the rotated image on a temp canvas
  const canvas = document.createElement("canvas");
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;
  const ctx = canvas.getContext("2d")!;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  // Extract the cropped region from the rotated canvas
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d")!;

  // Downscale if the crop is larger than maxOutputSize
  const scale = Math.min(1, maxOutputSize / Math.max(pixelCrop.width, pixelCrop.height));
  croppedCanvas.width = Math.round(pixelCrop.width * scale);
  croppedCanvas.height = Math.round(pixelCrop.height * scale);

  croppedCtx.imageSmoothingEnabled = true;
  croppedCtx.imageSmoothingQuality = "high";

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    croppedCanvas.width,
    croppedCanvas.height
  );

  // Always export as PNG to preserve transparency
  return croppedCanvas.toDataURL("image/png", 1);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}