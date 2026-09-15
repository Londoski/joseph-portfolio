"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function PageViewTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    // Delay slightly so fast navigation doesn't spam
    const timer = setTimeout(() => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname }),
        keepalive: true,
      }).catch(() => {});
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}