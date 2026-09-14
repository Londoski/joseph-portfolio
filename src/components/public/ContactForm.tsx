"use client";

import { useState } from "react";
import { Select } from "@/components/ui/Select";

const projectTypes = [
  "Cinematography",
  "Videography",
  "Video Editing",
  "Commercial",
  "Social Media Content",
  "Creative Direction",
  "Other",
].map((t) => ({ value: t, label: t }));

const budgets = [
  "Under $500",
  "$500 - $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000+",
  "Not sure yet",
].map((b) => ({ value: b, label: b }));

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      form.reset();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-surface border border-base rounded-3xl p-10 text-center">
        <p className="text-primary text-3xl mb-4">OK</p>
        <h2 className="text-xl font-semibold text-base mb-2">Message sent</h2>
        <p className="text-muted text-sm">
          Thanks for reaching out. I will get back to you soon.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm text-primary hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-base rounded-3xl p-8 space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">
            Name *
          </label>
          <input
            name="name"
            required
            minLength={2}
            className="w-full px-4 py-3 rounded-2xl bg-base border border-base outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">
            Email *
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 rounded-2xl bg-base border border-base outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">
            Phone
          </label>
          <input
            name="phone"
            className="w-full px-4 py-3 rounded-2xl bg-base border border-base outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">
            Project type
          </label>
          <Select
            name="projectType"
            options={projectTypes}
            placeholder="Select..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">
            Budget range
          </label>
          <Select
            name="budgetRange"
            options={budgets}
            placeholder="Select..."
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-muted mb-2">
          Message *
        </label>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          className="w-full px-4 py-3 rounded-2xl bg-base border border-base outline-none focus:border-[var(--color-primary)] transition-colors resize-y"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-2xl p-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white font-semibold py-3 rounded-2xl transition-colors disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
