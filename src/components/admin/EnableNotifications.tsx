"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Check } from "lucide-react";

type Status = "loading" | "unsupported" | "denied" | "enabled" | "disabled";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function EnableNotifications() {
  const [status, setStatus] = useState<Status>("loading");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [testSent, setTestSent] = useState(false);

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  useEffect(() => {
    checkStatus();
  }, []);

  async function checkStatus() {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }

    const reg = await navigator.serviceWorker.getRegistration();
    const sub = await reg?.pushManager.getSubscription();
    setStatus(sub ? "enabled" : "disabled");
  }

  async function enable() {
    setError("");
    setBusy(true);

    try {
      if (!vapidPublic) {
        setError("VAPID public key missing");
        setBusy(false);
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "disabled");
        setBusy(false);
        return;
      }

      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const existing = await reg.pushManager.getSubscription();
      const sub =
        existing ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublic),
        }));

      const res = await fetch("/api/admin/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });

      if (!res.ok) {
        throw new Error("Failed to save subscription");
      }

      setStatus("enabled");
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to enable");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/admin/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        }).catch(() => {});
        await sub.unsubscribe();
      }
      setStatus("disabled");
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  async function sendTest() {
    setBusy(true);
    setTestSent(false);
    try {
      await fetch("/api/admin/push/test", { method: "POST" });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="bg-surface border border-base rounded-2xl p-5 animate-pulse">
        <div className="h-4 w-40 bg-base rounded-full" />
      </div>
    );
  }

  if (status === "unsupported") {
    return (
      <div className="bg-surface border border-base rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <BellOff size={18} className="text-muted" />
          <div>
            <p className="text-sm font-semibold text-base">
              Notifications not supported
            </p>
            <p className="text-xs text-muted mt-0.5">
              On iPhone: install this app to your home screen first, then open it
              from the icon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="bg-surface border border-base rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <BellOff size={18} className="text-red-400" />
          <div>
            <p className="text-sm font-semibold text-base">
              Notifications blocked
            </p>
            <p className="text-xs text-muted mt-0.5">
              Enable notifications for this site in your browser settings, then
              reload.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "enabled") {
    return (
      <div className="bg-surface border border-[var(--color-primary)] rounded-2xl p-5 shadow-[0_0_20px_rgba(232,122,45,0.15)]">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(232,122,45,0.15)] flex items-center justify-center">
              <Bell size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-base">
                Notifications enabled
              </p>
              <p className="text-xs text-muted mt-0.5">
                You will be notified of new messages
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={sendTest}
              disabled={busy}
              className="text-xs px-3 py-2 rounded-full border border-base hover:border-[var(--color-primary)] hover:text-primary transition-colors disabled:opacity-50"
            >
              {testSent ? "Test sent!" : "Send test"}
            </button>
            <button
              onClick={disable}
              disabled={busy}
              className="text-xs px-3 py-2 rounded-full border border-base hover:border-red-400 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              Disable
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-base rounded-2xl p-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(232,122,45,0.15)] flex items-center justify-center">
            <Bell size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-base">
              Enable notifications
            </p>
            <p className="text-xs text-muted mt-0.5">
              Get notified when a client sends you a message
            </p>
          </div>
        </div>
        <button
          onClick={enable}
          disabled={busy}
          className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-full text-sm disabled:opacity-50"
        >
          {testSent ? <Check size={14} /> : <Bell size={14} />}
          {busy ? "Enabling..." : "Enable"}
        </button>
      </div>
      {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
    </div>
  );
}