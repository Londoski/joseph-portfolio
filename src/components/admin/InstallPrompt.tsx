"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa_install_dismissed");
    if (dismissed) return;

    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua) && !("MSStream" in window);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (standalone) return;
    if (ios) {
      setIsIOS(true);
      setVisible(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install() {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setVisible(false);
      setDeferred(null);
    }
  }

  function dismiss() {
    localStorage.setItem("pwa_install_dismissed", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[60]">
      <div className="bg-surface border border-[var(--color-primary)] rounded-2xl p-4 shadow-[0_0_30px_rgba(232,122,45,0.3)]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(232,122,45,0.15)] flex items-center justify-center flex-shrink-0">
            <Download size={18} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-base">Install Admin App</p>
            <p className="text-xs text-muted mt-0.5 leading-relaxed">
              {isIOS
                ? "Tap Share in Safari, then Add to Home Screen."
                : "Add JCE Admin to your home screen for quick access."}
            </p>
            {!isIOS && (
              <button
                onClick={install}
                className="mt-3 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full"
              >
                Install
              </button>
            )}
          </div>
          <button
            onClick={dismiss}
            className="text-muted hover:text-base transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}