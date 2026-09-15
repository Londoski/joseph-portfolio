"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

export default function ThemePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-base">Theme</h1>
        <p className="text-muted mt-1">Choose how the site looks</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setTheme("light")}
          className={"p-6 rounded-2xl border-2 transition-all text-left " + (theme === "light" ? "border-[var(--color-primary)] bg-surface" : "border-base")}
        >
          <div className="w-full h-24 rounded-xl bg-white border border-gray-200 mb-4" />
          <p className="font-semibold text-base">Light Mode</p>
          <p className="text-xs text-muted mt-1">Bright and clean</p>
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={"p-6 rounded-2xl border-2 transition-all text-left " + (theme === "dark" ? "border-[var(--color-primary)] bg-surface" : "border-base")}
        >
          <div className="w-full h-24 rounded-xl bg-black border border-gray-800 mb-4" />
          <p className="font-semibold text-base">Dark Mode</p>
          <p className="text-xs text-muted mt-1">Cinematic and moody</p>
        </button>
      </div>
    </div>
  );
}