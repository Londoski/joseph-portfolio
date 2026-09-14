"use client";

import { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
}

export function Select({
  name,
  options,
  placeholder = "Select...",
  defaultValue = "",
}: {
  name: string;
  options: Option[];
  placeholder?: string;
  defaultValue?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const [highlighted, setHighlighted] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlighted(-1);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label =
    options.find((o) => o.value === selected)?.label ?? placeholder;

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name={name} value={selected} />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 py-3 rounded-2xl bg-base border border-base outline-none hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(232,122,45,0.15)] transition-all flex items-center justify-between gap-2"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? "text-base" : "text-muted"}>{label}</span>
        <svg
          className={`w-4 h-4 text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-40 mt-2 w-full rounded-2xl border border-base bg-surface shadow-2xl shadow-black/40 overflow-hidden backdrop-blur-md animate-[fadeIn_120ms_ease-out]"
        >
          <button
            type="button"
            onClick={() => {
              setSelected("");
              setOpen(false);
            }}
            onMouseEnter={() => setHighlighted(-1)}
            className={`w-full text-left px-4 py-3 text-sm border-b border-base transition-all duration-150 ${
              selected === ""
                ? "text-primary"
                : "text-muted hover:text-primary hover:bg-[rgba(232,122,45,0.08)] hover:shadow-[inset_0_0_0_1px_rgba(232,122,45,0.3)]"
            }`}
          >
            {placeholder}
          </button>

          {options.map((o, i) => {
            const isSelected = selected === o.value;
            const isHighlighted = highlighted === i;
            return (
              <button
                key={o.value}
                type="button"
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => {
                  setSelected(o.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-all duration-150 relative ${
                  isSelected
                    ? "text-primary font-semibold bg-[rgba(232,122,45,0.1)]"
                    : isHighlighted
                      ? "text-primary bg-[rgba(232,122,45,0.12)] shadow-[inset_0_0_0_1px_rgba(232,122,45,0.4)]"
                      : "text-base hover:bg-[rgba(232,122,45,0.08)]"
                }`}
                style={
                  isHighlighted
                    ? {
                        textShadow:
                          "0 0 12px rgba(232,122,45,0.55), 0 0 24px rgba(232,122,45,0.25)",
                      }
                    : undefined
                }
              >
                {isHighlighted && !isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary rounded-r shadow-[0_0_8px_rgba(232,122,45,0.8)]" />
                )}
                {o.label}
              </button>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
