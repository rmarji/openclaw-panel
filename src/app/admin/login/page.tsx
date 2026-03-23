"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("logout")) {
      fetch("/api/admin/logout", { method: "POST" }).then(() => {
        window.location.href = "/admin/login";
      });
    }
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { router.push("/admin"); } else {
      const data = await res.json();
      setError(data.error || "Invalid password");
    }
    setLoading(false);
  }

  return (
    <div className="login-scene flex items-center justify-center min-h-screen">
      <div className="login-card relative z-10 rounded-xl p-10 w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-lg font-semibold text-admin-primary tracking-tight">
            ClawOps
          </h1>
          <p className="text-[12px] text-admin-tertiary mt-1">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] text-admin-secondary mb-1.5">Token</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter access token"
              className="w-full px-3 py-2 bg-admin-bg border border-admin-border rounded-md text-admin-primary text-[13px] placeholder:text-admin-tertiary focus:outline-none focus:border-admin-accent transition-colors"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-[12px]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-2 bg-admin-accent hover:bg-admin-accent-hover text-white text-[13px] font-medium rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-admin-bg">
          <div className="text-admin-tertiary text-[13px]">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
