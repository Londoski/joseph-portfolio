"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, Check } from "lucide-react";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from current password");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const json = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(json.error ?? "Failed to change password");
      return;
    }

    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSuccess(false), 4000);
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-base border border-base outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(232,122,45,0.15)] transition-all text-sm pr-12";

  // password strength
  const strength = (() => {
    if (!newPassword) return 0;
    let s = 0;
    if (newPassword.length >= 8) s++;
    if (newPassword.length >= 12) s++;
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) s++;
    if (/\d/.test(newPassword)) s++;
    if (/[^A-Za-z0-9]/.test(newPassword)) s++;
    return Math.min(s, 4);
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"][strength];

  return (
    <div className="bg-surface border border-base rounded-2xl p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[rgba(232,122,45,0.12)] border border-[rgba(232,122,45,0.35)] flex items-center justify-center">
          <Lock size={16} className="text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-base">Change Password</h2>
          <p className="text-xs text-muted">Update your admin login password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {/* Current password */}
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={inputCls}
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
              aria-label={showCurrent ? "Hide" : "Show"}
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className={inputCls}
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
              aria-label={showNew ? "Hide" : "Show"}
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Strength bar */}
          {newPassword && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i <= strength ? strengthColor : "bg-base"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-muted">
                Strength: <span className="text-base">{strengthLabel}</span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm */}
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">
            Confirm New Password
          </label>
          <input
            type={showNew ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-base border border-base outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(232,122,45,0.15)] transition-all text-sm"
            placeholder="Re-enter new password"
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-[10px] text-red-400 mt-1.5">Passwords do not match</p>
          )}
          {confirmPassword && newPassword === confirmPassword && newPassword.length >= 8 && (
            <p className="text-[10px] text-green-400 mt-1.5 flex items-center gap-1">
              <Check size={10} /> Passwords match
            </p>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-2.5">
            {error}
          </p>
        )}

        {success && (
          <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/30 rounded-xl p-2.5">
            Password changed successfully
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white font-semibold px-6 py-2.5 rounded-full disabled:opacity-50 text-sm"
        >
          {saving ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}