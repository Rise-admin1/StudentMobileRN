"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";
import { setAdminSession } from "@/lib/admin/token";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/super-admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        token?: string;
        userType?: string;
        email?: string;
      };
      if (!response.ok || data.userType !== "ADMIN" || typeof data.token !== "string") {
        setError(data.message || "Invalid email or password");
        return;
      }
      setAdminSession(data.token, data.email || email.trim());
      router.replace("/admin");
    } catch {
      setError("Could not reach the admin service");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-[#E8EEF4] bg-white p-6 shadow-sm"
      >
        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Coach Academ</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#1A2B4B]">Admin login</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in with an admin account.</p>
        <label className="mt-6 block text-sm font-medium text-[#1A2B4B]">
          Email
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-[#E8EEF4] px-3 py-2 text-sm outline-none focus:border-[#1A2B4B]"
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-[#1A2B4B]">
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-[#E8EEF4] px-3 py-2 text-sm outline-none focus:border-[#1A2B4B]"
          />
        </label>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-lg bg-[#1A2B4B] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
