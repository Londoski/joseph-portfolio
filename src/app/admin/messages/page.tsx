"use client";

import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

type Msg = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  projectType: string | null;
  budgetRange: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Msg | null>(null);
  const [toDelete, setToDelete] = useState<Msg | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/messages");
    if (res.ok) setMessages(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function open(m: Msg) {
    setSelected(m);
    if (!m.read) {
      await fetch(`/api/admin/messages/${m.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    await fetch(`/api/admin/messages/${toDelete.id}`, { method: "DELETE" });
    setToDelete(null);
    setSelected(null);
    load();
  }

  return (
    <div className="p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-base">Messages</h1>
        <p className="text-muted text-sm mt-0.5">Contact form submissions</p>
      </header>

      {loading ? (
        <p className="text-muted text-sm">Loading...</p>
      ) : messages.length === 0 ? (
        <div className="bg-surface border border-base rounded-2xl p-10 text-center">
          <p className="text-muted text-sm">No messages yet.</p>
          <p className="text-xs text-muted mt-2">Submit the contact form on /contact to see one here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1 bg-surface border border-base rounded-2xl overflow-hidden max-h-[70vh] overflow-y-auto">
            {messages.map((m) => (
              <button
                key={m.id}
                onClick={() => open(m)}
                className={`w-full text-left p-4 border-b border-base last:border-0 hover:bg-base/50 transition-colors ${
                  selected?.id === m.id ? "bg-base" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-base text-sm truncate">{m.name}</span>
                  {!m.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                </div>
                <p className="text-xs text-muted truncate">{m.email}</p>
                <p className="text-xs text-muted truncate mt-1">{m.message.slice(0, 50)}...</p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 bg-surface border border-base rounded-2xl p-6">
            {!selected ? (
              <div className="h-full flex items-center justify-center text-muted text-sm py-20">
                Select a message to view
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-semibold text-base">{selected.name}</h2>
                    <a href={`mailto:${selected.email}`} className="text-sm text-muted hover:text-primary">{selected.email}</a>
                    {selected.phone && <p className="text-sm text-muted">{selected.phone}</p>}
                  </div>
                  <button onClick={() => setToDelete(selected)} className="text-xs text-red-400 hover:underline">
                    Delete
                  </button>
                </div>

                {(selected.projectType || selected.budgetRange) && (
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {selected.projectType && (
                      <div className="bg-base border border-base rounded-xl p-3">
                        <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Project type</p>
                        <p className="text-sm text-base">{selected.projectType}</p>
                      </div>
                    )}
                    {selected.budgetRange && (
                      <div className="bg-base border border-base rounded-xl p-3">
                        <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Budget</p>
                        <p className="text-sm text-base">{selected.budgetRange}</p>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Message</p>
                <p className="text-sm leading-relaxed whitespace-pre-line text-base">{selected.message}</p>

                <p className="text-xs text-muted mt-6 pt-5 border-t border-base">
                  Received {new Date(selected.createdAt).toLocaleString()}
                </p>

                <a
                  href={`mailto:${selected.email}?subject=Re: Your inquiry`}
                  className="inline-block mt-5 bg-primary text-white font-semibold px-5 py-2.5 rounded-full text-sm"
                >
                  Reply via Email
                </a>
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete message?"
        message={`Message from "${toDelete?.name}" will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}